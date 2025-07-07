import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"

import { createTranslator } from "../utils"
import Footer from "./components/footer"

type MagicLinkSignInProps = {
  email: string
  url: string
  cookieString?: string // Added to pass cookies for language detection
}

export default function MagicLinkSignIn({
  email,
  url,
  cookieString,
}: MagicLinkSignInProps) {
  // Create translator for this template
  const t = createTranslator("magic-link-signin", cookieString)

  return (
    <Html>
      <Head />
      <Preview>{t("preview")}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="my-10 flex max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Text className="text-2xl font-extrabold">{t("title")}</Text>
            <Text className="text-sm leading-6 text-black">
              {t("greeting")}
            </Text>
            <Text className="text-sm leading-6 text-black">
              {t("instructions")}
            </Text>
            <Link
              className="mt-4 inline-block cursor-pointer rounded bg-green-600 px-4 py-2 text-white"
              href={url}
            >
              {t("buttonText")}
            </Link>
            <Text className="text-sm leading-6 text-black">
              {t("alternateInstructions")}
            </Text>
            <Link className="mt-4 text-sm leading-6 text-black" href={url}>
              {url}
            </Link>
            <Text className="text-sm leading-6 text-black">
              {t("questions")}
            </Text>
            <Text className="text-sm font-light leading-6 text-gray-400">
              {t("signature")}
            </Text>
            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
