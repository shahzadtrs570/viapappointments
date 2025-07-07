# Newsletter and Lead Capture System Integration Guide

This guide provides step-by-step instructions for integrating the newsletter signup and lead capture system into your NextJet application.

## Table of Contents

1. [Database Setup](#database-setup)
2. [API Integration](#api-integration)
3. [Frontend Implementation](#frontend-implementation)
4. [Admin Dashboard Setup](#admin-dashboard-setup)
5. [Email Notification Setup](#email-notification-setup)
6. [Testing](#testing)
7. [Working with Flexible Lead Types](#working-with-flexible-lead-types)
8. [Best Practices](#best-practices)

## Database Setup

### Running Migrations

1. Apply the database migrations to add the new tables:

```bash
pnpm db:migrate
```

2. Generate the Prisma client:

```bash
pnpm db:generate
```

## API Integration

### Setting Up API Routes

1. Add the new router files to your API package:
   - `packages/api/src/routers/newsletter/newsletter.router.ts`
   - `packages/api/src/routers/leads/leads.router.ts`

2. Update your main router in `packages/api/src/root.ts` to include the new routers:

```typescript
import { newsletterRouter } from "./routers/newsletter/newsletter.router";
import { leadsRouter } from "./routers/leads/leads.router";

export const appRouter = createTRPCRouter({
  // Existing routers
  newsletter: newsletterRouter,
  leads: leadsRouter,
});
```

## Frontend Implementation

### Adding Components to UI Package

1. Add the form components to your UI package:
   - `packages/ui/src/components/newsletter/NewsletterSignupForm.tsx`
   - `packages/ui/src/components/leads/LeadCaptureForm.tsx`

2. Add the hooks for easy integration:
   - `packages/ui/src/hooks/useNewsletterSignup.ts`
   - `packages/ui/src/hooks/useLeadCapture.ts`

3. Export the components and hooks from your UI package index file:

```typescript
// packages/ui/src/index.ts
// Export existing components

// Newsletter components
export * from './components/newsletter/NewsletterSignupForm';
export * from './hooks/useNewsletterSignup';

// Lead capture components
export * from './components/leads/LeadCaptureForm';
export * from './hooks/useLeadCapture';
```

### Implementing in Marketing Website

#### Newsletter Signup in Marketing Footer

Add the newsletter signup form to your marketing website footer:

```typescript
// apps/marketing/src/components/layout/Footer.tsx
import { NewsletterSignupForm } from "@package/ui";
import { useNewsletterSignup } from "@package/ui/hooks";

export function Footer() {
  const { subscribe } = useNewsletterSignup();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info and links */}
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Company</h2>
            {/* Other footer content */}
          </div>
          
          {/* Newsletter signup */}
          <div>
            <NewsletterSignupForm
              title="Stay Updated"
              description="Get the latest updates delivered to your inbox"
              onSubmit={subscribe}
              source="footer"
              buttonText="Subscribe"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

#### Adding a Contact Form to the Contact Page

```typescript
// apps/marketing/src/components/ContactForm.tsx
import { LeadCaptureForm } from "@package/ui/components/leads/LeadCaptureForm";
import { useLeadCapture, LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

export function ContactForm() {
  const { submitLead } = useLeadCapture();
  
  return (
    <LeadCaptureForm
      title="Contact Us"
      description="Have questions or want to learn more? Reach out to our team."
      leadType={LEAD_TYPES.OTHER} // Use predefined constants
      source="contact_page"
      onSubmit={submitLead}
      successMessage="Thanks for contacting us! We'll get back to you shortly."
      buttonText="Send Message"
      showPhoneField={true}
      showCompanyField={true}
      showMessageField={true}
    />
  );
}
```

## Admin Dashboard Setup

### Adding Admin Routes

1. Create the admin pages for leads and newsletter management:
   - `apps/dashboard/src/app/(dashboard)/admin/leads/page.tsx`
   - `apps/dashboard/src/app/(dashboard)/admin/newsletter/page.tsx`

2. Update the admin navigation sidebar:

```typescript
// apps/dashboard/src/components/layouts/AdminSidebar.tsx
// Add these entries to your existing navigation
{
  title: "Newsletter",
  href: "/admin/newsletter",
  icon: <Mail className="h-4 w-4" />,
},
{
  title: "Leads",
  href: "/admin/leads",
  icon: <UserPlus className="h-4 w-4" />,
},
```

## Email Notification Setup

### Creating Email Templates

1. Create email templates for newsletter subscriptions and lead notifications.
2. For leads, consider adding the lead type to the subject or content for better identification.

## Working with Flexible Lead Types

The lead capture system is designed with a flexible approach to lead types. This means you can:

1. **Use predefined types** through the `LEAD_TYPES` constant for common lead categories:

```typescript
import { LEAD_TYPES } from "@package/ui/hooks/useLeadCapture";

// Use the predefined constants
<LeadCaptureForm leadType={LEAD_TYPES.MEETING} />
```

2. **Create custom lead types** for specific needs by simply using string values:

```typescript
// Custom lead type
<LeadCaptureForm leadType="product_demo" />
```

### Adding New Lead Types

To add a new lead type:

1. You can simply use it as a string value in your components
2. Optionally, add it to the `LEAD_TYPES` constant for consistency:

```typescript
// packages/ui/src/hooks/useLeadCapture.ts
export const LEAD_TYPES = {
  MEETING: 'meeting',
  WORKSHOP: 'workshop',
  SERVICE: 'service',
  CONSULTATION: 'consultation',
  OTHER: 'other',
  PRODUCT_DEMO: 'product_demo', // New type
} as const;
```

### Admin Dashboard Display

The admin dashboard is designed to dynamically discover and display all lead types in your system:

1. The lead type filter automatically shows all types that exist in your database
2. The color coding for lead types is handled automatically
3. New lead types will appear in the filters as soon as they're used in form submissions

### Best Practices for Lead Types

1. **Consistency**: While you can use any string for lead types, try to maintain consistent naming conventions
2. **Lowercase and underscores**: Use lowercase with underscores (e.g., `product_demo`) for better readability
3. **Add to constants**: Consider adding frequently used types to the `LEAD_TYPES` constant
4. **Metadata**: Use metadata to store additional context about specific lead types
5. **Documentation**: Keep a list of your lead types and their purposes in your project documentation

## Testing

### Manual Testing Checklist

1. **Newsletter Signup**:
   - Submit the form with valid email
   - Try submitting with the same email (should handle duplicates)
   - Test email validation
   - Verify the welcome email is received
   - Check data in the admin dashboard

2. **Lead Capture Forms**:
   - Test all required field validations
   - Submit with complete information
   - Test with different lead types, including custom types
   - Verify admin notification email
   - Check lead appears in admin dashboard
   - Test status updates in admin dashboard

3. **Admin Dashboard**:
   - Test pagination
   - Test filtering and search, especially by lead type
   - Verify lead type filters show all types that exist in the system
   - Test CSV export

## Best Practices

### Form UX Tips

1. **Feedback**: Always provide clear feedback after form submission
2. **Validation**: Implement real-time validation when possible
3. **Accessibility**: Ensure forms are accessible with proper labels and ARIA attributes
4. **Mobile-friendly**: Test thoroughly on mobile devices
5. **Error states**: Provide clear, helpful error messages

### Lead Management Tips

1. **Response time**: Set up processes to respond to leads quickly
2. **Segmentation**: Use the flexible lead types for better segmentation
3. **Follow-up**: Create automated follow-up sequences for different lead types
4. **Analytics**: Track conversion rates from different lead sources and types
5. **Data retention**: Define a policy for how long to keep lead data

### Newsletter Best Practices

1. **Double opt-in**: Consider implementing double opt-in for better list quality
2. **Unsubscribe**: Make it easy for subscribers to unsubscribe
3. **Segmentation**: Use tags to segment your list for targeted content
4. **Regular schedule**: Establish a consistent sending schedule
5. **Value-first**: Ensure newsletter content provides value to subscribers

### Adding Components to UI Package

1. Add the form components to your UI package:
   - `packages/ui/src/components/newsletter/NewsletterSignupForm.tsx`
   - `packages/ui/src/components/leads/LeadCaptureForm.tsx`

2. Add the hooks for easy integration:
   - `packages/ui/src/hooks/useNewsletterSignup.ts`
   - `packages/ui/src/hooks/useLeadCapture.ts`

3. Export the components and hooks from your UI package index file:

```typescript
// packages/ui/src/index.ts
// Export existing components

// Newsletter components
export * from './components/newsletter/NewsletterSignupForm';
export * from './hooks/useNewsletterSignup';

// Lead capture components
export * from './components/leads/LeadCaptureForm';
export * from './hooks/useLeadCapture';
```

### Implementing in Marketing Website

#### Newsletter Signup in Marketing Footer

Add the newsletter signup form to your marketing website footer:

```typescript
// apps/marketing/src/components/layout/Footer.tsx
import { NewsletterSignupForm } from "@package/ui";
import { useNewsletterSignup } from "@package/ui/hooks";

export function Footer() {
  const { subscribe } = useNewsletterSignup();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info and links */}
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Company</h2>
            {/* Other footer content */}
          </div>
          
          {/* Newsletter signup */}
          <div>
            <NewsletterSignupForm
              title="Stay Updated"
              description="Get the latest updates delivered to your inbox"
              onSubmit={subscribe}
              source="footer"
              buttonText="Subscribe"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
```

#### Adding a Contact Form to the Contact Page

```typescript
// apps/marketing/src/app/contact/page.tsx
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="text-lg mb-12 text-center">
          We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>
        
        <ContactForm />
      </div>
    </main>
  );
}
```

#### Adding a Meeting Request Form to the Services Page

```typescript
// apps/marketing/src/app/services/[slug]/page.tsx
import { ServiceInquiryForm } from "@/components/ServiceInquiryForm";

export default function ServicePage({ params }) {
  // Fetch service data using the slug
  const service = {
    name: "Web Development",
    // other service data
  };
  
  return (
    <main>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
            {/* Service details */}
          </div>
          
          <div>
            <ServiceInquiryForm service={service.name} />
          </div>
        </div>
      </div>
    </main>
  );
}
```

## Admin Dashboard Setup

### Adding Admin Routes

1. Create the admin pages for leads and newsletter management:
   - `apps/dashboard/src/app/(dashboard)/admin/leads/page.tsx`
   - `apps/dashboard/src/app/(dashboard)/admin/newsletter/page.tsx`

2. Update the admin navigation sidebar:

```typescript
// apps/dashboard/src/components/layouts/AdminSidebar.tsx
// Add these entries to your existing navigation
{
  title: "Newsletter",
  href: "/admin/newsletter",
  icon: <Mail className="h-4 w-4" />,
},
{
  title: "Leads",
  href: "/admin/leads",
  icon: <UserPlus className="h-4 w-4" />,
},
```

### Setting Up Role-Based Access Control

Make sure only admin users can access these pages:

```typescript
// In your admin page components
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Unauthorized } from "@/components/Unauthorized";

export default function AdminLeadsPage() {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Unauthorized />;
  }
  
  // Admin page content
}
```

## Email Notification Setup

### Creating Email Templates

1. Create email templates for newsletter subscriptions and lead notifications:

```typescript
// packages/emails/src/templates/NewsletterWelcome.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';

export const NewsletterWelcome = ({
  name,
}: {
  name?: string;
}) => (
  <EmailLayout>
    <Text className="text-xl">Welcome{name ? `, ${name}` : ''}!</Text>
    <Text>
      Thank you for subscribing to our newsletter. You'll now receive our latest updates,
      news, and special offers directly to your inbox.
    </Text>
    <Button href="https://yourwebsite.com/blog">
      Check Out Our Latest Content
    </Button>
  </EmailLayout>
);
```

2. Create a lead notification template:

```typescript
// packages/emails/src/templates/LeadNotification.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLayout } from '../components/EmailLayout';

export const LeadNotification = ({
  leadType,
  name,
  email,
  message,
}: {
  leadType: string;
  name: string;
  email: string;
  message?: string;
}) => (
  <EmailLayout>
    <Text className="text-xl">New {leadType} Lead</Text>
    <Text>
      You've received a new lead from your website:
    </Text>
    <Section className="bg-gray-100 p-4 rounded">
      <Text><strong>Name:</strong> {name}</Text>
      <Text><strong>Email:</strong> {email}</Text>
      {message && (
        <Text><strong>Message:</strong> {message}</Text>
      )}
    </Section>
    <Button href="https://yourwebsite.com/admin/leads">
      View in Dashboard
    </Button>
  </EmailLayout>
);
```

### Setting Up Email Sending

Update your API handlers to send emails:

```typescript
// packages/api/src/routers/newsletter/newsletter.router.ts
// In the subscribe procedure:
try {
  const subscriber = await ctx.prisma.newsletterSubscriber.create({
    data: {
      email: input.email,
      name: input.name,
      source: input.source || 'website',
      tags: input.tags || [],
    },
  });

  // Send welcome email
  await sendEmail({
    to: input.email,
    subject: 'Welcome to Our Newsletter',
    template: NewsletterWelcome,
    props: { name: input.name },
  });

  return subscriber;
} catch (error) {
  // Error handling
}
```

Similarly for lead notifications:

```typescript
// packages/api/src/routers/leads/leads.router.ts
// In the submit procedure:
try {
  const lead = await ctx.prisma.lead.create({
    data: {
      // Lead data
    },
  });

  // Send notification to admin
  await sendEmail({
    to: process.env.ENV_CLIENT_AUTH_ADMIN_EMAIL || '',
    subject: `New ${input.leadType} Lead: ${input.name}`,
    template: LeadNotification,
    props: {
      leadType: input.leadType,
      name: input.name,
      email: input.email,
      message: input.message,
    },
  });

  return { success: true, leadId: lead.id };
} catch (error) {
  // Error handling
}
```

## Testing

### Manual Testing Checklist

1. **Newsletter Signup**:
   - Submit the form with valid email
   - Try submitting with the same email (should handle duplicates)
   - Test email validation
   - Verify the welcome email is received
   - Check data in the admin dashboard

2. **Lead Capture Forms**:
   - Test all required field validations
   - Submit with complete information
   - Verify admin notification email
   - Check lead appears in admin dashboard
   - Test status updates in admin dashboard

3. **Admin Dashboard**:
   - Test pagination
   - Test filtering and search
   - Test bulk actions (if implemented)
   - Test CSV export

### Automated Testing

Create test files for critical components and API endpoints:

```typescript
// Example test for newsletter signup form
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsletterSignupForm } from './NewsletterSignupForm';

describe('NewsletterSignupForm', () => {
  test('submits with valid email', async () => {
    const mockSubmit = jest.fn();
    render(
      <NewsletterSignupForm
        title="Subscribe"
        onSubmit={mockSubmit}
      />
    );
    
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: '',
      });
    });
  });
  
  // Add more tests
});
```

## Best Practices

### Form UX Tips

1. **Feedback**: Always provide clear feedback after form submission
2. **Validation**: Implement real-time validation when possible
3. **Accessibility**: Ensure forms are accessible with proper labels and ARIA attributes
4. **Mobile-friendly**: Test thoroughly on mobile devices
5. **Error states**: Provide clear, helpful error messages

### Lead Management Tips

1. **Response time**: Set up processes to respond to leads quickly
2. **Segmentation**: Tag leads based on source, interest, and other attributes
3. **Follow-up**: Create automated follow-up sequences for different lead types
4. **Analytics**: Track conversion rates from different lead sources
5. **Data retention**: Define a policy for how long to keep lead data

### Newsletter Best Practices

1. **Double opt-in**: Consider implementing double opt-in for better list quality
2. **Unsubscribe**: Make it easy for subscribers to unsubscribe
3. **Segmentation**: Use tags to segment your list for targeted content
4. **Regular schedule**: Establish a consistent sending schedule
5. **Value-first**: Ensure newsletter content provides value to subscribers

## Customization Options

### Styling the Forms

All components use ShadCN UI and Tailwind CSS, which makes them easy to customize:

```typescript
// Custom styles example
<NewsletterSignupForm
  title="Join Our Mailing List"
  description="Get exclusive content delivered to your inbox"
  onSubmit={subscribe}
  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg"
  buttonText="Sign Me Up"
/>
```

### Creating New Lead Forms

You can easily create new lead capture forms for different purposes:

1. Define custom fields based on the specific requirements
2. Create a new form component that uses the LeadCaptureForm
3. Add the form to the relevant page or section
4. Customize the success messages and follow-up process