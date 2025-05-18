import Link from "next/link"
import { ArrowLeft, Clock, Filter, MapPin, Star, WifiIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getServices } from "@/lib/storage-utils"

export const metadata = {
  title: "Internet & Tech Services | Masar",
  description: "Find internet providers, tech support, and IT services near you",
}

export default function TechServicesPage() {
  // In a real app, we would filter by category from the database
  // Here we're simulating that by filtering the mock data
  const allServices = getServices()
  const techServices = allServices.filter(
    (service) =>
      service.category === "Internet & Tech" ||
      service.tags?.includes("tech") ||
      service.tags?.includes("internet") ||
      service.tags?.includes("IT") ||
      service.tags?.includes("computer"),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">Internet & Tech Services</h1>
          <p className="text-muted-foreground mb-4">
            Find internet providers, tech support, computer repair, and IT services
          </p>
        </div>
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Input placeholder="Search tech services..." className="pl-10" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-background rounded-lg border p-4">
            <div className="font-medium flex items-center mb-4">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </div>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Service Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="internet">Internet Provider</SelectItem>
                    <SelectItem value="repair">Computer Repair</SelectItem>
                    <SelectItem value="support">Tech Support</SelectItem>
                    <SelectItem value="network">Network Services</SelectItem>
                    <SelectItem value="security">Cybersecurity</SelectItem>
                    <SelectItem value="cloud">Cloud Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Distance</label>
                <Select defaultValue="5km">
                  <SelectTrigger>
                    <SelectValue placeholder="Within 5km" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1km">Within 1km</SelectItem>
                    <SelectItem value="5km">Within 5km</SelectItem>
                    <SelectItem value="10km">Within 10km</SelectItem>
                    <SelectItem value="20km">Within 20km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Features</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="remote" className="mr-2" />
                    <label htmlFor="remote" className="text-sm">
                      Remote Support
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="onsite" className="mr-2" />
                    <label htmlFor="onsite" className="text-sm">
                      On-site Service
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="business" className="mr-2" />
                    <label htmlFor="business" className="text-sm">
                      Business Services
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="residential" className="mr-2" />
                    <label htmlFor="residential" className="text-sm">
                      Residential Services
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="emergency" className="mr-2" />
                    <label htmlFor="emergency" className="text-sm">
                      Emergency Support
                    </label>
                  </div>
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{techServices.length}</span> tech services
            </div>
            <Select defaultValue="rating">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="nearest">Nearest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techServices.length > 0 ? (
              techServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <img
                        src={service.image || `/placeholder.svg?height=200&width=400&query=tech+support+service`}
                        alt={service.name}
                        className="object-cover w-full h-full"
                      />
                      {service.isOpen && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Available Now
                        </div>
                      )}
                      {service.emergency && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Emergency Support
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      {service.serviceType || "Tech Support & Services"}
                    </div>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{service.address || "123 Main St"}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{service.rating || "4.7"}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({service.reviewCount || "38"} reviews)
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{service.hours || "9:00 AM - 7:00 PM"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(service.specialties || ["Computer Repair", "Network Setup", "Tech Support"]).map(
                        (specialty, index) => (
                          <span
                            key={index}
                            className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                          >
                            {specialty}
                          </span>
                        ),
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      <WifiIcon className="h-4 w-4 mr-2" />
                      Get Support
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/services/${service.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-xl font-medium mb-2">No tech services found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                <Button>Reset Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
