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
} from "@react-email/components"

interface EmailVerificationProps {
  email: string
  url: string
  name: string
}

export function EmailVerification({ url, name }: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>Email Verification</Text>
            <Text style={text}>Hello {name},</Text>
            <Text style={text}>
              Please verify your email address to continue using our service.
              Click the button below to verify your email address.
            </Text>
            <Button href={url} style={button}>
              Verify Email
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              If you did not request this email, you can safely ignore it.
            </Text>
            <Text style={footer}>This link will expire in 24 hours.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e9e9e9",
  borderRadius: "5px",
  margin: "0 auto",
  padding: "20px",
  width: "100%",
  maxWidth: "600px",
}

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333",
}

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
}

const button = {
  backgroundColor: "#5046e5",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  marginBottom: "20px",
}

const hr = {
  borderColor: "#e9e9e9",
  margin: "20px 0",
}

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  marginBottom: "10px",
}

export default EmailVerification
