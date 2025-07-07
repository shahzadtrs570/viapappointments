// Translation not integrated in this folder

/*eslint-disable import/order*/
/*eslint-disable react/jsx-max-depth */
import { Button } from "@package/ui/button"
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"

import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

import { ContactForm } from "./_components/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us | Srenova",
  description:
    "Reach out to the Srenova team for questions about unlocking your property's value while staying in your home.",
}

export default function ContactPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Contact Information */}
        <div className="flex flex-col gap-8">
          <div>
            <Typography className="mb-4" variant="h1">
              Contact Us
            </Typography>
            <Typography
              className="max-w-md text-muted-foreground"
              variant="body"
            >
              {`Have questions about Srenova? Our team is here to help you
              understand how you can unlock your property's value while staying
              in your home.`}
            </Typography>
          </div>

          <div className="mt-4 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Mail size={20} />
              </div>
              <div>
                <Typography className="mb-1" variant="h4">
                  Email Us
                </Typography>
                <Typography className="text-muted-foreground" variant="body">
                  <Link
                    className="hover:text-primary"
                    href="mailto:info@Srenova.com"
                  >
                    info@Srenova.com
                  </Link>
                </Typography>
                <Typography className="text-muted-foreground" variant="small">
                  We typically respond within 24 hours
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Phone size={20} />
              </div>
              <div>
                <Typography className="mb-1" variant="h4">
                  Call Us
                </Typography>
                <Typography className="text-muted-foreground" variant="body">
                  <Link
                    className="hover:text-primary"
                    href="tel:+44-20-7123-4567"
                  >
                    +44 20 7123 4567
                  </Link>
                </Typography>
                <Typography className="text-muted-foreground" variant="small">
                  Monday to Friday, 9am to 5pm GMT
                </Typography>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <Typography className="mb-1" variant="h4">
                  Visit Us
                </Typography>
                <Typography className="text-muted-foreground" variant="body">
                  123 Financial Street
                </Typography>
                <Typography className="text-muted-foreground" variant="body">
                  London, EC2M 1JJ
                </Typography>
                <Typography className="text-muted-foreground" variant="small">
                  By appointment only
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button asChild className="mr-4" variant="outline">
              <Link href="/faq">Read our FAQ</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <Typography className="mb-6" variant="h3">
            Send us a message
          </Typography>
          <ContactForm />
        </div>
      </div>
    </Container>
  )
}
