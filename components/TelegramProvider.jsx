'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const TelegramContext = createContext({})

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}

export default function TelegramProvider({ children }) {
  const [webApp, setWebApp] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in Telegram WebApp environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setWebApp(tg)
      
      // Get user data from initDataUnsafe
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)
      } else {
        // Fallback for development/testing
        setUser({
          id: 123456789,
          first_name: 'John',
          last_name: 'Doe',
          username: 'johndoe',
          language_code: 'en'
        })
      }
      
      // Configure WebApp
      tg.ready()
      tg.expand()
      
      setIsLoading(false)
    } else {
      // Fallback for development
      setUser({
        id: 123456789,
        first_name: 'John',
        last_name: 'Doe',
        username: 'johndoe',
        language_code: 'en'
      })
      setIsLoading(false)
    }
  }, [])

  const value = {
    webApp,
    user,
    isLoading
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}
