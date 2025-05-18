"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel, ShoppingBag, Utensils, AmbulanceIcon as FirstAid, MapPin, Search, Filter, Loader2 } from "lucide-react"
import { type Store, type Service, getStores, getServices } from "@/lib/storage-utils"

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted/30 animate-pulse flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
      <span className="sr-only">Loading map...</span>
    </div>
  ),
})

export default function MapPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.9539, 35.9106])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize storage with mock data
    const initStorage = async () => {
      const { initializeStorage } = await import("@/lib/storage-utils")
      initializeStorage()
      setStores(getStores())
      setServices(getServices())
      setIsLoading(false)
    }

    initStorage()

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude]
        setUserLocation(userCoords)
        setMapCenter(userCoords)
      },
      (error) => {
        console.error("Error getting user location:", error)
      },
    )
  }, [])

  // Filter stores and services based on search and category
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      searchQuery === "" ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === "" || store.categories.some((cat) => cat.toLowerCase() === categoryFilter.toLowerCase())

    return matchesSearch && matchesCategory
  })

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "" || service.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Prepare markers for the map
  const getMarkers = () => {
    const markers = []

    if (activeTab === "all" || activeTab === "stores") {
      markers.push(
        ...filteredStores.map((store) => ({
          position: [store.location.lat, store.location.lng] as [number, number],
          title: store.name,
          type: store.categories[0].toLowerCase().includes("gas") ? "gas" : "store",
          id: store.id,
        })),
      )
    }

    if (activeTab === "all" || activeTab === "services") {
      markers.push(
        ...filteredServices.map((service) => ({
          position: [service.location.lat, service.location.lng] as [number, number],
          title: service.name,
          type: service.isEmergency
            ? "emergency"
            : service.category.toLowerCase().includes("medical")
              ? "medical"
              : service.category.toLowerCase().includes("gas")
                ? "gas"
                : "default",
          id: service.id,
        })),
      )
    }

    return markers
  }

  // Get all available categories
  const allCategories = [
    ...new Set([...stores.flatMap((store) => store.categories), ...services.map((service) => service.category)]),
  ].sort()

  return (
    <div className="container px-4 md:px-6 py-8 section-padding">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Interactive Service Map</h1>
        <p className="text-muted-foreground text-lg">Discover stores and services in your area</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Find Services</CardTitle>
              <CardDescription>Discover stores and services near you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search by name or description..."
                    className="pl-8 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category" className="rounded-lg">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full rounded-lg"
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start rounded-lg"
                  onClick={() => {
                    setCategoryFilter("gas")
                    setActiveTab("all")
                  }}
                >
                  <Fuel className="mr-2 h-4 w-4 text-amber-500" />
                  Gas Stations
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-lg"
                  onClick={() => {
                    setCategoryFilter("groceries")
                    setActiveTab("stores")
                  }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4 text-green-500" />
                  Grocery Stores
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-lg"
                  onClick={() => {
                    setCategoryFilter("medical")
                    setActiveTab("all")
                  }}
                >
                  <FirstAid className="mr-2 h-4 w-4 text-red-500" />
                  Medical
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-lg"
                  onClick={() => {
                    setCategoryFilter("restaurants")
                    setActiveTab("services")
                  }}
                >
                  <Utensils className="mr-2 h-4 w-4 text-orange-500" />
                  Restaurants
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                className="w-full rounded-lg"
                onClick={() => {
                  if (userLocation) {
                    setMapCenter(userLocation)
                  }
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Center on my location
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg">
              <TabsTrigger value="all" className="rounded-md">
                All
              </TabsTrigger>
              <TabsTrigger value="stores" className="rounded-md">
                Stores
              </TabsTrigger>
              <TabsTrigger value="services" className="rounded-md">
                Services
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="h-[600px] rounded-lg border overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="h-full w-full bg-muted/30 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground">Loading map data...</p>
                </div>
              </div>
            ) : (
              <MapWithNoSSR center={mapCenter} zoom={13} markers={getMarkers()} showUserLocation={true} />
            )}
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>
              Showing {getMarkers().length} {activeTab === "all" ? "locations" : activeTab}
            </p>
            <p>{userLocation ? "Using your current location" : "Using default location"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
