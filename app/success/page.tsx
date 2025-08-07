"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Home, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import { useTelegram } from "@/hooks/use-telegram"

export default function SuccessPage() {
  const [isNotifying, setIsNotifying] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const { user } = useAuthStore()
  const { closeMiniApp } = useTelegram()

  useEffect(() => {
    // Notify bot about successful order
    const notifyBot = async () => {
      if (!orderId || !user || notificationSent) return

      setIsNotifying(true)
      try {
        await fetch("/api/notify-bot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            user,
            total: 0, // You might want to pass the actual total here
          }),
        })
        setNotificationSent(true)
      } catch (error) {
        console.error("Failed to notify bot:", error)
      } finally {
        setIsNotifying(false)
      }
    }

    notifyBot()
  }, [orderId, user, notificationSent])

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-green-600">Order Successful!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been confirmed.</p>
        </div>

        {/* Order Details */}
        {orderId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID:</span>
                <span className="font-mono text-sm">{orderId}</span>
              </div>

              {user && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Customer:</span>
                  <span className="text-sm">
                    {user.first_name} {user.last_name}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="text-sm font-medium text-green-600">Confirmed</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bot Notification Status */}
        {isNotifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending confirmation...</span>
          </div>
        )}

        {notificationSent && <div className="text-sm text-green-600">✓ Confirmation sent to Telegram bot</div>}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={() => router.push("/")} className="w-full" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>

          <Button onClick={closeMiniApp} variant="outline" className="w-full bg-transparent" size="lg">
            Close Mini App
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>You will receive a confirmation message in Telegram.</p>
          <p>If you have any questions, please contact our support.</p>
        </div>
      </div>
    </div>
  )
}
