// packages/api/src/routers/newsletter/newsletter.router.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { sendEmail } from "@package/email";

// Validation schema for newsletter subscription
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Validation schema for subscribers query
const getSubscribersQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const newsletterRouter = createTRPCRouter({
  // Public procedure for subscribing to the newsletter
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if already subscribed
        const existingSubscriber = await ctx.prisma.newsletterSubscriber.findUnique({
          where: { email: input.email },
        });

        if (existingSubscriber) {
          // If already subscribed but marked as inactive, reactivate
          if (!existingSubscriber.isActive) {
            const reactivated = await ctx.prisma.newsletterSubscriber.update({
              where: { email: input.email },
              data: {
                isActive: true,
                tags: [
                  ...(existingSubscriber.tags || []),
                  ...(input.tags || []),
                ].filter((tag, index, self) => self.indexOf(tag) === index), // Remove duplicates
                updatedAt: new Date(),
              },
            });

            // Send welcome back email
            await sendEmail({
              to: input.email,
              subject: "Welcome Back to Our Newsletter!",
              template: "newsletter-welcome-back",
              props: {
                name: input.name || reactivated.name || "there",
                unsubscribeUrl: `${process.env.MARKETING_URL}/unsubscribe?token=${reactivated.id}`,
              },
            });

            return {
              subscriberId: reactivated.id,
              success: true,
              reactivated: true,
            };
          }

          // Already subscribed and active
          return {
            subscriberId: existingSubscriber.id,
            success: true,
            alreadySubscribed: true,
          };
        }

        // Create new subscriber
        const subscriber = await ctx.prisma.newsletterSubscriber.create({
          data: {
            email: input.email,
            name: input.name,
            source: input.source || "website",
            tags: input.tags || [],
            isActive: true,
          },
        });

        // Send welcome email
        await sendEmail({
          to: input.email,
          subject: "Welcome to Our Newsletter!",
          template: "newsletter-welcome",
          props: {
            name: input.name || "there",
            unsubscribeUrl: `${process.env.MARKETING_URL}/unsubscribe?token=${subscriber.id}`,
          },
        });

        return {
          subscriberId: subscriber.id,
          success: true,
          new: true,
        };
      } catch (error) {
        console.error("Error subscribing to newsletter:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to the newsletter. Please try again.",
        });
      }
    }),

  // Public procedure for unsubscribing from the newsletter
  unsubscribe: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find subscriber by ID/token
        const subscriber = await ctx.prisma.newsletterSubscriber.findUnique({
          where: { id: input.token },
        });

        if (!subscriber) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Subscription not found",
          });
        }

        // Update to inactive instead of deleting
        await ctx.prisma.newsletterSubscriber.update({
          where: { id: input.token },
          data: {
            isActive: false,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          email: subscriber.email,
        };
      } catch (error) {
        console.error("Error unsubscribing from newsletter:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to unsubscribe. Please try again.",
        });
      }
    }),

  // Protected procedure for admin to get subscribers
  getSubscribers: protectedProcedure
    .input(getSubscribersQuerySchema)
    .query(async ({ ctx, input }) => {
      // Check if user has admin access
      if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access newsletter subscribers",
        });
      }

      // Build filter based on input
      const filter: any = {};

      if (input.isActive !== undefined) {
        filter.isActive = input.isActive;
      }

      if (input.tags && input.tags.length > 0) {
        filter.tags = {
          hasSome: input.tags,
        };
      }

      if (input.search) {
        filter.OR = [
          { email: { contains: input.search, mode: "insensitive" } },
          { name: { contains: input.search, mode: "insensitive" } },
        ];
      }

      // Get subscribers with pagination
      const subscribers = await ctx.prisma.newsletterSubscriber.findMany({
        where: filter,
        orderBy: { subscribedAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      // Handle pagination
      let nextCursor: string | undefined = undefined;
      if (subscribers.length > input.limit) {
        const nextItem = subscribers.pop();
        nextCursor = nextItem?.id;
      }

      // Get tag statistics
      const tagStats = await ctx.prisma.$queryRaw`
        SELECT unnest(tags) as tag, count(*) as count
        FROM "NewsletterSubscriber"
        GROUP BY tag
        ORDER BY count DESC
      `;

      return {
        subscribers,
        nextCursor,
        tagStats,
        totalCount: await ctx.prisma.newsletterSubscriber.count({
          where: filter,
        }),
        activeCount: await ctx.prisma.newsletterSubscriber.count({
          where: { ...filter, isActive: true },
        }),
      };
    }),

  // Protected procedure for admin to send newsletter
  sendNewsletter: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
        tags: z.array(z.string()).optional(),
        testEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has admin access
      if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to send newsletters",
        });
      }

      try {
        // If this is a test email, only send to the test address
        if (input.testEmail) {
          await sendEmail({
            to: input.testEmail,
            subject: `[TEST] ${input.subject}`,
            template: "newsletter",
            props: {
              content: input.content,
              isTest: true,
              unsubscribeUrl: `${process.env.MARKETING_URL}/unsubscribe?demo=true`,
            },
          });

          return {
            success: true,
            isTest: true,
            sentTo: 1,
          };
        }

        // Build filter based on input
        const filter: any = {
          isActive: true,
        };

        if (input.tags && input.tags.length > 0) {
          filter.tags = {
            hasSome: input.tags,
          };
        }

        // Get all subscribers that match the filter
        const subscribers = await ctx.prisma.newsletterSubscriber.findMany({
          where: filter,
          select: {
            id: true,
            email: true,
            name: true,
          },
        });

        // Send newsletter to each subscriber
        let sentCount = 0;
        for (const subscriber of subscribers) {
          try {
            await sendEmail({
              to: subscriber.email,
              subject: input.subject,
              template: "newsletter",
              props: {
                name: subscriber.name || "there",
                content: input.content,
                unsubscribeUrl: `${process.env.MARKETING_URL}/unsubscribe?token=${subscriber.id}`,
              },
            });
            sentCount++;
          } catch (error) {
            console.error(`Error sending newsletter to ${subscriber.email}:`, error);
            // Continue with other subscribers even if one fails
          }
        }

        return {
          success: true,
          sentTo: sentCount,
          totalSubscribers: subscribers.length,
        };
      } catch (error) {
        console.error("Error sending newsletter:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send newsletter. Please try again.",
        });
      }
    }),

  // Protected procedure for admin to delete a subscriber
  deleteSubscriber: protectedProcedure
    .input(z.object({ subscriberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user has super admin access
      if (ctx.user.role !== "SUPER_ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only super admins can delete subscribers",
        });
      }

      try {
        await ctx.prisma.newsletterSubscriber.delete({
          where: { id: input.subscriberId },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting subscriber:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete subscriber. Please try again.",
        });
      }
    }),
});
