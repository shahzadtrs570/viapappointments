import { ArrowRight, Sparkles, Shield, Users, Zap, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useNavigate } from "react-router-dom"

const About = () => {
  const navigate = useNavigate()

  const values = [
    {
      icon: Sparkles,
      title: "Simplicity",
      description: "Technology should feel invisible.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Verified listings, transparent data.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly improving through AI.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Real buyers, real sellers, real value.",
    },
  ]

  const timeline = [
    {
      year: "Origin",
      title: "Born from Experience",
      description:
        "Founded by the team behind Marketplace Listing Tool, bringing years of marketplace expertise.",
    },
    {
      year: "Evolution",
      title: "Beyond Automotive",
      description:
        "Evolved from an automotive platform into a full-scale AI marketplace for all things.",
    },
    {
      year: "Today",
      title: "Human-First Search",
      description:
        "Built with one simple belief: the search experience should feel human again.",
    },
  ]

  const searchExamples = [
    "SUV under 40k in Miami",
    "3-bed home with pool in Austin",
    "Sportbike under 10k near me",
    "Boat with cabin, Florida coast",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0%,transparent_50%)] animate-glow-pulse" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-tight">
              We're building the future of how people{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                buy and sell
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
              At Check The Lot, we believe listing anything should feel
              effortless — and powered by intelligence.
            </p>
            <Button
              size="lg"
              className="group mt-8 h-14 px-8 text-lg glow-hover"
              onClick={() => navigate("/search")}
            >
              Explore Listings
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight">
                Our Mission
              </h2>
              <p className="text-xl text-foreground/90 leading-relaxed">
                Our mission is to unify every major marketplace — cars, homes,
                boats, and more — into one intelligent platform that understands
                you.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're not just another listing site. We're reimagining how
                discovery works in the digital age, making it feel natural,
                intuitive, and surprisingly human.
              </p>
            </div>

            <div className="relative h-96 glass rounded-2xl overflow-hidden glow-primary">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-32 w-32 text-primary/30 animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-black text-center mb-20 animate-fade-in">
            Our Story
          </h2>

          <div className="max-w-4xl mx-auto space-y-12">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="relative pl-12 pb-12 border-l-2 border-primary/30 last:border-l-0 last:pb-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-primary" />
                <div className="space-y-2">
                  <div className="text-sm font-bold text-primary uppercase tracking-wider">
                    {item.year}
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <Card className="glass-strong p-12 md:p-16 border-primary/20 glow-primary max-w-5xl mx-auto animate-scale-in">
            <div className="space-y-8 text-center">
              <h2 className="font-display text-4xl md:text-5xl font-black">
                AI-Powered Intelligence
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI-powered search that understands natural language. Ask for
                what you want — and Check The Lot finds it.
              </p>

              <div className="grid md:grid-cols-2 gap-4 pt-8">
                {searchExamples.map((example, index) => (
                  <div
                    key={index}
                    className="glass p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-primary group-hover:animate-pulse" />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        "{example}"
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-black text-center mb-20 animate-fade-in">
            Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="glass-strong p-8 border-border/50 hover:border-primary/50 transition-all group glow-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-4xl md:text-5xl font-black text-center mb-8 animate-fade-in">
            The Team Behind the Transformation
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-20">
            Built by marketplace veterans who've scaled platforms serving
            millions of users.
          </p>

          <div className="max-w-4xl mx-auto glass-strong p-12 rounded-2xl border border-primary/20 text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-6 opacity-50" />
            <p className="text-lg text-muted-foreground">
              Our team combines decades of experience in marketplace technology,
              AI, and user experience design.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
              Join us as we redefine the marketplace
            </h2>
            <Button
              size="lg"
              className="group h-14 px-10 text-lg glow-hover"
              onClick={() => navigate("/search")}
            >
              Check the Lot
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
