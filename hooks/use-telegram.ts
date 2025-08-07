"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth-store"

export function useTelegram() {
  const [isReady, setIsReady] = useState(false)
  const { login, setUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const initTelegram = async () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp

        // Initialize Telegram WebApp
        tg.ready()
        tg.expand()

        // Apply theme
        if (tg.colorScheme === "dark") {
          document.documentElement.classList.add("dark")
        }

        // Authenticate user if not already authenticated
        if (!isAuthenticated && tg.initData) {
          const success = await login(tg.initData)
          if (!success) {
            console.warn("Telegram authentication failed")
          }
        } else if (tg.initDataUnsafe?.user) {
          // Fallback: set user directly if no initData
          setUser(tg.initDataUnsafe.user)
        }

        setIsReady(true)
      } else {
        // For development/testing without Telegram
        console.warn("Telegram WebApp not available")

        // Auto-authenticate with mock data in development
        if (process.env.NODE_ENV === "development" && !isAuthenticated) {
          await login(
            "user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22testuser%22%7D",
          )
        }

        setIsReady(true)
      }
    }

    initTelegram()
  }, [login, setUser, isAuthenticated])

  const showMainButton = (text: string, onClick: () => void) => {
    if (window.Telegram?.WebApp?.MainButton) {
      const mainButton = window.Telegram.WebApp.MainButton
      mainButton.setText(text)
      mainButton.onClick(onClick)
      mainButton.show()
    }
  }

  const hideMainButton = () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide()
    }
  }

  const closeMiniApp = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close()
    }
  }

  return {
    isReady,
    showMainButton,
    hideMainButton,
    closeMiniApp,
    webApp: typeof window !== "undefined" ? window.Telegram?.WebApp : null,
  }
}
