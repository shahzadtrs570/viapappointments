// Translation is not integrated in this folder as well
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-imports */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable max-lines */
/* eslint-disable react/jsx-max-depth */
import type { Metadata } from "next"

import { Button } from "@package/ui/button"
import { Card } from "@package/ui/card"
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import {
  ArrowRight,
  BarChart4,
  // Building,
  BarChartHorizontal,
  Globe,
  // HandCoins,
  Heart,
  LineChart,
  Landmark,
  // Lock,
  // Users,
  // FileCheck,
  Lightbulb,
  Home,
  FileText,
  // MapPin,
  Shield,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "VIPAPPOINTMENTS | Unlock Your Vehicle By Choosing The Right Vehicle",
  description:
    "Partner with Srenova to build a diversified portfolio of viager properties. Our standardized approach offers stable returns backed by real estate with positive social impact.",
}

function InvestmentStepCard({
  number,
  title,
  items,
}: {
  number: string
  title: string
  items: string[]
}) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute -right-4 -top-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-center text-2xl font-bold text-primary">
        {number}
      </div>
      <Typography className="mb-4 text-xl font-semibold" variant="h4">
        {title}
      </Typography>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li className="flex items-start gap-2" key={index}>
            <div className="mt-1 rounded-full bg-primary/10 p-0.5">
              <ArrowRight className="size-3 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function TestimonialCard({
  quote,
  author,
  position,
  logoSrc,
}: {
  quote: string
  author: string
  position: string
  logoSrc: string
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4 h-10 w-24">
        <Image
          alt={`${author}'s company logo`}
          height={40}
          src={logoSrc}
          width={96}
        />
      </div>
      <Typography
        className="flex-1 text-lg font-light italic text-muted-foreground"
        variant="body"
      >
        "{quote}"
      </Typography>
      <div className="mt-4">
        <Typography className="font-medium" variant="small">
          {author}
        </Typography>
        <Typography className="text-sm text-muted-foreground" variant="small">
          {position}
        </Typography>
      </div>
    </Card>
  )
}

function BenefitCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="mb-4 w-fit rounded-full bg-primary/10 p-3">{icon}</div>
      <Typography className="mb-4 text-xl font-semibold" variant="h4">
        {title}
      </Typography>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li className="flex items-start gap-2" key={index}>
            <div className="mt-1 rounded-full bg-primary/10 p-0.5">
              <ArrowRight className="size-3 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function FundPage() {
  return (
    <div className="space-y-16 pb-16 pt-8">
      {/* Hero Section */}
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-center space-y-6">
          <div className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Institutional Investment Opportunity
          </div>
          <Typography variant="h1" className="md:text-5xl">
            Institutional Investment with{" "}
            <span className="text-primary">Social Impact</span>
          </Typography>
          <Typography variant="body" className="text-lg text-muted-foreground">
            Partner with Srenova to build a diversified portfolio of viager
            properties. Our standardized approach offers stable returns backed
            by real estate while providing dignified retirement solutions for
            seniors.
          </Typography>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Contact Our Investment Team
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn About Our Portfolio
            </Button>
          </div>
        </div>
        <div className="relative flex h-full min-h-[300px] items-center justify-center rounded-lg bg-muted md:min-h-[400px]">
          <Image
            src="/images/investment.jpg"
            alt="Institutional investment with social impact"
            fill
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/30 to-secondary/30 opacity-20" />
        </div>
      </Container>

      {/* Key Benefits Section */}
      <Container>
        <div className="mb-10 text-center">
          <Typography
            variant="h2"
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            Why Invest with Srenova?
          </Typography>
          <Typography
            variant="body"
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Our institutional-grade approach transforms traditional viager
            transactions into a modern, scalable investment opportunity with
            both financial and social returns.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <BenefitCard
            icon={<BarChart4 className="size-6 text-primary" />}
            title="Stable Returns"
            items={[
              "Real estate-backed investments",
              "Long-term income streams",
              "Balanced risk profile",
              "Professional portfolio management",
            ]}
          />
          <BenefitCard
            icon={<Heart className="size-6 text-primary" />}
            title="ESG Impact"
            items={[
              "Support dignified retirement for seniors",
              "Enable aging in place",
              "Address European pension challenges",
              "Community-positive investments",
            ]}
          />
          <BenefitCard
            icon={<Globe className="size-6 text-primary" />}
            title="Market Leadership"
            items={[
              "Standardized viager transactions",
              "Pan-European presence",
              "Digital infrastructure advantage",
              "Institutional-grade due diligence",
            ]}
          />
        </div>
      </Container>

      {/* Investment Process */}
      <Container className="rounded-lg bg-muted/30 py-12">
        <div className="mb-10 text-center">
          <Typography
            variant="h2"
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            How Srenova Investment Works
          </Typography>
          <Typography
            variant="body"
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Our streamlined process ensures efficient capital deployment with
            rigorous due diligence and ongoing professional management.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InvestmentStepCard
            number="1"
            title="Portfolio Strategy"
            items={[
              "Investment objectives assessment",
              "Risk profile determination",
              "Geographic allocation planning",
              "Portfolio composition design",
            ]}
          />
          <InvestmentStepCard
            number="2"
            title="Due Diligence"
            items={[
              "Rigorous property assessment",
              "Actuarial analysis",
              "Legal compliance verification",
              "Risk mitigation planning",
            ]}
          />
          <InvestmentStepCard
            number="3"
            title="Deployment & Management"
            items={[
              "Efficient capital deployment",
              "Professional portfolio management",
              "Regular performance reporting",
              "Ongoing optimization",
            ]}
          />
          <InvestmentStepCard
            number="4"
            title="Returns & Impact"
            items={[
              "Stable financial returns",
              "Positive social impact metrics",
              "Transparent performance reporting",
              "ESG outcome documentation",
            ]}
          />
        </div>
      </Container>

      {/* Case Studies / Testimonials */}
      <Container>
        <div className="mb-10 text-center">
          <Typography
            variant="h2"
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            Investment Success Stories
          </Typography>
          <Typography
            variant="body"
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Learn how institutional investors are achieving their financial and
            impact objectives through Srenova's viager portfolio.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <TestimonialCard
            quote="Srenova's viager portfolio has provided our fund with stable returns while contributing to our ESG objectives. Their standardized approach and rigorous due diligence have made viager a viable asset class for institutional investment."
            author="Jean Dupont"
            position="Investment Director, European Pension Fund"
            logoSrc="/images/logo-placeholder-1.svg"
          />
          <TestimonialCard
            quote="By incorporating Srenova's viager properties into our portfolio, we've achieved both diversification and steady income streams. The social impact component resonates strongly with our investors."
            author="Sarah Johnson"
            position="Portfolio Manager, Real Estate Investment Trust"
            logoSrc="/images/logo-placeholder-2.svg"
          />
          <TestimonialCard
            quote="Working with Srenova has allowed us to fulfill our dual mandate of financial returns and social good. Their ability to scale viager transactions while maintaining quality has been impressive."
            author="Marco Bianchi"
            position="Director, Impact Investment Fund"
            logoSrc="/images/logo-placeholder-3.svg"
          />
        </div>
      </Container>

      {/* Market Education */}
      <Container className="rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <Typography
              variant="h2"
              className="mb-6 text-3xl font-bold md:text-4xl"
            >
              Understanding Viager as an Institutional Asset Class
            </Typography>

            <div className="mb-8">
              <Typography variant="h4" className="mb-3 text-xl font-semibold">
                Viager Reimagined for Institutions
              </Typography>
              <Typography variant="body" className="text-muted-foreground">
                Srenova has transformed traditional viager transactions into a
                standardized, institutional-grade investment opportunity. Our
                platform enables scale, compliance, and diversification
                previously unavailable in this market.
              </Typography>
            </div>

            <div className="mb-8">
              <Typography variant="h4" className="mb-3 text-xl font-semibold">
                Market Opportunity
              </Typography>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                    <ArrowRight className="size-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Europe's aging population creates growing demand
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                    <ArrowRight className="size-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Limited institutional presence in current viager market
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                    <ArrowRight className="size-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Real estate backed returns with social component
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                    <ArrowRight className="size-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">
                    Expansion potential across multiple European markets
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="relative mb-8 h-48 overflow-hidden rounded-lg md:h-64">
              <Image
                src="/images/europe-map.jpg"
                alt="European market opportunity"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent opacity-30" />
            </div>

            <div>
              <Typography variant="h4" className="mb-3 text-xl font-semibold">
                Investment Structures
              </Typography>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="flex items-center gap-3 p-4">
                  <Home className="size-5 text-primary" />
                  <Typography className="text-sm">
                    Direct property acquisition
                  </Typography>
                </Card>
                <Card className="flex items-center gap-3 p-4">
                  <BarChartHorizontal className="size-5 text-primary" />
                  <Typography className="text-sm">
                    Fund participation
                  </Typography>
                </Card>
                <Card className="flex items-center gap-3 p-4">
                  <FileText className="size-5 text-primary" />
                  <Typography className="text-sm">
                    Customized portfolio solutions
                  </Typography>
                </Card>
                <Card className="flex items-center gap-3 p-4">
                  <Lightbulb className="size-5 text-primary" />
                  <Typography className="text-sm">
                    Flexible investment approaches
                  </Typography>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Trust Indicators */}
      <Container>
        <div className="mb-10 text-center">
          <Typography
            variant="h2"
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            Why Partner with Srenova?
          </Typography>
          <Typography
            variant="body"
            className="mx-auto max-w-2xl text-muted-foreground"
          >
            Our institutional approach combines deep viager expertise with
            technology and rigorous risk management.
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 w-fit rounded-full bg-primary/10 p-3">
              <Landmark className="size-6 text-primary" />
            </div>
            <Typography variant="h4" className="mb-3 text-xl font-semibold">
              Institutional Expertise
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Specialized viager knowledge
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Financial structuring experience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Real estate valuation expertise
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Actuarial modeling capabilities
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 w-fit rounded-full bg-primary/10 p-3">
              <LineChart className="size-6 text-primary" />
            </div>
            <Typography variant="h4" className="mb-3 text-xl font-semibold">
              Technology Advantage
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Proprietary digital platform
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Advanced analytics
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Efficient transaction processing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Transparent reporting systems
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 w-fit rounded-full bg-primary/10 p-3">
              <Shield className="size-6 text-primary" />
            </div>
            <Typography variant="h4" className="mb-3 text-xl font-semibold">
              Risk Management
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Diversified property portfolio
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Actuarial risk assessment
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Legal compliance framework
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 rounded-full bg-primary/10 p-0.5">
                  <ArrowRight className="size-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Active portfolio monitoring
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Call to Action */}
      <Container>
        <div className="rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 p-8 text-center">
          <Typography
            variant="h3"
            className="mb-4 text-2xl font-bold md:text-3xl"
          >
            Explore Investment Opportunities
          </Typography>
          <Typography
            variant="body"
            className="mx-auto mb-6 max-w-2xl text-muted-foreground"
          >
            Discover how Srenova can help you achieve stable returns with
            positive social impact.
          </Typography>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="gap-2" size="lg">
              Schedule a Consultation
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg">
              Request Investment Brochure
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
