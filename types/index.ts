export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  user: TelegramUser
  items: CartItem[]
  total: number
  orderId?: string
}

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface UserProfile extends TelegramUser {
  joinDate?: string
  orderCount?: number
  totalSpent?: number
  favoriteCategory?: string
}

export interface AuthResponse {
  success: boolean
  user?: TelegramUser
  token?: string
  error?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        close: () => void
        expand: () => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }
        initData: string
        initDataUnsafe: {
          user?: TelegramUser
          chat_instance?: string
          chat_type?: string
          start_param?: string
        }
        colorScheme: "light" | "dark"
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
        }
      }
    }
  }
}
