# Project Structure

```
aurion-cos-new/
├── .cursor/
│   └── rules/
│       ├── ai-integration.mdc
│       ├── api-documentation.mdc
│       ├── auth-implementation.mdc
│       ├── coding-standards.mdc
│       ├── core-architecture.mdc
│       ├── dashboard-ui.mdc
│       ├── data-layer.mdc
│       ├── design-system.mdc
│       ├── email-system.mdc
│       ├── error-handling.mdc
│       ├── eslint-standards.mdc
│       ├── index.mdc
│       ├── marketing-ui.mdc
│       ├── nextjs-patterns.mdc
│       └── payment-implementation.mdc
├── .github/
│   └── workflows/
│       ├── deploy-peisma-staging.yml
│       ├── deploy-prisma-dev.yml
│       └── deploy-prisma.yml
├── apps/
│   ├── dashboard/
│   │   ├── public/
│   │   │   └── logo.svg
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   └── Auth/
│   │   │   │   │   │       └── Auth.tsx
│   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   └── useSignIn.ts
│   │   │   │   │   ├── onboarding/
│   │   │   │   │   │   ├── _components/
│   │   │   │   │   │   │   ├── AnimatedStep/
│   │   │   │   │   │   │   │   └── AnimatedStep.tsx
│   │   │   │   │   │   │   ├── MultiStepLayout/
│   │   │   │   │   │   │   │   └── MultiStepLayout.tsx
│   │   │   │   │   │   │   ├── OnboardingProvider/
│   │   │   │   │   │   │   │   └── OnboardingProvider.tsx
│   │   │   │   │   │   │   ├── PricingForm/
│   │   │   │   │   │   │   │   └── PricingForm.tsx
│   │   │   │   │   │   │   ├── PricingInfo/
│   │   │   │   │   │   │   │   └── PricingInfo.tsx
│   │   │   │   │   │   │   ├── StepLayout/
│   │   │   │   │   │   │   │   └── StepLayout.tsx
│   │   │   │   │   │   │   ├── StepOne/
│   │   │   │   │   │   │   │   └── StepOne.tsx
│   │   │   │   │   │   │   ├── StepStatus/
│   │   │   │   │   │   │   │   └── StepStatus.tsx
│   │   │   │   │   │   │   └── StepTwo/
│   │   │   │   │   │   │       └── StepTwo.tsx
│   │   │   │   │   │   ├── _contexts/
│   │   │   │   │   │   │   └── onboardingContext.tsx
│   │   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   │   ├── useAnimatedStep.ts
│   │   │   │   │   │   │   ├── useFinishOnboarding.ts
│   │   │   │   │   │   │   ├── usePricingInfo.ts
│   │   │   │   │   │   │   ├── useStepOneOnboarding.ts
│   │   │   │   │   │   │   ├── useStepStatus.ts
│   │   │   │   │   │   │   └── useStepTwoOnboarding.ts
│   │   │   │   │   │   ├── _reducers/
│   │   │   │   │   │   │   └── onboardingReducer.ts
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── signin/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── signup/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── _components/
│   │   │   │   │   │   └── PaymentSuccessDialog/
│   │   │   │   │   │       └── PaymentSuccessDialog.tsx
│   │   │   │   │   ├── admin/
│   │   │   │   │   │   ├── _components/
│   │   │   │   │   │   │   ├── ActiveSubsBarChart/
│   │   │   │   │   │   │   │   └── ActiveSubsBarChart.tsx
│   │   │   │   │   │   │   ├── AdminContent/
│   │   │   │   │   │   │   │   └── AdminContent.tsx
│   │   │   │   │   │   │   ├── BanUserDialog/
│   │   │   │   │   │   │   │   └── BanUserDialog.tsx
│   │   │   │   │   │   │   ├── DeleteUserDialog/
│   │   │   │   │   │   │   │   └── DeleteUserDialog.tsx
│   │   │   │   │   │   │   ├── Hero/
│   │   │   │   │   │   │   │   └── Hero.tsx
│   │   │   │   │   │   │   ├── ImpersonateUserButton/
│   │   │   │   │   │   │   │   └── ImpersonateUserButton.tsx
│   │   │   │   │   │   │   ├── NewUsersChart/
│   │   │   │   │   │   │   │   └── NewUsersChart.tsx
│   │   │   │   │   │   │   ├── StatsCard/
│   │   │   │   │   │   │   │   └── StatsCard.tsx
│   │   │   │   │   │   │   ├── TotalUsersChart/
│   │   │   │   │   │   │   │   └── TotalUsersChart.tsx
│   │   │   │   │   │   │   ├── UnbanUserDialog/
│   │   │   │   │   │   │   │   └── UnbanUserDialog.tsx
│   │   │   │   │   │   │   ├── UserAccountInfo/
│   │   │   │   │   │   │   │   └── UserAccountInfo.tsx
│   │   │   │   │   │   │   ├── UserBansTable/
│   │   │   │   │   │   │   │   ├── UserBansTable.tsx
│   │   │   │   │   │   │   │   └── userBansTableColumns.tsx
│   │   │   │   │   │   │   ├── UserBillingInfo/
│   │   │   │   │   │   │   │   └── UserBillingInfo.tsx
│   │   │   │   │   │   │   ├── UserDeleteZone/
│   │   │   │   │   │   │   │   └── UserDeleteZone.tsx
│   │   │   │   │   │   │   ├── UserPerformedBansTable/
│   │   │   │   │   │   │   │   ├── UserPerformedBansTable.tsx
│   │   │   │   │   │   │   │   └── userPerformedBansTableColumns.tsx
│   │   │   │   │   │   │   ├── UserPerformedUnbansTable/
│   │   │   │   │   │   │   │   ├── UserPerformedUnbansTable.tsx
│   │   │   │   │   │   │   │   └── userPerformedUnbansTableColumns.tsx
│   │   │   │   │   │   │   ├── UserProfileBody/
│   │   │   │   │   │   │   │   └── UserProfileBody.tsx
│   │   │   │   │   │   │   ├── UserProfileContent/
│   │   │   │   │   │   │   │   └── UserProfileContent.tsx
│   │   │   │   │   │   │   ├── UserProfileHeader/
│   │   │   │   │   │   │   │   └── UserProfileHeader.tsx
│   │   │   │   │   │   │   ├── UsersContent/
│   │   │   │   │   │   │   │   └── UsersContent.tsx
│   │   │   │   │   │   │   ├── UsersTable/
│   │   │   │   │   │   │   │   ├── UsersTable.tsx
│   │   │   │   │   │   │   │   └── usersTableColumns.tsx
│   │   │   │   │   │   │   ├── UserTableActions/
│   │   │   │   │   │   │   │   └── UserTableActions.tsx
│   │   │   │   │   │   │   ├── WaitlistStats/
│   │   │   │   │   │   │   │   ├── RecentSignupsTable.tsx
│   │   │   │   │   │   │   │   ├── WaitlistAnalytics.tsx
│   │   │   │   │   │   │   │   ├── WaitlistStatsCards.tsx
│   │   │   │   │   │   │   │   └── WaitlistTypeChart.tsx
│   │   │   │   │   │   │   └── WaitlistTable/
│   │   │   │   │   │   │       ├── ChangeStatusDialog.tsx
│   │   │   │   │   │   │       ├── EditNotesDialog.tsx
│   │   │   │   │   │   │       ├── WaitlistTable.tsx
│   │   │   │   │   │   │       └── waitlistTableColumns.tsx
│   │   │   │   │   │   ├── _contexts/
│   │   │   │   │   │   │   └── adminContext.tsx
│   │   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   │   ├── useBanUser.ts
│   │   │   │   │   │   │   ├── useDeleteUser.ts
│   │   │   │   │   │   │   ├── useImpersonateUser.ts
│   │   │   │   │   │   │   ├── useSearchUsers.ts
│   │   │   │   │   │   │   ├── useSubscriptionsStatistics.ts
│   │   │   │   │   │   │   ├── useUnbanUser.ts
│   │   │   │   │   │   │   ├── useUserProfile.ts
│   │   │   │   │   │   │   ├── useUsers.ts
│   │   │   │   │   │   │   ├── useUsersStatistics.ts
│   │   │   │   │   │   │   └── useUsersTableActions.ts
│   │   │   │   │   │   ├── _types/
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── users/
│   │   │   │   │   │   │   ├── [userId]/
│   │   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── waitlist/
│   │   │   │   │   │   │   ├── analytics/
│   │   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── layout.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── banned/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── billing/
│   │   │   │   │   │   ├── _components/
│   │   │   │   │   │   │   ├── CurrentPlan/
│   │   │   │   │   │   │   │   └── CurrentPlan.tsx
│   │   │   │   │   │   │   ├── Header/
│   │   │   │   │   │   │   │   └── Header.tsx
│   │   │   │   │   │   │   ├── ManageSubscriptionButton/
│   │   │   │   │   │   │   │   └── ManageSubscriptionButton.tsx
│   │   │   │   │   │   │   ├── PlanSection/
│   │   │   │   │   │   │   │   └── PlanSection.tsx
│   │   │   │   │   │   │   ├── UpgradePlanButton/
│   │   │   │   │   │   │   │   └── UpgradePlanButton.tsx
│   │   │   │   │   │   │   └── UpgradePlanSection/
│   │   │   │   │   │   │       └── UpgradePlanSection.tsx
│   │   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   │   ├── useCheckout.ts
│   │   │   │   │   │   │   ├── useCreateBillingPortalSession.ts
│   │   │   │   │   │   │   └── useUpgrade.ts
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── feedback/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── file-upload/
│   │   │   │   │   │   ├── _components/
│   │   │   │   │   │   │   └── FileUploadTest.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── not-found/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   ├── _components/
│   │   │   │   │   │   │   ├── ChangeName/
│   │   │   │   │   │   │   │   └── ChangeName.tsx
│   │   │   │   │   │   │   ├── DeleteMyAccount/
│   │   │   │   │   │   │   │   └── DeleteMyAccount.tsx
│   │   │   │   │   │   │   └── DeleteMyAccountDialog/
│   │   │   │   │   │   │       └── DeleteMyAccountDialog.tsx
│   │   │   │   │   │   ├── _hooks/
│   │   │   │   │   │   │   ├── useChangeName.ts
│   │   │   │   │   │   │   └── useDeleteMyAccount.ts
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── waitlist/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── error.tsx
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   └── [...nextauth]/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── lemonsqueezy/
│   │   │   │   │   │   └── webhook/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── n8n/
│   │   │   │   │   │   ├── execute/
│   │   │   │   │   │   │   └── [workflowId]/
│   │   │   │   │   │   │       └── route.ts
│   │   │   │   │   │   ├── webhook/
│   │   │   │   │   │   │   └── [...path]/
│   │   │   │   │   │   │       └── route.ts
│   │   │   │   │   │   └── workflows/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── queue/
│   │   │   │   │   │   └── process/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── stripe/
│   │   │   │   │   │   └── webhook/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── trpc/
│   │   │   │   │       └── [trpc]/
│   │   │   │   │           └── route.ts
│   │   │   │   ├── error.tsx
│   │   │   │   ├── globals.css
│   │   │   │   ├── icon.svg
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── manifest.ts
│   │   │   │   ├── not-found.tsx
│   │   │   │   ├── providers.tsx
│   │   │   │   ├── robots.ts
│   │   │   │   └── sitemap.ts
│   │   │   ├── components/
│   │   │   │   ├── Layouts/
│   │   │   │   │   ├── DashboardLayout/
│   │   │   │   │   │   ├── ColumnContainer.tsx
│   │   │   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   │   │   ├── DashboardLayout.tsx
│   │   │   │   │   │   ├── DashboardLink.tsx
│   │   │   │   │   │   ├── DashboardLinks.tsx
│   │   │   │   │   │   ├── DashboardMobileNav.tsx
│   │   │   │   │   │   ├── DashboardMobileSidebar.tsx
│   │   │   │   │   │   ├── DashboardSideNav.tsx
│   │   │   │   │   │   └── UserMenu.tsx
│   │   │   │   │   ├── RootLayout/
│   │   │   │   │   │   ├── RootLayout.tsx
│   │   │   │   │   │   └── UserInitializer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Misc/
│   │   │   │       ├── AccessDenied/
│   │   │   │       │   └── AccessDenied.tsx
│   │   │   │       ├── Authorization/
│   │   │   │       │   └── Authorization.tsx
│   │   │   │       └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useAuthorization.ts
│   │   │   │   └── useErrorLogger.ts
│   │   │   ├── lib/
│   │   │   │   ├── trpc/
│   │   │   │   │   ├── react.tsx
│   │   │   │   │   └── server.ts
│   │   │   │   ├── canny.tsx
│   │   │   │   └── logger.ts
│   │   │   ├── types/
│   │   │   │   └── propertyResearch.ts
│   │   │   └── middleware.ts
│   │   ├── .eslintrc.js
│   │   ├── .gitignore
│   │   ├── .lintstagedrc.json
│   │   ├── .prettierignore
│   │   ├── .prettierrc.json
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── README.md
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── marketing/
│       ├── content/
│       │   ├── blog/
│       │   │   ├── boilerplate.mdx
│       │   │   ├── mdx.mdx
│       │   │   └── seo.mdx
│       │   ├── docs/
│       │   │   ├── example-docs/
│       │   │   │   ├── deep.mdx
│       │   │   │   └── meta.json
│       │   │   ├── index.mdx
│       │   │   └── meta.json
│       │   └── legal/
│       │       ├── privacy-policy.mdx
│       │       └── terms-of-service.mdx
│       ├── public/
│       │   ├── images/
│       │   │   ├── blog/
│       │   │   │   ├── boilerplate-cover.png
│       │   │   │   ├── cat-cover.png
│       │   │   │   ├── pagination-cover.png
│       │   │   │   ├── pixel-renas-avatar.jpg
│       │   │   │   └── typography-cover.png
│       │   │   ├── clientLogos/
│       │   │   │   └── next.svg
│       │   │   ├── placeholderImageBig.svg
│       │   │   ├── placeholderImageBlue.svg
│       │   │   ├── placeholderImageGray.svg
│       │   │   ├── placeholderImageGreen.svg
│       │   │   └── placeholderImagePurple.svg
│       │   └── logo.svg
│       ├── src/
│       │   ├── app/
│       │   │   ├── (landing)/
│       │   │   │   ├── _components/
│       │   │   │   │   ├── CarouselAutoScroll/
│       │   │   │   │   │   └── CarouselAutoScroll.tsx
│       │   │   │   │   ├── CTASection/
│       │   │   │   │   │   └── CTASection.tsx
│       │   │   │   │   ├── DemoSection/
│       │   │   │   │   │   └── DemoSection.tsx
│       │   │   │   │   ├── FAQSection/
│       │   │   │   │   │   └── FAQSection.tsx
│       │   │   │   │   ├── FeatureAccordion/
│       │   │   │   │   │   └── FeatureAccordion.tsx
│       │   │   │   │   ├── FeatureCard/
│       │   │   │   │   │   └── FeatureCard.tsx
│       │   │   │   │   ├── FeatureSectionGrid/
│       │   │   │   │   │   └── FeatureSectionGrid.tsx
│       │   │   │   │   ├── FeaturesSection/
│       │   │   │   │   │   └── FeaturesSection.tsx
│       │   │   │   │   ├── FeaturesSectionSmall/
│       │   │   │   │   │   └── FeaturesSectionSmall.tsx
│       │   │   │   │   ├── HeroSection/
│       │   │   │   │   │   └── HeroSection.tsx
│       │   │   │   │   ├── PainSection/
│       │   │   │   │   │   └── PainSection.tsx
│       │   │   │   │   ├── PricingSection/
│       │   │   │   │   │   └── PricingSection.tsx
│       │   │   │   │   └── SocialProofSection/
│       │   │   │   │       └── SocialProofSection.tsx
│       │   │   │   ├── _config/
│       │   │   │   │   └── features.tsx
│       │   │   │   └── page.tsx
│       │   │   ├── api/
│       │   │   │   ├── search/
│       │   │   │   │   └── route.ts
│       │   │   │   └── trpc/
│       │   │   │       └── [trpc]/
│       │   │   │           └── route.ts
│       │   │   ├── blog/
│       │   │   │   ├── _components/
│       │   │   │   │   ├── AboutSection/
│       │   │   │   │   │   └── AboutSection.tsx
│       │   │   │   │   ├── Article/
│       │   │   │   │   │   └── Article.tsx
│       │   │   │   │   ├── ArticleAvatar/
│       │   │   │   │   │   └── ArticleAvatar.tsx
│       │   │   │   │   ├── ArticleFooter/
│       │   │   │   │   │   └── ArticleFooter.tsx
│       │   │   │   │   ├── ArticleHeader/
│       │   │   │   │   │   └── ArticleHeader.tsx
│       │   │   │   │   ├── Articles/
│       │   │   │   │   │   └── Articles.tsx
│       │   │   │   │   ├── CopyToClipboard/
│       │   │   │   │   │   └── CopyToClipboard.tsx
│       │   │   │   │   ├── Keywords/
│       │   │   │   │   │   └── Keywords.tsx
│       │   │   │   │   └── ShareSection/
│       │   │   │   │       └── ShareSection.tsx
│       │   │   │   ├── _config/
│       │   │   │   │   └── authors.ts
│       │   │   │   ├── [...slug]/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── layout.tsx
│       │   │   │   └── page.tsx
│       │   │   ├── docs/
│       │   │   │   ├── [[...slug]]/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── layout.tsx
│       │   │   ├── legal/
│       │   │   │   ├── [...slug]/
│       │   │   │   │   └── page.tsx
│       │   │   │   └── layout.tsx
│       │   │   ├── waitlist/
│       │   │   │   ├── layout.tsx
│       │   │   │   └── page.tsx
│       │   │   ├── error.tsx
│       │   │   ├── globals.css
│       │   │   ├── icon.svg
│       │   │   ├── layout.tsx
│       │   │   ├── not-found.tsx
│       │   │   ├── providers.tsx
│       │   │   ├── robots.ts
│       │   │   └── sitemap.ts
│       │   ├── components/
│       │   │   ├── Elements/
│       │   │   │   ├── DocsSearch/
│       │   │   │   │   └── DocsSearch.tsx
│       │   │   │   ├── SearchToggle/
│       │   │   │   │   └── SearchToggle.tsx
│       │   │   │   └── index.ts
│       │   │   ├── Layouts/
│       │   │   │   ├── LandingLayout/
│       │   │   │   │   └── LandingLayout.tsx
│       │   │   │   ├── RootLayout/
│       │   │   │   │   └── RootLayout.tsx
│       │   │   │   └── index.ts
│       │   │   └── Misc/
│       │   │       ├── Footer/
│       │   │       │   ├── Footer.tsx
│       │   │       │   ├── FooterMenu.tsx
│       │   │       │   └── FooterNav.tsx
│       │   │       ├── Navbar/
│       │   │       │   ├── DesktopLinks.tsx
│       │   │       │   ├── MobileAccordionLinkItem.tsx
│       │   │       │   ├── MobileLink.tsx
│       │   │       │   ├── MobileLinks.tsx
│       │   │       │   ├── MobileSheet.tsx
│       │   │       │   └── Navbar.tsx
│       │   │       └── index.ts
│       │   └── lib/
│       │       ├── trpc/
│       │       │   ├── react.tsx
│       │       │   └── server.ts
│       │       └── fuma.ts
│       ├── .eslintrc.js
│       ├── .gitignore
│       ├── .lintstagedrc.json
│       ├── .map.ts
│       ├── .prettierignore
│       ├── .prettierrc.json
│       ├── mdx-components.tsx
│       ├── next-env.d.ts
│       ├── next.config.mjs
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── dev_new_features/
│   ├── bugs/
│   │   └── todo/
│   │       └── font issues/
│   │           └── font-issue.md
│   ├── features/
│   │   ├── template/
│   │   │   ├── docs/
│   │   │   │   ├── feature-app-flow.md
│   │   │   │   ├── feature-data-schema.md
│   │   │   │   ├── feature-implementation-plan.md
│   │   │   │   ├── feature-requirements-document.md
│   │   │   │   └── feature-ux-considerations.md
│   │   │   ├── feature_overview.md
│   │   │   ├── feature-implementation-plan.md
│   │   │   ├── feature-requirements-document.md
│   │   │   └── feature-ux-considerations.md
│   │   └── todo/
│   │       ├── 20250306-feature-referral-system-with-mlm/
│   │       │   ├── docs/
│   │       │   │   ├── feature-app-flow.md
│   │       │   │   ├── feature-data-schema.md
│   │       │   │   ├── feature-document.md
│   │       │   │   ├── feature-implementation-plan.md
│   │       │   │   ├── feature-requirements-document.md
│   │       │   │   └── feature-ux-considerations.md
│   │       │   └── feature_overview.md
│   │       └── 20250314-playright-testing/
│   │           ├── implementation-roadmap.md
│   │           ├── playwright-implementation-guide.md
│   │           ├── playwright-testing-strategy.md
│   │           ├── README.md
│   │           └── sample-test-implementation.md
│   └── overview.md
├── documentation/
│   ├── general/
│   │   ├── ai-progress-tracker-instructions.md
│   │   ├── ai-tailwind-instructions.md
│   │   ├── backend_structure_document.md
│   │   ├── frontend_guidelines_document.md
│   │   ├── inital-setup.md
│   │   ├── nextjet_docs.md
│   │   ├── progress-tracker-instructions.md
│   │   ├── project_structure_maintenance.md
│   │   ├── tailwind-implementation-guide.md
│   │   └── tech_stack_document.md
│   ├── project/
│   │   ├── app-flow.md
│   │   ├── colour-theme.md
│   │   ├── data-schema.md
│   │   ├── implementation-plan.md
│   │   ├── marketing-site-content.md
│   │   ├── project-requirements-document.md
│   │   └── ux-considerations.md
│   ├── structure/
│   │   └── project-structure.md
│   ├── overview.md
│   └── waitlist_feature.md
├── packages/
│   ├── ai_audio/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── elevenlabs.ts
│   │   │   │   └── openai.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ai_llm/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── factory/
│   │   │   │   │   └── LLMFactory.ts
│   │   │   │   ├── langchain/
│   │   │   │   │   ├── anthropic.ts
│   │   │   │   │   └── openai.ts
│   │   │   │   ├── anthropic.ts
│   │   │   │   ├── llmapi.ts
│   │   │   │   └── openai.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── sub-routers/
│   │   │   │   │   │   ├── adminUser/
│   │   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   │   │   ├── adminUser.repository.ts
│   │   │   │   │   │   │   │   └── adminUser.repository.types.ts
│   │   │   │   │   │   │   ├── service/
│   │   │   │   │   │   │   │   ├── adminUser.input.ts
│   │   │   │   │   │   │   │   ├── adminUser.service.ts
│   │   │   │   │   │   │   │   └── adminUser.service.types.ts
│   │   │   │   │   │   │   └── adminUser.router.ts
│   │   │   │   │   │   └── statistics/
│   │   │   │   │   │       ├── repository/
│   │   │   │   │   │       │   └── statistics.repository.ts
│   │   │   │   │   │       ├── service/
│   │   │   │   │   │       │   ├── statistics.input.ts
│   │   │   │   │   │       │   ├── statistics.service.ts
│   │   │   │   │   │       │   └── statistics.service.types.ts
│   │   │   │   │   │       └── statistics.router.ts
│   │   │   │   │   └── admin.router.ts
│   │   │   │   ├── ai_api_calls/
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── ai_api_calls.repository.ts
│   │   │   │   │   │   └── ai_api_calls.repository.types.ts
│   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── ai_api_calls.service.ts
│   │   │   │   │   │   └── ai_api_calls.service.types.ts
│   │   │   │   │   └── ai_apis_calls.router.ts
│   │   │   │   ├── fileUpload/
│   │   │   │   │   ├── service/
│   │   │   │   │   │   └── fileUpload.service.ts
│   │   │   │   │   └── fileUpload.router.ts
│   │   │   │   ├── payments/
│   │   │   │   │   ├── adapters/
│   │   │   │   │   │   ├── lemonSqueezy/
│   │   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   │   │   ├── lemonSqueezy.repository.ts
│   │   │   │   │   │   │   │   └── lemonSqueezy.repository.types.ts
│   │   │   │   │   │   │   └── service/
│   │   │   │   │   │   │       ├── lemonSqueezy.service.ts
│   │   │   │   │   │   │       └── lemonSqueezy.service.typeguards.ts
│   │   │   │   │   │   ├── stripe/
│   │   │   │   │   │   │   ├── repository/
│   │   │   │   │   │   │   │   ├── stripe.repository.ts
│   │   │   │   │   │   │   │   └── stripe.repository.types.ts
│   │   │   │   │   │   │   └── service/
│   │   │   │   │   │   │       ├── stripe.service.ts
│   │   │   │   │   │   │       └── stripe.service.types.ts
│   │   │   │   │   │   └── IPaymentService.types.ts
│   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── payments.input.ts
│   │   │   │   │   │   ├── payments.service.ts
│   │   │   │   │   │   └── payments.service.types.ts
│   │   │   │   │   └── payments.router.ts
│   │   │   │   ├── user/
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── user.repository.ts
│   │   │   │   │   │   └── user.repository.types.ts
│   │   │   │   │   ├── service/
│   │   │   │   │   │   ├── user.service.ts
│   │   │   │   │   │   └── user.service.types.ts
│   │   │   │   │   └── user.router.ts
│   │   │   │   └── waitlist/
│   │   │   │       ├── repository/
│   │   │   │       │   └── waitlist.repository.ts
│   │   │   │       ├── service/
│   │   │   │       │   ├── waitlist.service.ts
│   │   │   │       │   └── waitlist.service.types.ts
│   │   │   │       └── waitlist.router.ts
│   │   │   ├── index.ts
│   │   │   ├── root.ts
│   │   │   └── trpc.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   └── authOptions.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   └── serverSession.ts
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── configs/
│   │   ├── eslint-config/
│   │   │   ├── library.js
│   │   │   ├── next.js
│   │   │   ├── package.json
│   │   │   ├── react-internal.js
│   │   │   └── README.md
│   │   ├── prettier-config/
│   │   │   ├── index.js
│   │   │   └── package.json
│   │   ├── tailwind-config/
│   │   │   ├── package.json
│   │   │   ├── styles.css
│   │   │   └── tailwind.config.ts
│   │   └── typescript-config/
│   │       ├── base.json
│   │       ├── nextjs.json
│   │       └── package.json
│   ├── crisp/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── CrispChat.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   ├── db/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   ├── 20241010150413_init/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20250207074315_/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20250311073154_queue_task_migration/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20250312045333_ai_api_calls_migration/
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   ├── seeds/
│   │   │   │   └── users.ts
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   ├── .npmrc
│   │   ├── db.ts
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── email/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── _customEmailBuildMailOptions.ts
│   │   │   │   ├── _customEmailProviders.ts
│   │   │   │   ├── _customEmailTransportor.ts
│   │   │   │   ├── _customEmailUserSend.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── resend.ts
│   │   │   │   └── sendEmail.ts
│   │   │   ├── templates/
│   │   │   │   ├── components/
│   │   │   │   │   └── footer.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── InvoicePaymentFailed.tsx
│   │   │   │   ├── MagicLinkSignIn.tsx
│   │   │   │   ├── TrialEndingSoon.tsx
│   │   │   │   └── WaitlistConfirmationEmail.tsx
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   ├── file_storage/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── services/
│   │   │   │   │   ├── aws.service.ts
│   │   │   │   │   ├── cloudflare.service.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── local.service.ts
│   │   │   │   │   └── s3.service.ts
│   │   │   │   ├── factory.ts
│   │   │   │   ├── fileStorage.ts
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── logger/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── logger.ts
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── payments/
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── lemonSqueezy.ts
│   │   │   │   └── stripe.ts
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── queue/
│   │   ├── src/
│   │   │   ├── workers/
│   │   │   │   └── project.ts
│   │   │   ├── index.ts
│   │   │   └── QueueService.ts
│   │   └── package.json
│   ├── ui/
│   │   ├── src/
│   │   │   └── components/
│   │   │       ├── Accordion/
│   │   │       │   └── Accordion.tsx
│   │   │       ├── Alert/
│   │   │       │   └── Alert.tsx
│   │   │       ├── AlertDialog/
│   │   │       │   └── AlertDialog.tsx
│   │   │       ├── AspectRatio/
│   │   │       │   └── AspectRatio.tsx
│   │   │       ├── Autocomplete/
│   │   │       │   ├── Autocomplete.tsx
│   │   │       │   └── useAutocomplete.ts
│   │   │       ├── Avatar/
│   │   │       │   └── Avatar.tsx
│   │   │       ├── Badge/
│   │   │       │   └── Badge.tsx
│   │   │       ├── Breadcrumb/
│   │   │       │   └── Breadcrumb.tsx
│   │   │       ├── Button/
│   │   │       │   └── Button.tsx
│   │   │       ├── Calendar/
│   │   │       │   └── Calendar.tsx
│   │   │       ├── Card/
│   │   │       │   └── Card.tsx
│   │   │       ├── Carousel/
│   │   │       │   └── Carousel.tsx
│   │   │       ├── Charts/
│   │   │       │   ├── BaseBarChart/
│   │   │       │   │   └── BaseBarChart.tsx
│   │   │       │   ├── BaseLineChart/
│   │   │       │   │   └── BaseLineChart.tsx
│   │   │       │   ├── types/
│   │   │       │   │   └── index.ts
│   │   │       │   └── index.ts
│   │   │       ├── Checkbox/
│   │   │       │   └── Checkbox.tsx
│   │   │       ├── Collapsible/
│   │   │       │   └── Collapsible.tsx
│   │   │       ├── Command/
│   │   │       │   └── Command.tsx
│   │   │       ├── Container/
│   │   │       │   └── Container.tsx
│   │   │       ├── ContextMenu/
│   │   │       │   └── ContextMenu.tsx
│   │   │       ├── DataTable/
│   │   │       │   ├── DataTable.tsx
│   │   │       │   ├── DataTableColumnHeader.tsx
│   │   │       │   ├── DataTablePagination.tsx
│   │   │       │   ├── DataTableViewOptions.tsx
│   │   │       │   └── index.ts
│   │   │       ├── DateRangePicker/
│   │   │       │   └── DateRangePicker.tsx
│   │   │       ├── Dialog/
│   │   │       │   └── Dialog.tsx
│   │   │       ├── Drawer/
│   │   │       │   └── Drawer.tsx
│   │   │       ├── DropdownMenu/
│   │   │       │   └── DropdownMenu.tsx
│   │   │       ├── Feature/
│   │   │       │   └── Feature.tsx
│   │   │       ├── Form/
│   │   │       │   └── Form.tsx
│   │   │       ├── HoverCard/
│   │   │       │   └── HoverCard.tsx
│   │   │       ├── Input/
│   │   │       │   └── Input.tsx
│   │   │       ├── InputOTP/
│   │   │       │   └── InputOTP.tsx
│   │   │       ├── Label/
│   │   │       │   └── Label.tsx
│   │   │       ├── Layout/
│   │   │       │   └── index.ts
│   │   │       ├── Logo/
│   │   │       │   └── Logo.tsx
│   │   │       ├── Menubar/
│   │   │       │   └── Menubar.tsx
│   │   │       ├── NavigationMenu/
│   │   │       │   └── NavigationMenu.tsx
│   │   │       ├── Pagination/
│   │   │       │   └── Pagination.tsx
│   │   │       ├── Popover/
│   │   │       │   └── Popover.tsx
│   │   │       ├── PricingCard/
│   │   │       │   └── PricingCard.tsx
│   │   │       ├── PricingPlans/
│   │   │       │   └── PricingPlans.tsx
│   │   │       ├── PricingSwitch/
│   │   │       │   └── PricingSwitch.tsx
│   │   │       ├── Progress/
│   │   │       │   └── Progress.tsx
│   │   │       ├── RadioGroup/
│   │   │       │   └── RadioGroup.tsx
│   │   │       ├── Resizeable/
│   │   │       │   └── Resizeable.tsx
│   │   │       ├── ScrollArea/
│   │   │       │   └── ScrollArea.tsx
│   │   │       ├── Select/
│   │   │       │   └── Select.tsx
│   │   │       ├── Separator/
│   │   │       │   └── Separator.tsx
│   │   │       ├── Sheet/
│   │   │       │   └── Sheet.tsx
│   │   │       ├── Skeleton/
│   │   │       │   └── Skeleton.tsx
│   │   │       ├── Slider/
│   │   │       │   └── Slider.tsx
│   │   │       ├── SocialIcons/
│   │   │       │   ├── RedditIcon/
│   │   │       │   │   └── RedditIcon.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Sonner/
│   │   │       │   └── Sonner.tsx
│   │   │       ├── Spinner/
│   │   │       │   └── Spinner.tsx
│   │   │       ├── Switch/
│   │   │       │   └── Switch.tsx
│   │   │       ├── Table/
│   │   │       │   └── Table.tsx
│   │   │       ├── Tabs/
│   │   │       │   └── Tabs.tsx
│   │   │       ├── Textarea/
│   │   │       │   └── Textarea.tsx
│   │   │       ├── ThemeProvider/
│   │   │       │   └── ThemeProvider.tsx
│   │   │       ├── ThemeToggle/
│   │   │       │   └── ThemeToggle.tsx
│   │   │       ├── Toast/
│   │   │       │   ├── index.ts
│   │   │       │   ├── Toast.tsx
│   │   │       │   ├── Toaster.tsx
│   │   │       │   └── useToast.tsx
│   │   │       ├── Toggle/
│   │   │       │   └── Toggle.tsx
│   │   │       ├── ToggleGroup/
│   │   │       │   └── ToggleGroup.tsx
│   │   │       ├── Tooltip/
│   │   │       │   └── Tooltip.tsx
│   │   │       ├── Typography/
│   │   │       │   └── Typography.tsx
│   │   │       └── WaitList/
│   │   │           ├── index.ts
│   │   │           ├── SelectOptions.tsx
│   │   │           ├── templates.tsx
│   │   │           ├── types.ts
│   │   │           ├── WaitlistForm.tsx
│   │   │           ├── WaitlistFormField.tsx
│   │   │           └── WaitlistSuccessMessage.tsx
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   ├── utils/
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   │   ├── entitlements.ts
│   │   │   │   ├── featureFlags.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── subscriptionPlans.ts
│   │   │   ├── functions/
│   │   │   │   ├── absoluteUrl.ts
│   │   │   │   ├── cn.ts
│   │   │   │   ├── date.ts
│   │   │   │   └── index.ts
│   │   │   ├── lib/
│   │   │   │   └── errorLogger.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── .eslintrc.js
│   │   ├── .lintstagedrc.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── validations/
│       ├── src/
│       │   ├── schemas/
│       │   │   ├── admin/
│       │   │   │   └── userBan.schema.ts
│       │   │   ├── ai_api_calls/
│       │   │   │   └── ai_api_calls.schema.ts
│       │   │   └── user/
│       │   │       └── user.schema.ts
│       │   └── index.ts
│       ├── .eslintrc.js
│       ├── .lintstagedrc.json
│       ├── package.json
│       └── tsconfig.json
├── prompts_helper/
│   ├── error-helper-prompt.md
│   ├── generic-ai-session-prompt.md
│   ├── generic-features-ai-session-prompt.md
│   └── source-to-prompt.html
├── scripts_local_helpers/
│   ├── generate-project-tree.js
│   └── generate-project-tree.ts
├── .commitlintrc.json
├── .eslintrc.js
├── .gitignore
├── .lintstagedrc.json
├── .npmrc
├── .prettierrc.json
├── docker-compose.yml
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── turbo.json
```

Generated on: 2025-03-17T15:15:58.935Z