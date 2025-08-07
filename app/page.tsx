"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProductCard } from "@/components/product-card"
import { useTelegram } from "@/hooks/use-telegram"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"
import type { Product } from "@/types"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { isReady } = useTelegram()
  const { user } = useAuthStore()
  const { getTotalItems } = useCartStore()

  const totalItems = getTotalItems()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products")
        const data = await response.json()

        if (data.success) {
          setProducts(data.products)
        } else {
          setError("Failed to load products")
        }
      } catch (err) {
        setError("Network error occurred")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    if (isReady) {
      fetchProducts()
    }
  }, [isReady])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Initializing Telegram Mini App...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Mini App Store</h1>
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Welcome, {user.first_name}!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
              <User className="w-4 h-4" />
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => router.push("/cart")} className="relative">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available</p>
        </div>
      )}
    </div>
  )
}
