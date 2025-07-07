import {
  Body,
  Container,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components"

import Footer from "./components/footer"

type GenericSystemEmailProps = {
  email: string
  preview: string
  reactBody: React.ReactNode
}

export function GenericSystemEmail({
  email,
  preview,
  reactBody,
}: GenericSystemEmailProps) {
  return (
    <Html>
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="my-10 flex max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            {reactBody}
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
