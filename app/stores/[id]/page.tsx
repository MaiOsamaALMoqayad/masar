"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Info, Mail, MapPin, MessageSquare, Phone, ShoppingBag, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  type Product,
  type Review,
  type Store,
  getProductsByStore,
  getReviews,
  getStoreById,
} from "@/lib/storage-utils"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import FavoriteButton from "@/components/favorite-button"

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted/30 animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export default function StorePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize storage with mock data
    const initStorage = async () => {
      const { initializeStorage } = await import("@/lib/storage-utils")
      initializeStorage()

      if (typeof id === "string") {
        // Get store details
        const storeData = getStoreById(id)
        if (storeData) {
          setStore(storeData)

          // Get store products
          const storeProducts = getProductsByStore(id)
          setProducts(storeProducts)

          // Get reviews (mock for now)
          const allReviews = getReviews()
          setReviews(allReviews)
        } else {
          // Store not found, redirect to 404
          router.push("/not-found")
        }
      }

      setLoading(false)
    }

    initStorage()
  }, [id, router])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-8 w-1/3 bg-muted rounded-lg"></div>
          <div className="h-4 w-2/3 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return null // Will redirect to not-found in the useEffect
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col gap-8">
        {/* Store Header */}
        <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-md">
          <img src={store.coverImage || "/placeholder.svg"} alt={store.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end">
            <div className="p-6 flex items-center gap-4">
              <div className="bg-background rounded-full p-1 shadow-lg">
                <img
                  src={store.logo || "/placeholder.svg"}
                  alt={`${store.name} logo`}
                  className="h-20 w-20 rounded-full border-2 border-background"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{store.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{store.rating?.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{store.location.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <FavoriteButton itemId={store.id} itemType="store" />
          <Button variant="outline" className="gap-2 rounded-full">
            <MessageSquare className="h-4 w-4" />
            <span>Contact</span>
          </Button>
          <Button className="gap-2 ml-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Products</span>
          </Button>
        </div>

        {/* Store Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-lg mb-6">
                <TabsTrigger value="about" className="rounded-md">
                  About
                </TabsTrigger>
                <TabsTrigger value="products" className="rounded-md">
                  Products
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-md">
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold mb-2">About {store.name}</h2>
                  <p className="text-muted-foreground">{store.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {store.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="rounded-full">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{store.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{store.contactInfo.email}</span>
                    </div>
                    {store.contactInfo.website && (
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`https://${store.contactInfo.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {store.contactInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">Opening Hours</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday</span>
                      <span className="text-muted-foreground">{store.openingHours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tuesday</span>
                      <span className="text-muted-foreground">{store.openingHours.tuesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Wednesday</span>
                      <span className="text-muted-foreground">{store.openingHours.wednesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thursday</span>
                      <span className="text-muted-foreground">{store.openingHours.thursday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Friday</span>
                      <span className="text-muted-foreground">{store.openingHours.friday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">{store.openingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">{store.openingHours.sunday}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="products" className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold mb-4">Products</h2>
                  {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No products available</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This store doesn't have any products listed yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 staggered-animation">
                      {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id}>
                          <Card className="overflow-hidden h-full card-hover">
                            <div className="relative h-48 w-full">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge className="glass-effect text-foreground">{product.category}</Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-bold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="font-bold">${product.price.toFixed(2)}</span>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="space-y-6 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Reviews</h2>
                    {user && <Button className="rounded-full">Write a Review</Button>}
                  </div>

                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to review this store.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id} className="card-hover">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{review.userName}</h3>
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mt-2">{review.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="card-hover">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Store Location</h3>
                <div className="h-64 rounded-lg overflow-hidden mb-4">
                  <MapWithNoSSR
                    center={[store.location.lat, store.location.lng]}
                    zoom={15}
                    markers={[
                      {
                        position: [store.location.lat, store.location.lng],
                        title: store.name,
                        type: "store",
                      },
                    ]}
                  />
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{store.location.address}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Opening Hours Today</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {
                      store.openingHours[
                        ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
                          new Date().getDay()
                        ] as keyof typeof store.openingHours
                      ]
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Contact Store</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-lg">
                    <Phone className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-lg">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Button>
                  {store.contactInfo.website && (
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-lg" asChild>
                      <a href={`https://${store.contactInfo.website}`} target="_blank" rel="noopener noreferrer">
                        <Info className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
