"use client"

import { useEffect, useState } from "react"
import { getServices, type Service } from "@/lib/storage-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MapPin, Phone, Clock, Star, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EmergencyServicesPage() {
  const [emergencyServices, setEmergencyServices] = useState<Service[]>([])

  useEffect(() => {
    const fetchEmergencyServices = () => {
      const allServices = getServices()
      const emergency = allServices.filter((service) => service.isEmergency)
      setEmergencyServices(emergency)
    }

    fetchEmergencyServices()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-red-600">Emergency Services</h1>
        <p className="text-muted-foreground mt-1">Critical services available 24/7</p>
      </div>

      <Alert variant="destructive" className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          For life-threatening emergencies, please call the national emergency number immediately.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {emergencyServices.map((service) => (
          <Link href={`/services/${service.id}`} key={service.id}>
            <Card className="h-full transition-all hover:shadow-md border-red-200">
              <CardHeader className="relative p-0">
                <div className="h-48 w-full relative">
                  <Image
                    src={service.image || "/placeholder.svg?height=200&width=400&query=emergency+service"}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Emergency
                </Badge>
                {service.isOpen ? (
                  <Badge
                    variant="outline"
                    className="absolute top-2 left-2 bg-green-100 text-green-800 border-green-300"
                  >
                    Open
                  </Badge>
                ) : (
                  <Badge variant="outline" className="absolute top-2 left-2 bg-red-100 text-red-800 border-red-300">
                    Closed
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2 mb-4">{service.description}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{service.location.address}</span>
                </div>
                <div className="flex items-center text-sm font-bold text-red-600 mb-2">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{service.contactInfo.phone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="truncate">
                    {service.openingHours.monday === "Open 24 Hours" ? "Open 24 Hours" : service.openingHours.monday}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Badge>{service.category}</Badge>
                {service.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{service.rating.toFixed(1)}</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {emergencyServices.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No emergency services found</h3>
          <p className="text-muted-foreground mt-1">Please check back later or contact the national emergency number</p>
        </div>
      )}
    </div>
  )
}
