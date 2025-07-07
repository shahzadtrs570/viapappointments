import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface WaitlistConfirmationEmailProps {
  name: string
  waitlistType: string
}

export function WaitlistConfirmationEmail({
  name,
  waitlistType,
}: WaitlistConfirmationEmailProps) {
  const planName =
    {
      standard: "Standard Plan",
      enterprise: "Enterprise Plan",
      beta: "Beta Access",
    }[waitlistType] || waitlistType

  return (
    <Html>
      <Head />
      <Preview>Welcome to the NextJet Waitlist! 🚀</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to NextJet! 🎉</Heading>

          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            Thank you for joining the NextJet waitlist! We&apos;re thrilled to
            have you as one of our early supporters. You&apos;ve expressed
            interest in our <strong>{planName}</strong>.
          </Text>

          <Section style={section}>
            <Text style={text}>Here&apos;s what happens next:</Text>
            <Text style={list}>
              • You&apos;ll be among the first to know when we launch
              <br />
              • Get early access to exclusive features
              <br />• Receive special launch day offers
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>
              We&apos;re working hard to create something amazing, and we
              can&apos;t wait to share it with you. Stay tuned for updates!
            </Text>
          </Section>

          <Text style={footer}>
            Best regards,
            <br />
            The NextJet Team
          </Text>

          <Text style={footerText}>
            Follow us on{" "}
            <Link href="https://twitter.com/nextjetapp" style={link}>
              Twitter
            </Link>{" "}
            for the latest updates.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
}

const text = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const list = {
  ...text,
  marginLeft: "24px",
}

const section = {
  margin: "26px 0",
}

const link = {
  color: "#2754C5",
  textDecoration: "underline",
}

const footer = {
  ...text,
  marginTop: "32px",
}

const footerText = {
  ...text,
  marginTop: "32px",
  color: "#6b7280",
  fontSize: "14px",
}

export default WaitlistConfirmationEmail
