/* eslint-disable */
import type { Metadata } from "next"
import { useTranslation } from "@/lib/i18n"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "FAQs | Check The Lot",
  description:
    "Find answers to common questions about Check The Lot - the AI-powered marketplace for vehicles, homes, boats, and more.",
}

export default async function FAQPage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, ["landing", "common"])

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is Check The Lot?",
          a: "Check The Lot is an AI-powered marketplace that unifies listings for vehicles, homes, boats, motorcycles, RVs, and more. We use intelligent search technology to help you find exactly what you're looking for using natural language.",
        },
        {
          q: "How does the AI search work?",
          a: "Our AI understands natural language, so you can search the way you talk. Instead of filtering through countless options, just describe what you want - like 'SUV under 40k in Miami' or '3-bed home with pool in Austin' - and our AI will find the best matches.",
        },
        {
          q: "Is Check The Lot free to use?",
          a: "Yes! Browsing and searching Check The Lot is completely free. For dealers, posting basic listings is also free. We offer premium advertising solutions starting at $995/month for dealers who want enhanced visibility.",
        },
      ],
    },
    {
      category: "For Buyers",
      questions: [
        {
          q: "How do I contact a seller?",
          a: "Each listing has a contact button that allows you to send a message directly to the seller. You can also see their phone number if they've chosen to display it publicly.",
        },
        {
          q: "Can I save my favorite listings?",
          a: "Yes! Click the heart icon on any listing to save it to your favorites. You can view all your saved listings in your account dashboard.",
        },
        {
          q: "How do I know if a listing is legitimate?",
          a: "We verify dealer accounts and mark them with a verified badge. We also monitor listings for suspicious activity. Always meet in safe, public places and never send money before seeing the item in person.",
        },
        {
          q: "Can I negotiate prices?",
          a: "Pricing and negotiations are between you and the seller. Use the contact features to communicate directly with sellers about pricing and terms.",
        },
      ],
    },
    {
      category: "For Dealers/Sellers",
      questions: [
        {
          q: "How do I list my inventory?",
          a: "Create a dealer account, verify your business information, and you can start uploading your inventory. Our platform supports bulk uploads for large inventories.",
        },
        {
          q: "What are the listing requirements?",
          a: "All listings must include accurate descriptions, clear photos, honest pricing, and comply with applicable laws. Misleading or fraudulent listings will be removed.",
        },
        {
          q: "How does premium advertising work?",
          a: "Premium advertising ($995/month) gives you featured placement, priority in search results, enhanced badges, advanced analytics, and dedicated support. Contact us to learn more.",
        },
        {
          q: "Can I edit my listings after posting?",
          a: "Yes, you can edit, update, or remove your listings at any time from your dealer dashboard.",
        },
        {
          q: "How do I track my listing performance?",
          a: "Your dealer dashboard includes analytics showing views, inquiries, and engagement for each listing. Premium members get advanced analytics and insights.",
        },
      ],
    },
    {
      category: "Account & Payments",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Sign Up' in the navigation menu and follow the prompts. You can create a buyer account or a dealer account depending on your needs.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit cards and debit cards for premium advertising subscriptions. All payment information is securely processed and encrypted.",
        },
        {
          q: "Can I cancel my premium subscription?",
          a: "Yes, you can cancel your premium subscription at any time from your account settings. You'll continue to have access through the end of your billing period.",
        },
        {
          q: "Is my payment information secure?",
          a: "Absolutely. We use industry-standard encryption and never store your full payment details on our servers. All transactions are processed through secure payment gateways.",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "What browsers are supported?",
          a: "Check The Lot works best on the latest versions of Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.",
        },
        {
          q: "Is there a mobile app?",
          a: "Our website is fully mobile-responsive and works great on all devices. A dedicated mobile app is coming soon!",
        },
        {
          q: "I'm having technical issues. What should I do?",
          a: "Contact our support team at info@checkthelot.com with details about the issue you're experiencing. Include your browser, device type, and any error messages.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about Check The Lot
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <Card
                key={sectionIndex}
                className="glass-strong p-8 border-border/50 animate-fade-in-up"
                style={{ animationDelay: `${sectionIndex * 0.1}s` }}
              >
                <h2 className="font-display text-2xl font-bold mb-6 text-primary">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${sectionIndex}-${faqIndex}`}
                      className="border-b border-border/30"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            ))}
          </div>

          {/* Contact CTA */}
          <Card className="glass-strong p-12 border-primary/20 text-center mt-12 animate-fade-in-up">
            <div className="space-y-6">
              <MessageCircle className="h-12 w-12 text-primary mx-auto" />
              <div className="space-y-3">
                <h2 className="font-display text-3xl font-bold">
                  Still have questions?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our team is here to help. Get in touch with us directly.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="glow-hover px-8">
                  Contact Support
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
