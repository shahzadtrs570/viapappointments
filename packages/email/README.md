# Email Package

This package handles email templates for the Srenova application.

## Internationalization (i18n)

The email templates support internationalization using the language preference set by users in either the dashboard or marketing applications.

### How it works

1. The system detects the user's language preference from cookies:
   - `i18next-dashboard` cookie from the dashboard app
   - `i18next` cookie from the marketing app

2. If no language preference is detected, or if the detected language is not supported, English (en) is used as the fallback.

3. Supported languages:
   - English (en)
   - French (fr)
   - Italian (it)

### Translation Files

Translation files are stored in the `locales` directory, organized by language code and template name:

```
locales/
  en/
    property-status-update.json
    magic-link-signin.json
  fr/
    property-status-update.json
    magic-link-signin.json
  it/
    property-status-update.json
    magic-link-signin.json
```

### Using Translations in Templates

To use translations in an email template:

1. Import the translation utility:
   ```tsx
   import { createTranslator } from "../utils"
   ```

2. Add the `cookieString` prop to your component props:
   ```tsx
   interface EmailProps {
     // ... other props
     cookieString?: string
   }
   ```

3. Create a translator function for your template:
   ```tsx
   const t = createTranslator('template-name', cookieString)
   ```

4. Use the translator function in your template:
   ```tsx
   <Text>{t('greeting')}</Text>
   ```

5. For translations with variables:
   ```tsx
   <Text>{t('welcome', { name: userName })}</Text>
   ```

### Adding a New Template with Translations

1. Create translation files for each supported language:
   - `locales/en/template-name.json`
   - `locales/fr/template-name.json`
   - `locales/it/template-name.json`

2. Use the translation utility in your template as described above.

### Sending Emails with Language Support

When sending emails, pass the user's cookie string to the email template:

```tsx
import { cookies } from 'next/headers'
import { render } from '@react-email/render'
import { MyEmailTemplate } from '@/packages/email'

// In a server action or API route
const cookieString = cookies().toString()

const emailHtml = render(
  <MyEmailTemplate
    // ... other props
    cookieString={cookieString}
  />
)

// Send the email with the rendered HTML
```

This ensures the email is rendered in the user's preferred language. 