'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/lib/cartState'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg overflow-hidden"
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </CardHeader>
        
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardTitle className="text-lg font-bold text-gray-800 mb-2">
              {product.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm mb-3">
              {product.description}
            </CardDescription>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-blue-600"
            >
              ${product.price.toFixed(2)}
            </motion.div>
          </motion.div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Button 
              onClick={handleAddToCart}
              className={`w-full font-medium py-2 px-4 rounded-lg transition-all ${
                isAdded 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              size="lg"
            >
              {isAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
