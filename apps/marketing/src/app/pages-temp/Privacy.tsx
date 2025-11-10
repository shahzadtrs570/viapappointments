import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Lock } from "lucide-react"

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us when you create an account, post a listing, contact us, or otherwise use our services. This includes: name, email address, phone number, location, payment information, and any content you post on the Platform. We also automatically collect certain information about your device and how you interact with our Platform, including IP address, browser type, operating system, referring URLs, and pages visited.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use the information we collect to: provide, maintain, and improve our services; process transactions and send related information; send technical notices, updates, security alerts, and support messages; respond to your comments and questions; communicate with you about products, services, and events; monitor and analyze trends and usage; detect, prevent, and address technical issues and fraudulent activity; and personalize and improve your experience.",
    },
    {
      title: "3. Information Sharing",
      content:
        "We may share your information in the following circumstances: with dealers and sellers when you make inquiries about their listings; with service providers who perform services on our behalf; in response to legal requests or to prevent harm; in connection with a merger, sale, or asset transfer; with your consent or at your direction; and in aggregated or de-identified form that cannot reasonably be used to identify you.",
    },
    {
      title: "4. Cookies and Tracking",
      content:
        "We use cookies, web beacons, and similar tracking technologies to collect information about your browsing activities and to provide personalized content and advertising. You can control cookies through your browser settings, but disabling cookies may limit your ability to use certain features of the Platform.",
    },
    {
      title: "5. Third-Party Services",
      content:
        "Our Platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information to them.",
    },
    {
      title: "6. Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security of your data.",
    },
    {
      title: "7. Data Retention",
      content:
        "We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.",
    },
    {
      title: "8. Your Rights",
      content:
        "Depending on your location, you may have certain rights regarding your personal information, including: the right to access your data; the right to correct inaccurate data; the right to delete your data; the right to restrict processing; the right to data portability; and the right to object to processing. To exercise these rights, please contact us at info@checkthelot.com.",
    },
    {
      title: "9. Children's Privacy",
      content:
        "Our Platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If we learn we have collected information from a child under 18, we will delete that information promptly.",
    },
    {
      title: "10. California Privacy Rights",
      content:
        "California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, the right to delete personal information, and the right to opt-out of the sale of personal information. We do not sell your personal information.",
    },
    {
      title: "11. International Data Transfers",
      content:
        "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take steps to ensure that your data receives an adequate level of protection.",
    },
    {
      title: "12. Changes to Privacy Policy",
      content:
        "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date. Your continued use of the Platform after changes constitutes acceptance of the updated policy.",
    },
    {
      title: "13. Contact Us",
      content:
        "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at: Email: info@checkthelot.com",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-6 animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Last updated: January 2025
            </p>
          </div>

          <Card className="glass-strong p-8 md:p-12 border-border/50 animate-fade-in-up">
            <div className="prose prose-invert max-w-none space-y-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Check The Lot, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform.
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

export default Privacy
