import Link from "next/link"
import { ArrowLeft, Filter, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { getServices } from "@/lib/storage-utils"

export const metadata = {
  title: "Gas Stations | Masar",
  description: "Find gas stations near you",
}

export default function GasStationsPage() {
  // In a real app, we would filter by category from the database
  // Here we're simulating that by filtering the mock data
  const allServices = getServices()
  const gasStations = allServices.filter(
    (service) => service.category === "Gas Stations" || service.tags?.includes("fuel") || service.tags?.includes("gas"),
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
          <h1 className="text-3xl font-bold mb-2">Gas Stations</h1>
          <p className="text-muted-foreground mb-4">Find gas stations near you with competitive prices and services</p>
        </div>
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Input placeholder="Search gas stations..." className="pl-10" />
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
                <label className="text-sm font-medium mb-1 block">Fuel Type</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Fuel Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel Types</SelectItem>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric Charging</SelectItem>
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
                <label className="text-sm font-medium mb-1 block">Amenities</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="convenience-store" className="mr-2" />
                    <label htmlFor="convenience-store" className="text-sm">
                      Convenience Store
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="car-wash" className="mr-2" />
                    <label htmlFor="car-wash" className="text-sm">
                      Car Wash
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="atm" className="mr-2" />
                    <label htmlFor="atm" className="text-sm">
                      ATM
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="restrooms" className="mr-2" />
                    <label htmlFor="restrooms" className="text-sm">
                      Restrooms
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
              Showing <span className="font-medium">{gasStations.length}</span> gas stations
            </div>
            <Select defaultValue="nearest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nearest">Nearest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gasStations.length > 0 ? (
              gasStations.map((station) => (
                <Card key={station.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <img
                        src={station.image || `/placeholder.svg?height=200&width=400&query=gas+station`}
                        alt={station.name}
                        className="object-cover w-full h-full"
                      />
                      {station.isOpen && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Open Now
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-1">{station.name}</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{station.address || "123 Main St"}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{station.rating || "4.5"}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({station.reviewCount || "24"} reviews)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-sm">
                        <span className="font-medium">Regular:</span> {station.regularPrice || "$3.45"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Premium:</span> {station.premiumPrice || "$3.89"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Diesel:</span> {station.dieselPrice || "$3.65"}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Last Updated:</span> {station.lastUpdated || "2 hours ago"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm">
                      Get Directions
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/services/${station.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <h3 className="text-xl font-medium mb-2">No gas stations found</h3>
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
