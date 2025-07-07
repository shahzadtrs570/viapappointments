# Internationalization (i18n) Setup for Marketing Site

This document explains the internationalization implementation for the `marketing` app, leveraging `i18next` and `react-i18next` within the Next.js App Router.

## Core Concepts

The primary goal is to support multiple languages (`en`, `fr`, `it`) while ensuring correct Server-Side Rendering (SSR) and preventing hydration mismatches or flashes of untranslated content (FOUC) on the client.

This is achieved by:

1.  **Loading initial translations on the server:** The root layout determines the required language and namespaces and pre-loads the necessary translation files.
2.  **Passing initial state to the client:** The loaded language, namespaces, and translation resources are passed from the server component (layout) to a client-side provider.
3.  **Synchronous client initialization:** The client-side provider uses the received state to initialize its own `i18next` instance synchronously *before* any child components render.
4.  **Consistent translation access:** Client components use a custom hook (`useClientTranslation`) to access the correctly initialized `i18next` instance provided via React context.

## File Structure and Key Components

Located in `apps/marketing/src/lib/i18n`:

*   **`settings.ts`**: 
    *   Defines supported `languages` (`en`, `fr`, `it`).
    *   Specifies the `defaultNS` (`common`).
    *   Exports `getOptions` function to provide base configuration for `i18next.init` (e.g., `fallbackLng`, `supportedLngs`, `defaultNS`).
    *   Defines the `cookieName` used for language persistence if required (though path-based detection is primary).

*   **`getInitialResources.ts`**: 
    *   Contains the server-side utility function `getInitialResources(lng, ns)`.
    *   This function is called within Server Components (like the root layout).
    *   It creates a temporary `i18next` instance, uses `resourcesToBackend` to dynamically `import()` the required `.json` translation files from `public/locales/[lng]/[ns].json` based on the requested language and namespaces.
    *   It extracts and returns the loaded `resources` in the format expected by `i18next`.

*   **`I18nProvider.tsx`**: 
    *   A Client Component (`"use client"`) responsible for initializing `i18next` on the client.
    *   Receives `lng`, `namespaces`, and `initialResources` as props from the Server Component (root layout).
    *   Uses `useState` with `createInstance` to create a stable, dedicated `i18next` instance *once* upon mounting.
    *   This instance is initialized *synchronously* using the props (`lng`, `namespaces`, `initialResources`) passed from the server.
    *   It wraps its children with the standard `I18nextProvider` from `react-i18next`, providing the initialized instance via context.

*   **`index.ts`** (Likely contains server-side `useTranslation`)
    *   Exports a `useTranslation` hook intended for **Server Components**.
    *   It likely initializes an `i18next` instance on the fly using `createInstance`, loads the requested namespaces via `resourcesToBackend`, and returns the `t` function and `i18n` instance.
    *   This is used in components like `layout.tsx` for generating metadata or rendering server-only translated text.

*   **`client.ts`** (Likely contains client-side `useTranslation` - **DEPRECATED?**)
    *   *Note: The current implementation uses `useClientTranslation` exported directly from `I18nProvider.tsx`. This file might be outdated or serve a different purpose.* 
    *   If used, it likely exports a `useTranslation` hook specifically for **Client Components**, potentially wrapping `useTranslationOrg` from `react-i18next` and relying on the context provided by `I18nProvider`.

## Integration Flow

1.  **Request:** A user requests a page like `/fr/eligibility`.
2.  **Layout (`apps/marketing/src/app/[lng]/layout.tsx`)**: 
    *   The RootLayout receives `lng` ("fr") as a parameter.
    *   It calls `await getInitialResources("fr", ["common", "navbar", "footer", "landing"])` to load translations on the server.
    *   It renders the `I18nProvider` Client Component, passing down `lng`, `namespaces`, and the loaded `initialResources`.
3.  **Provider (`I18nProvider.tsx`)**: 
    *   Receives the props.
    *   Initializes its local `i18next` instance synchronously with these props.
    *   Provides this instance via `I18nextProvider`.
4.  **Client Component (e.g., `FooterMenu.tsx`)**: 
    *   Calls `useClientTranslation("common")` (exported from `I18nProvider.tsx`).
    *   This hook gets the fully initialized `i18next` instance from the provider's context.
    *   Calls to `t("footer.contact")` resolve immediately using the pre-loaded resources.

## Translation Files

*   Located in `apps/marketing/public/locales/`
*   Organized by language (e.g., `en/`, `fr/`, `it/`).
*   Within each language folder, translations are split by namespace (e.g., `common.json`, `landing.json`, `footer.json`).

## Usage in Components

*   **Server Components:** Import and use `useTranslation` from `@/lib/i18n` (likely `index.ts`). Remember to `await` it and pass the `lng` and required `namespaces`.
*   **Client Components:** Import and use `useClientTranslation` from `@/lib/i18n/I18nProvider`. Pass the desired `namespace` (or omit for default). Ensure the component is a child of `I18nProvider`.

This setup ensures a smooth, flicker-free, and correctly hydrated internationalized experience. 

## Adding Translations for a New Section/Namespace

When adding internationalization support for a new part of the marketing site (e.g., an "about" page or a "pricing" section), follow these steps:

1.  **Define a Namespace:** Choose a unique name for the translation group (e.g., `"about"`, `"pricing"`). This will be your namespace.

2.  **Create Translation Files:**
    *   For each supported language in `public/locales/`, create a new JSON file named after your namespace.
    *   Example: `public/locales/en/about.json`, `public/locales/fr/about.json`, `public/locales/it/about.json`.
    *   Populate these files with the necessary key-value translation pairs.

3.  **Update Root Layout for Client-Side Use:**
    *   **Crucial Step:** If any client components within the new section need translations, you **must** update the root layout file: `apps/marketing/src/app/[lng]/layout.tsx`.
    *   Locate the `namespaces` array within the `RootLayout` default export function.
    *   Add your new namespace string to this array.
        ```typescript
        // apps/marketing/src/app/[lng]/layout.tsx
        export default async function RootLayout({ ... }) {
          // Add your new namespace here
          const namespaces = ["common", "navbar", "footer", "landing", "eligibility", "YOUR_NEW_NAMESPACE"]; 
          // ... rest of the function
          const initialResources = await getInitialResources(lng, namespaces);
          // ...
          return (
            // ...
            <I18nProvider
              lng={lng}
              initialResources={initialResources}
              namespaces={namespaces} // Ensure the updated array is passed
            >
              {/* ... */}
            </I18nProvider>
            // ...
          );
        }
        ```
    *   This ensures the server pre-loads the translations for your namespace and makes them available to the client-side `I18nProvider`.

4.  **Using Translations in Components:**
    *   **Server Components:** 
        *   Import `useTranslation` from `@/lib/i18n`.
        *   Call `await useTranslation(lng, ["YOUR_NEW_NAMESPACE", ...other_required_namespaces])`.
    *   **Client Components:**
        *   Import `useTranslation` from `@/lib/i18n/client`.
        *   Call `const { t } = useTranslation(lng, ["YOUR_NEW_NAMESPACE", ...other_required_namespaces])`.
        *   Ensure the component is rendered within the hierarchy of the root `I18nProvider` (which it should be by default if placed within the `app` directory structure).
        *   **Remember:** This only works if you completed Step 3 correctly. If translations appear as keys, double-check the `namespaces` array in `layout.tsx`.

By following these steps, you ensure that translations for new sections are correctly loaded and accessible in both server and client environments. 