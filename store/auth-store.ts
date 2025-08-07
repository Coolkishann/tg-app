import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { TelegramUser, AuthState } from "@/types"

interface AuthStore extends AuthState {
  user: TelegramUser | null
  token: string | null
  login: (initData: string) => Promise<boolean>
  logout: () => void
  setUser: (user: TelegramUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (initData: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch("/api/auth/telegram", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ initData }),
          })

          const result = await response.json()

          if (result.success && result.user) {
            set({
              user: result.user,
              token: result.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return true
          } else {
            set({
              error: result.error || "Authentication failed",
              isLoading: false,
            })
            return false
          }
        } catch (error) {
          set({
            error: "Network error during authentication",
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setUser: (user: TelegramUser | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "telegram-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
