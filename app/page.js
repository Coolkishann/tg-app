'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { useCartStore } from '@/lib/cartState'
import { useTelegram } from '@/components/TelegramProvider'

// Hardcoded product data
const product = {
  id: 1,
  title: "Premium Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
  price: 199.99,
  image: "/placeholder.svg?height=300&width=300&text=Headphones"
}

export default function HomePage() {
  const { items, totalItems, totalPrice } = useCartStore()
  const { user, isLoading } = useTelegram()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome{user?.first_name ? `, ${user.first_name}` : ''}! 👋
        </h1>
        {user?.username && (
          <p className="text-gray-600">@{user.username}</p>
        )}
      </motion.div>

      {/* Product Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Featured Product</h2>
        <ProductCard product={product} />
      </motion.div>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-4 shadow-md border"
        >
          <h3 className="font-semibold text-gray-800 mb-2">Cart Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items in cart:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
              >
                <span>{item.title}</span>
                <span className="font-medium">x{item.quantity}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
