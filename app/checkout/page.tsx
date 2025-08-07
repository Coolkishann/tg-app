"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, CreditCard, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "@/store/cart-store"
import { useAuthStore } from "@/store/auth-store"

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()

  const totalPrice = getTotalPrice()

  const handleCheckout = async () => {
    if (!user) {
      setError("User information not available")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const orderData = {
        user,
        items,
        total: totalPrice,
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear cart and redirect to success page
        clearCart()
        router.push(`/success?orderId=${result.orderId}`)
      } else {
        setError(result.error || "Failed to process order")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Checkout error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* User Information */}
      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">
                {user.first_name} {user.last_name}
              </p>
              {user.username && <p className="text-sm text-muted-foreground">@{user.username}</p>}
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={item.product.imageUrl || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.product.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Card>
        <CardContent className="p-6">
          <Button onClick={handleCheckout} disabled={isProcessing} className="w-full" size="lg">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Order - ${totalPrice.toFixed(2)}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            By completing this order, you agree to our terms and conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
