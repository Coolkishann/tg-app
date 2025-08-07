"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore()

  const cartItem = items.find((item) => item.product.id === product.id)
  const quantityInCart = cartItem?.quantity || 0

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-square relative mb-3 overflow-hidden rounded-md">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
          <CardDescription className="text-sm">{product.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button onClick={handleAddToCart} className="w-full" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
          {quantityInCart > 0 && (
            <Badge variant="secondary" className="ml-2">
              {quantityInCart}
            </Badge>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
