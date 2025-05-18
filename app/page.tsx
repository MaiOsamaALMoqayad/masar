import { Button } from "@/components/ui/button"
import { MapPinIcon, ShoppingBag, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import FeaturedStores from "@/components/featured-stores"
import ServiceCategories from "@/components/service-categories"
import HeroMap from "@/components/hero-map"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <HeroMap />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-lg space-y-6 animate-slide-up">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                Discover Your Neighborhood
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Connect with <span className="gradient-heading">Local Services</span> & Products
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Find nearby sellers and essential services on Masar - your comprehensive local marketplace platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full"
                >
                  <Link href="/map">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    Explore Map
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link href="/marketplace">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Browse Marketplace
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <div className="rounded-full bg-background/80 backdrop-blur-md p-4 shadow-lg">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="container px-4 md:px-6 section-padding">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col gap-2 max-w-[800px]">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
              Essential Services
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Find the services you need</h2>
            <p className="text-muted-foreground text-lg">
              Discover and connect with local service providers for all your essential needs.
            </p>
          </div>
          <ServiceCategories />
        </div>
      </section>

      {/* Featured Stores */}
      <section className="bg-muted/30">
        <div className="container px-4 md:px-6 section-padding">
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex flex-col gap-2 max-w-[800px]">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary w-fit">
                Popular Stores
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Discover top-rated sellers</h2>
                <Button
                  variant="ghost"
                  className="hidden md:flex items-center gap-1 hover:bg-transparent hover:text-primary"
                  asChild
                >
                  <Link href="/stores">
                    View all stores
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <p className="text-muted-foreground text-lg">
                Explore the most popular and highly-rated stores in your area.
              </p>
            </div>
            <FeaturedStores />
            <div className="md:hidden flex justify-center">
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/stores">View all stores</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 md:px-6 section-padding">
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="max-w-[800px]">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Simple steps to connect with local services
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              Masar makes it easy to find and connect with the services and products you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full staggered-animation">
            <div className="flex flex-col items-center gap-4 p-8 bg-background rounded-xl border shadow-sm card-hover">
              <div className="bg-primary/10 p-4 rounded-full">
                <MapPinIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Find Services</h3>
              <p className="text-muted-foreground text-center">
                Discover local services and stores on our interactive map with real-time filtering.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 bg-background rounded-xl border shadow-sm card-hover">
              <div className="bg-primary/10 p-4 rounded-full">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Connect with Sellers</h3>
              <p className="text-muted-foreground text-center">
                Browse products, read reviews, and contact sellers directly through our platform.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 p-8 bg-background rounded-xl border shadow-sm card-hover">
              <div className="bg-primary/10 p-4 rounded-full">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Get What You Need</h3>
              <p className="text-muted-foreground text-center">
                Find essential services and products when you need them most, all in one place.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Link href="/register">Join Masar Today</Link>
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30">
        <div className="container px-4 md:px-6 section-padding">
          <div className="flex flex-col gap-8 items-center text-center mb-10">
            <div className="max-w-[800px]">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What our users say</h2>
              <p className="text-muted-foreground text-lg mt-4">
                Hear from people who have found value using the Masar platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Masar helped me find a gas station when I was running low on fuel in an unfamiliar area. Lifesaver!",
                author: "Ahmed K.",
                role: "Regular User",
              },
              {
                quote:
                  "As a small business owner, Masar has connected me with so many new customers in my neighborhood.",
                author: "Layla M.",
                role: "Store Owner",
              },
              {
                quote: "I love being able to browse local products and read reviews before making a purchase decision.",
                author: "Omar J.",
                role: "Regular User",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-background rounded-xl p-6 border shadow-sm card-hover">
                <div className="flex flex-col gap-4">
                  <div className="h-10">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.5 5H5V15L10 25H15L10 15H12.5V5Z" fill="hsl(var(--primary))" />
                      <path d="M27.5 5H20V15L25 25H30L25 15H27.5V5Z" fill="hsl(var(--primary))" />
                    </svg>
                  </div>
                  <p className="text-lg">{testimonial.quote}</p>
                  <div className="mt-auto pt-4">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 md:px-6 section-padding">
        <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 p-8 md:p-12 lg:p-16 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to explore your neighborhood?</h2>
              <p className="text-white/80 text-lg">
                Join Masar today and discover local services and products near you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="rounded-full" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="lg"
                variant="default"
                className="rounded-full bg-white text-purple-600 hover:bg-white/90"
                asChild
              >
                <Link href="/register">Sign up for free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
