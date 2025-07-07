# Email Package Documentation

## Overview

The `@package/email` package provides a flexible email delivery system supporting multiple providers (Resend, Gmail, OneSignal) with React-based email templates and custom provider configurations.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Email Providers](#email-providers)
- [Templates](#templates)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [API Reference](#api-reference)

## Quick Start

```typescript
import { sendEmail } from "@package/email"
import { MagicLinkSignIn } from "@package/email/templates"

// Send an email
await sendEmail({
  email: ["user@example.com"],
  subject: "Magic Link Sign In",
  react: MagicLinkSignIn({
    email: "user@example.com",
    url: "https://example.com/auth/verify"
  })
})
```

## Email Providers

### 1. Resend (Default)

Resend is the recommended provider for production use, offering reliable delivery and analytics.

```typescript
import { sendEmail } from "@package/email"

// Configuration
const config = {
  RESEND_KEY: "re_123...",
  ENV_CLIENT_EMAIL_PROVIDER: "resend",
  RESEND_EMAIL_DOMAIN: "email.yourapp.com"
}

// Usage
await sendEmail({
  from: "MyApp <noreply@email.yourapp.com>",
  email: ["user@example.com"],
  subject: "Welcome",
  react: EmailTemplate(props)
})
```

Features:
- Built-in analytics
- High deliverability
- Custom domains
- Webhook support
- Email validation

### 2. Gmail Custom Provider

Gmail provider is ideal for development and testing environments.

```typescript
import { sendEmail } from "@package/email"
import { EmailProviders } from "@package/email"

// Configuration
const config = {
  ENV_CLIENT_EMAIL_PROVIDER: "gmail",
  ENV_CLIENT_AUTH_GMAIL_SENDER: "your-email@gmail.com",
  ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD: "app_password", // Gmail App Password
  ENV_CLIENT_AUTH_GMAIL_FROM: "noreply@yourapp.com",
  ENV_CLIENT_AUTH_ADMIN_EMAIL: "admin@yourapp.com"
}

// Implementation Details
const mailOptions = fnEmailBuildMailOptions(
  Users.User,
  recipientEmail,
  EmailProviders.Gmail
)

const transport = fnEmailTransportorCreate(EmailProviders.Gmail)
await transport.sendEmail(mailOptions)
```

Features:
- SMTP-based sending
- App Password authentication
- Rate limiting built-in
- Good for development
- Supports attachments

### 3. OneSignal Custom Provider

OneSignal is optimized for transactional and notification emails.

```typescript
import { sendEmail } from "@package/email"
import { EmailProviders } from "@package/email"

// Configuration
const config = {
  ENV_CLIENT_EMAIL_PROVIDER: "onesignal",
  ENV_CLIENT_AUTH_ONESIGNAL_APP_ID: "your-app-id",
  ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY: "your-api-key"
}

// Implementation Details
const mailOptions = fnEmailBuildMailOptions(
  Users.User,
  recipientEmail,
  EmailProviders.OneSignal
)

// OneSignal specific options
const oneSignalOptions = {
  include_email_tokens: [recipientEmail],
  channel_for_external_user_ids: [userId],
  include_unsubscribed: true
}
```

Features:
- Push notification integration
- User segmentation
- Delivery tracking
- A/B testing
- Automated campaigns

## Templates

The package includes several pre-built React email templates:

```typescript
import {
  InvoicePaymentFailed,
  MagicLinkSignIn,
  TrialEndingSoon,
  WaitlistConfirmationEmail
} from "@package/email/templates"

// Using a template
await sendEmail({
  email: [user.email],
  subject: "Sign in to your account",
  react: MagicLinkSignIn({
    email: user.email,
    url: magicLink
  })
})
```

## Custom Provider Implementation

### 1. Mail Options Builder
```typescript
// _customEmailBuildMailOptions.ts
const mailOptions = fnEmailBuildMailOptions(
  Users.User,
  "user@example.com",
  EmailProviders.Gmail
)

// Returns provider-specific options
{
  options: {
    from: "noreply@yourapp.com",
    to: "user@example.com"
  }
}
```

### 2. Provider Configuration
```typescript
// _customEmailProviders.ts
const config = fnEmailProviderCredentialsGet(EmailProviders.Gmail)

// Returns credentials for the specified provider
{
  gmail: {
    user: process.env.ENV_CLIENT_AUTH_GMAIL_SENDER,
    pass: process.env.ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD
  }
}
```

### 3. Email Transport
```typescript
// _customEmailTransportor.ts
const transport = fnEmailTransportorCreate(EmailProviders.Gmail)

// Creates provider-specific transport
{
  status: 200,
  sendEmail: async (mailOptions) => {
    // Provider-specific sending logic
  }
}
```

## Environment Variables

```env
# General
ENV_CLIENT_EMAIL_PROVIDER=resend|gmail|onesignal
NEXT_PUBLIC_APP_NAME=Your App Name

# Resend
RESEND_KEY=re_123...
RESEND_EMAIL_DOMAIN=email.yourapp.com

# Gmail
ENV_CLIENT_AUTH_GMAIL_SENDER=your-email@gmail.com
ENV_CLIENT_AUTH_GMAIL_SENDER_PASSWORD=app_password
ENV_CLIENT_AUTH_GMAIL_FROM=noreply@yourapp.com
ENV_CLIENT_AUTH_ADMIN_EMAIL=admin@yourapp.com

# OneSignal
ENV_CLIENT_AUTH_ONESIGNAL_APP_ID=your-app-id
ENV_CLIENT_AUTH_ONESIGNAL_REST_API_KEY=your-api-key
```

## Creating Custom Templates

```typescript
import { Body, Container, Html, Text } from "@react-email/components"

export default function CustomTemplate({ name }: { name: string }) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Hello {name}!</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

## Best Practices

1. **Provider Selection**
   - Use Resend for production
   - Gmail for development/testing
   - OneSignal for notification-heavy apps

2. **Template Management**
   - Keep templates in separate files
   - Use TypeScript for props
   - Include preview text
   - Test with multiple email clients

3. **Error Handling**
   ```typescript
   try {
     await sendEmail(options)
   } catch (error) {
     logger.error("Failed to send email", {
       error,
       template: "MagicLinkSignIn",
       recipient: options.email
     })
   }
   ```

4. **Security**
   - Validate email addresses
   - Use environment variables for credentials
   - Implement rate limiting
   - Follow email best practices

## Contributing

When contributing to the email package:

1. Follow React Email components guidelines
2. Test templates across providers
3. Update documentation
4. Add appropriate TypeScript types
5. Consider email client compatibility

## License

This package is part of the NextJet project and is subject to its licensing terms. 