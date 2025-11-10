import Header from "@/components/Header"
import Hero from "@/components/Hero"
import ListingCard from "@/components/ListingCard"
import AIFilterButton from "@/components/AIFilterButton"
import Footer from "@/components/Footer"

import carImage1 from "@/assets/listing-car-plain-1.jpg"
import boatImage from "@/assets/listing-boat-plain.jpg"
import motorcycleImage from "@/assets/listing-motorcycle-plain.jpg"
import homeImage from "@/assets/listing-home-plain.jpg"
import rvImage from "@/assets/listing-rv-plain.jpg"
import carImage2 from "@/assets/listing-car-plain-2.jpg"

const Index = () => {
  const listings = [
    {
      image: carImage1,
      title: "2024 Porsche 911 Turbo S",
      price: "$189,900",
      location: "Miami, FL",
      badge: "Matches your vibe",
      category: "Vehicles",
      verified: true,
      views: 1234,
    },
    {
      image: boatImage,
      title: "42ft Luxury Yacht",
      price: "$275,000",
      location: "Fort Lauderdale, FL",
      badge: "Smart value pick",
      category: "Boats",
      verified: true,
      views: 856,
    },
    {
      image: motorcycleImage,
      title: "Ducati Panigale V4",
      price: "$28,500",
      location: "Los Angeles, CA",
      badge: "Popular near you",
      category: "Motorcycles",
      views: 542,
    },
    {
      image: homeImage,
      title: "Modern Beachfront Villa",
      price: "$2.4M",
      location: "Malibu, CA",
      category: "Homes",
      verified: true,
      views: 3201,
    },
    {
      image: rvImage,
      title: "2023 Mercedes Sprinter RV",
      price: "$89,900",
      location: "Denver, CO",
      badge: "Great for adventures",
      category: "RVs",
      views: 678,
    },
    {
      image: carImage2,
      title: "Tesla Model S Plaid",
      price: "$94,990",
      location: "San Francisco, CA",
      badge: "Eco-friendly choice",
      category: "Vehicles",
      verified: true,
      views: 987,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Listings Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Curated Just For You
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered recommendations based on your preferences and browsing
              history
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {listings.map((listing, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ListingCard {...listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AIFilterButton />
      <Footer />
    </div>
  )
}

export default Index
