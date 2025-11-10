import {
  ArrowRight,
  Check,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useNavigate } from "react-router-dom"

const Dealers = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Globe,
      title: "Nationwide Reach",
      description:
        "Connect with buyers across the entire country searching for their next vehicle.",
    },
    {
      icon: Target,
      title: "AI-Powered Matching",
      description:
        "Our intelligent system matches your inventory with buyers' natural language searches.",
    },
    {
      icon: TrendingUp,
      title: "Increase Visibility",
      description:
        "Stand out with premium placements and featured listings that drive real traffic.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Track views, engagement, and leads with comprehensive dealer dashboards.",
    },
  ]

  const freeFeatures = [
    "Unlimited vehicle listings",
    "High-resolution photo galleries",
    "Detailed specifications display",
    "Direct buyer inquiries",
    "Mobile-optimized listings",
    "Basic analytics dashboard",
  ]

  const premiumFeatures = [
    "Featured homepage placement",
    "Top of search results",
    "Enhanced listing badges",
    "Priority customer support",
    "Advanced analytics & insights",
    "Custom branding options",
    "Social media promotion",
    "Dedicated account manager",
  ]

  const stats = [
    { value: "2M+", label: "Monthly Visitors" },
    { value: "150K+", label: "Active Listings" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full mb-4">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold">Join 5,000+ Dealers</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Sell More Vehicles with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                AI-Powered Listings
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
              List your entire inventory for free. Reach millions of qualified
              buyers. Boost visibility with premium advertising starting at just
              $995/month.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="group h-14 px-8 text-lg glow-hover"
                onClick={() => navigate("/contact")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-primary/50 hover:bg-primary/10"
                onClick={() => navigate("/contact")}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-display text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-black">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for dealers, powered by AI, designed for results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-strong p-8 border-border/50 hover:border-primary/50 transition-all group glow-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-black">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="glass-strong p-8 md:p-10 border-border/50 animate-fade-in-up">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-black mb-2">
                    Free Listings
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Perfect for getting started and reaching buyers nationwide.
                </p>

                <Button
                  className="w-full h-12 group"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="pt-6 space-y-4">
                  <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    What's Included
                  </div>
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card
              className="glass-strong p-8 md:p-10 border-primary/50 glow-primary relative animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="glass-strong px-6 py-2 rounded-full border border-primary/50">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-black mb-2">
                    Premium Advertising
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                      $995
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  Maximize visibility and drive more qualified leads to your
                  dealership.
                </p>

                <Button
                  className="w-full h-12 group glow-hover"
                  onClick={() => navigate("/contact")}
                >
                  Start Advertising
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="pt-6 space-y-4">
                  <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    Everything in Free, Plus
                  </div>
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="py-32 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Users className="h-16 w-16 text-primary mx-auto opacity-50" />
            <blockquote className="text-2xl md:text-3xl font-light italic text-foreground/90 leading-relaxed">
              "Check The Lot has completely transformed how we reach buyers. The
              AI-powered search means our inventory gets in front of the right
              people, and the premium advertising has doubled our online leads."
            </blockquote>
            <div className="space-y-1">
              <div className="font-bold">Mike Stevens</div>
              <div className="text-sm text-muted-foreground">
                Owner, Premium Auto Group
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight">
              Ready to Grow Your Dealership?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of dealers already reaching more buyers on Check
              The Lot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="group h-14 px-10 text-lg glow-hover"
                onClick={() => navigate("/contact")}
              >
                Get Started Free Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever • Upgrade anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Dealers
