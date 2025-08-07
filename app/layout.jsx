import { Inter } from 'next/font/google'
import './globals.css'
import TelegramProvider from '@/components/TelegramProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Telegram Mini App',
  description: 'A modern Telegram Mini App built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <TelegramProvider>
          <Navbar />
          <main className="max-w-md mx-auto">
            {children}
          </main>
        </TelegramProvider>
      </body>
    </html>
  )
}
