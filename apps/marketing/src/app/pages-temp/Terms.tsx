import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Shield } from "lucide-react"

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Check The Lot ('the Platform'), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      title: "2. Use License",
      content:
        "Permission is granted to temporarily access the materials on Check The Lot for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the Platform; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or 'mirror' the materials on any other server.",
    },
    {
      title: "3. Listing Standards",
      content:
        "Dealers and individual sellers must ensure all listings are accurate, current, and comply with applicable laws. Check The Lot reserves the right to remove any listing that violates these terms, contains fraudulent information, or is deemed inappropriate. All pricing must be clearly stated and accurate. Photos must accurately represent the item being sold.",
    },
    {
      title: "4. User Accounts",
      content:
        "When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account. You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account.",
    },
    {
      title: "5. Prohibited Activities",
      content:
        "You may not use the Platform to: post false, inaccurate, misleading, or fraudulent listings; impersonate any person or entity; harass, abuse, or harm another person; violate any applicable laws or regulations; collect or store personal data about other users; interfere with or disrupt the Platform or servers; or attempt to gain unauthorized access to any portion of the Platform.",
    },
    {
      title: "6. Transactions",
      content:
        "Check The Lot serves as a platform to connect buyers and sellers. We are not a party to any transaction between users. All transactions are solely between the buyer and seller. Check The Lot is not responsible for the quality, safety, legality, or accuracy of any listings. Users agree to resolve any disputes directly with other users.",
    },
    {
      title: "7. Fees and Payments",
      content:
        "Use of the Platform for listing items is free. Premium advertising services are available for a monthly fee as described on our pricing page. All fees are non-refundable unless otherwise stated. We reserve the right to change our fees at any time with 30 days notice.",
    },
    {
      title: "8. Intellectual Property",
      content:
        "The Platform and its original content, features, and functionality are and will remain the exclusive property of Check The Lot and its licensors. The Platform is protected by copyright, trademark, and other laws. Our trademarks may not be used in connection with any product or service without the prior written consent of Check The Lot.",
    },
    {
      title: "9. Termination",
      content:
        "We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the Platform.",
    },
    {
      title: "10. Limitation of Liability",
      content:
        "In no event shall Check The Lot, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Platform.",
    },
    {
      title: "11. Disclaimer",
      content:
        "Your use of the Platform is at your sole risk. The Platform is provided on an 'AS IS' and 'AS AVAILABLE' basis. The Platform is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.",
    },
    {
      title: "12. Governing Law",
      content:
        "These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
    },
    {
      title: "13. Changes to Terms",
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
    },
    {
      title: "14. Contact Information",
      content:
        "If you have any questions about these Terms, please contact us at info@checkthelot.com",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Last updated: January 2025
            </p>
          </div>

          <Card className="glass-strong p-8 md:p-12 border-border/50 animate-fade-in-up">
            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to Check The Lot. These Terms of Service govern your use
                of our platform and services. Please read these terms carefully
                before using our marketplace.
              </p>

              {sections.map((section, index) => (
                <div
                  key={index}
                  className="space-y-3 pt-6 border-t border-border/30 first:border-0 first:pt-0"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Terms
