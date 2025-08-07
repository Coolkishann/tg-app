'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, User, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cartState'
import { useTelegram } from './TelegramProvider'

export default function Navbar() {
  const { totalItems } = useCartStore()
  const { user } = useTelegram()

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-sm border-b sticky top-0 z-50"
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
              <Home size={20} />
              <span className="font-medium">Home</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} className="text-gray-600 hover:text-gray-800" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
            
            <Link href="/profile" className="text-gray-600 hover:text-gray-800">
              <User size={20} />
            </Link>
            
            {user && (
              <span className="text-sm text-gray-600 hidden sm:block">
                @{user.username || user.first_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
