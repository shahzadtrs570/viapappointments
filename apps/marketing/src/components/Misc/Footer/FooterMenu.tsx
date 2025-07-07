/* eslint-disable */
"use client"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { FooterNav } from "./FooterNav"

export function FooterMenu() {
  const { t } = useClientTranslation("footer")

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {/* Company Links */}
      <FooterNav
        title="Company"
        links={[
          { href: "/#", title: "About Vipappointments" },
          { href: "/#", title: "Our team" },
          { href: "/#", title: "Press" },
          { href: "/#", title: "Investor relations" },
          { href: "/#", title: "Price trends" },
          { href: "/#", title: "Blog" },
          { href: "/#", title: "Careers" },
        ]}
      />

      {/* For Dealers Links */}
      <FooterNav
        title="For Dealers"
        links={[
          { href: "/#", title: "Dealer signup" },
          { href: "/#", title: "Dealer resources" },
        ]}
      />

      {/* Terms Links */}
      <FooterNav
        title="Terms"
        links={[
          { href: "/legal/terms-of-service", title: "Terms of use" },
          { href: "/legal/privacy-policy", title: "Privacy policy" },
          { href: "/#", title: "Your Privacy Choices" },
          { href: "/#", title: "Interest-based ads" },
          { href: "/#", title: "Security" },
        ]}
      />

      {/* Help Links */}
      <FooterNav
        title="Help"
        links={[
          { href: "/#", title: "Help center" },
          { href: "/#", title: "Contact us" },
          { href: "/#", title: "Delivery" },
        ]}
      />
    </div>
  )
}
