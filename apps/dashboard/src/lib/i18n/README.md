# Internationalization (i18n) Setup for Dashboard Application

This document outlines the internationalization (i18n) implementation for the `dashboard` application, utilizing `i18next`, `react-i18next`, and `i18next-resources-to-backend` within the Next.js App Router.

## Core Libraries

-   **`i18next`**: The core internationalization framework.
-   **`react-i18next`**: React bindings for `i18next`.
-   **`i18next-resources-to-backend`**: A backend plugin for loading translation resources.

## File Structure & Key Components

All i18n-specific logic for the dashboard app is centralized within this directory (`apps/dashboard/src/lib/i18n/`):

-   **`settings.ts`**:
    -   Defines supported `languages` (e.g., `en`, `fr`, `it`), `fallbackLng`, and `defaultNS` (default namespace).
    -   Exports `getOptions()`: Provides base configuration for `i18next.init()`.
    -   Includes an i18next `debug` flag, which can be enabled for development to aid in troubleshooting translation loading.

-   **`getInitialResources.ts`**:
    -   Exports `getInitialResources()`: A server-side function responsible for fetching the necessary translation JSON files based on the current language (`lng`) and requested namespaces (`ns`).
    -   These resources are then passed to the client-side `I18nProvider`.

-   **`index.ts`**:
    -   Initializes a server-side `i18next` instance.
    -   Exports an async `useTranslation` hook primarily intended for server components or server-side contexts. It fetches translations on demand.

-   **`I18nProvider.tsx`**:
    -   A client component (`"use client"`) designed to wrap the application's root or relevant layout.
    -   Receives `lng`, `initialResources` (pre-loaded translations from the server), and `namespaces` as props.
    -   Initializes its own `i18next` instance synchronously using the provided resources. This is crucial for preventing hydration mismatches and flashes of untranslated content (FOUC).
    -   Exports `useClientTranslation(ns?: string | string[])`: A custom hook for client components to access the `t` function and the `i18n` instance. This hook is scoped to the provided namespace(s).

-   **Translation Files**:
    -   Located at `apps/dashboard/public/locales/[lng]/[namespace].json`.
    -   Example: `apps/dashboard/public/locales/en/wizard_common.json`.
    -   Organized by language (`en`, `fr`, `it`) and then by namespace (e.g., `common`, `wizard_common`, `wizard_header`).

## Workflow & Configuration

1.  **Root Layout (`apps/dashboard/src/app/[lng]/layout.tsx`)**:
    -   Determines the current language (`lng`) from the URL.
    -   Defines an array `layoutNamespaces`. **Crucially, any namespace that needs to be available for initial client-side rendering must be listed here.**
    -   Calls `getInitialResources(lng, layoutNamespaces)` to pre-load these translations on the server.
    -   Wraps its children with the `<I18nProvider />`, passing the `lng`, `initialResources`, and `namespaces`.

2.  **Resource Loading Path**:
    -   Both `getInitialResources.ts` and `index.ts` use `i18next-resources-to-backend` to load translation files.
    -   The relative path used is `import(\`../../../public/locales/\${language}/\${namespace}.json\`)`, which correctly points from `apps/dashboard/src/lib/i18n/` to `apps/dashboard/public/locales/`.

3.  **Client-Side Usage**:
    -   In client components (`"use client"`):
        -   Import the custom hook: `import { useClientTranslation } from "@/lib/i18n/I18nProvider";` (or from an `index.ts` if re-exported, e.g. `@/lib/i18n`).
        -   Initialize the hook with the desired namespace: `const { t } = useClientTranslation('your_namespace');` (e.g., `'wizard_common'`).
        -   Use the `t` function to translate keys: `t('your_key')` or `t('group.your_key')`. The `t` function is already scoped to the namespace provided to `useClientTranslation`, so you don't need to prefix keys with the namespace again (e.g., use `t('steps.initialEntry')` not `t('wizard_common:steps.initialEntry')`).

## Adding New Namespaces or Languages

1.  **New Namespace**:
    -   Create the new JSON files for each language (e.g., `public/locales/en/new_namespace.json`).
    -   If the namespace needs to be available on initial load for components rendered by the root layout, add its name to the `layoutNamespaces` array in `apps/dashboard/src/app/[lng]/layout.tsx`.
    -   Components can then use `useClientTranslation('new_namespace')`.

2.  **New Language**:
    -   Add the language code to the `languages` array in `apps/dashboard/src/lib/i18n/settings.ts`.
    -   Create the corresponding language folder in `public/locales/` (e.g., `public/locales/es/`).
    -   Add all namespace JSON files (e.g., `common.json`, `wizard_common.json`) translated into the new language within this folder.
    -   Ensure your Next.js routing is configured to handle the new language segment in the URL if not already dynamic.

## Troubleshooting

-   **Keys displayed instead of text**:
    -   Ensure the namespace is correctly loaded:
        -   Is it listed in `layoutNamespaces` in `apps/dashboard/src/app/[lng]/layout.tsx` if needed for initial load?
        -   Are you calling `useClientTranslation('correct_namespace')`?
        -   Is the path to the JSON files in `getInitialResources.ts` and `index.ts` correct?
    -   Verify the key exists in your JSON file and is spelled correctly.
    -   Check for typos in the namespace string.
-   **Console Errors**:
    -   Enable `debug: true` in `settings.ts` during development to get detailed logs from `i18next` in the browser console. This can help identify issues with resource loading or configuration.
    -   Look for 404 errors for translation JSON files in the network tab. 