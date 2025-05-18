"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Star,
  StoreIcon,
  Share2,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import {
  type Product,
  type Review,
  type Store,
  getProductById,
  getProducts,
  getReviews,
  getStoreById,
} from "@/lib/storage-utils"
import dynamic from "next/dynamic"
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

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    // Initialize storage with mock data
    const initStorage = async () => {
      const { initializeStorage } = await import("@/lib/storage-utils")
      initializeStorage()

      if (typeof id === "string") {
        // Get product details
        const productData = getProductById(id)
        if (productData) {
          setProduct(productData)

          // Get store details
          const storeData = getStoreById(productData.storeId)
          if (storeData) {
            setStore(storeData)
          }

          // Get related products (same category)
          const allProducts = getProducts()
          const related = allProducts
            .filter((p) => p.id !== id && p.category === productData.category && p.storeId === productData.storeId)
            .slice(0, 4)
          setRelatedProducts(related)

          // Get reviews (mock for now)
          const allReviews = getReviews()
          setReviews(allReviews)
        } else {
          // Product not found, redirect to 404
          router.push("/not-found")
        }
      }

      setLoading(false)
    }

    initStorage()
  }, [id, router])

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product?.name} added to your cart`,
    })
  }

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: `${product?.name} added to your wishlist`,
    })
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded-lg"></div>
              <div className="h-6 w-1/4 bg-muted rounded-lg"></div>
              <div className="h-4 w-full bg-muted rounded-lg"></div>
              <div className="h-4 w-5/6 bg-muted rounded-lg"></div>
              <div className="h-10 w-full bg-muted rounded-lg mt-8"></div>
              <div className="flex gap-4 mt-4">
                <div className="h-10 w-1/2 bg-muted rounded-lg"></div>
                <div className="h-10 w-1/2 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product || !store) {
    return null // Will redirect to not-found in the useEffect
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/marketplace" className="hover:text-primary transition-colors">
            Marketplace
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/stores/${store.id}`} className="hover:text-primary transition-colors">
            {store.name}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden shadow-md bg-background">
            <div className="relative aspect-square">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <Badge
                className="absolute top-4 left-4 glass-effect text-foreground"
                variant={product.inStock ? "default" : "destructive"}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{product.rating?.toFixed(1) || "New"}</span>
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <Link
                  href={`/stores/${store.id}`}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <StoreIcon className="h-3.5 w-3.5" />
                  <span>{store.name}</span>
                </Link>
              </div>
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="pt-4 border-t">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.inStock && (
                  <span className="text-sm text-muted-foreground">
                    Available for {store.categories.includes("Groceries") ? "pickup" : "delivery"}
                  </span>
                )}
              </div>
            </div>

            {product.inStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-full overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <FavoriteButton itemId={product.id} itemType="product" />
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {!product.inStock && (
              <Button variant="outline" className="w-full rounded-full" disabled>
                Out of Stock
              </Button>
            )}

            {/* Store Quick Info */}
            <Card className="mt-6 card-hover">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={store.logo || "/placeholder.svg"}
                    alt={`${store.name} logo`}
                    className="h-12 w-12 rounded-full border"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{store.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{store.location.address}</span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href={`/stores/${store.id}`}>View Store</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-lg mb-6">
              <TabsTrigger value="details" className="rounded-md">
                Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-md">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-md">
                Shipping
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Product Details</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-muted-foreground">Category</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-muted-foreground">Availability</span>
                          <span>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-muted-foreground">Store</span>
                          <Link href={`/stores/${store.id}`} className="text-primary hover:underline">
                            {store.name}
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2 py-2 border-b">
                          <span className="text-muted-foreground">Added</span>
                          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Product Location</h3>
                      <div className="h-64 rounded-lg overflow-hidden">
                        <MapWithNoSSR
                          center={[
                            product.location?.lat || store.location.lat,
                            product.location?.lng || store.location.lng,
                          ]}
                          zoom={15}
                          markers={[
                            {
                              position: [
                                product.location?.lat || store.location.lat,
                                product.location?.lng || store.location.lng,
                              ],
                              title: store.name,
                              type: "store",
                            },
                          ]}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{store.location.address}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Customer Reviews</h3>
                    {user && (
                      <Button className="rounded-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Write a Review
                      </Button>
                    )}
                  </div>

                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No reviews yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to review this product.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b last:border-0">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{review.userName}</h4>
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
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping" className="animate-fade-in">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Shipping & Delivery</h3>
                  <div className="space-y-4">
                    <div className="pb-4 border-b">
                      <h4 className="font-medium mb-2">Delivery Options</h4>
                      <p className="text-sm text-muted-foreground">
                        This product is available for {store.categories.includes("Groceries") ? "pickup" : "delivery"}{" "}
                        from {store.name}. Please check the store's opening hours for pickup availability.
                      </p>
                    </div>
                    <div className="pb-4 border-b">
                      <h4 className="font-medium mb-2">Store Hours</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday</span>
                          <span>{store.openingHours.monday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tuesday</span>
                          <span>{store.openingHours.tuesday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wednesday</span>
                          <span>{store.openingHours.wednesday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thursday</span>
                          <span>{store.openingHours.thursday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Friday</span>
                          <span>{store.openingHours.friday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span>{store.openingHours.saturday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span>{store.openingHours.sunday}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{store.location.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Today:{" "}
                            {
                              store.openingHours[
                                ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][
                                  new Date().getDay()
                                ] as keyof typeof store.openingHours
                              ]
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Button asChild variant="ghost" className="hidden md:flex">
                <Link href={`/stores/${store.id}`}>
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 staggered-animation">
              {relatedProducts.map((relatedProduct) => (
                <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id}>
                  <Card className="overflow-hidden h-full card-hover">
                    <div className="relative h-48 w-full">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="glass-effect text-foreground">{relatedProduct.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-1">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                        {relatedProduct.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{relatedProduct.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex justify-center md:hidden">
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/stores/${store.id}`}>View All Products</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
