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












// "use client";

// import { useEffect, useState } from "react";

// interface UserData {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code: string;
//   is_premium?: boolean;
// }

// export default function HomePage() {
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Access Telegram WebApp object if available
//     if (typeof window !== "undefined") {
//       // @ts-ignore
//       const tg = window.Telegram?.WebApp;
//       if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
//         const u = tg.initDataUnsafe.user;
//         setUserData({
//           id: u.id,
//           first_name: u.first_name,
//           last_name: u.last_name,
//           username: u.username,
//           language_code: u.language_code,
//           is_premium: u.is_premium,
//         });
//       } else {
//         setError("No Telegram user data found. Please open this app via Telegram.");
//       }
//     }
//   }, []);

//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen p-4">
//       {userData ? (
//         <>
//           <h1 className="text-2xl font-bold mb-4">Your Telegram Data</h1>
//           <ul className="bg-white rounded shadow p-6">
//             <li>
//               <strong>User ID:</strong> {userData.id}
//             </li>
//             <li>
//               <strong>First Name:</strong> {userData.first_name}
//             </li>
//             <li>
//               <strong>Last Name:</strong> {userData.last_name ?? "(none)"}
//             </li>
//             <li>
//               <strong>Username:</strong> @{userData.username ?? "(none)"}
//             </li>
//             <li>
//               <strong>Language Code:</strong> {userData.language_code}
//             </li>
//             <li>
//               <strong>Premium:</strong> {userData.is_premium ? "Yes" : "No"}
//             </li>
//           </ul>
//         </>
//       ) : (
//         <p className="text-gray-500">Loading Telegram user data...</p>
//       )}
//     </main>
//   );
// }
