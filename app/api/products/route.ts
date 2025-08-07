import { NextResponse } from "next/server"
import type { Product } from "@/types"

// Mock products data - replace with your actual API
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    description: "High-quality arabica coffee beans from Colombia",
    price: 24.99,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "beverages",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones with premium sound",
    price: 199.99,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "electronics",
  },
  {
    id: "3",
    name: "Organic Green Tea",
    description: "Premium organic green tea leaves from Japan",
    price: 18.5,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "beverages",
  },
  {
    id: "4",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    price: 299.99,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "electronics",
  },
  {
    id: "5",
    name: "Artisan Chocolate",
    description: "Handcrafted dark chocolate with sea salt",
    price: 12.99,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "food",
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip premium yoga mat for all exercises",
    price: 45.0,
    imageUrl: "/placeholder.svg?height=200&width=200",
    category: "fitness",
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      products: mockProducts,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
