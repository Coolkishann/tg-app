import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import type { TelegramUser } from "@/types"

// Replace with your actual bot token from BotFather
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "your_bot_token_here"

function verifyTelegramWebAppData(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get("hash")
    urlParams.delete("hash")

    // Create data check string
    const dataCheckArr: string[] = []
    for (const [key, value] of urlParams.entries()) {
      dataCheckArr.push(`${key}=${value}`)
    }
    dataCheckArr.sort()
    const dataCheckString = dataCheckArr.join("\n")

    // Create secret key
    const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest()

    // Create hash
    const calculatedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

    // Verify hash
    if (calculatedHash !== hash) {
      return null
    }

    // Parse user data
    const userParam = urlParams.get("user")
    if (!userParam) {
      return null
    }

    const user: TelegramUser = JSON.parse(userParam)
    return user
  } catch (error) {
    console.error("Telegram auth verification error:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json()

    if (!initData) {
      return NextResponse.json({ success: false, error: "Missing initData" }, { status: 400 })
    }

    // For development/testing, you can skip verification
    if (process.env.NODE_ENV === "development" && !BOT_TOKEN.startsWith("your_bot_token")) {
      // Parse user data directly for development
      try {
        const urlParams = new URLSearchParams(initData)
        const userParam = urlParams.get("user")
        if (userParam) {
          const user: TelegramUser = JSON.parse(userParam)

          // Generate a simple token for development
          const token = crypto.randomBytes(32).toString("hex")

          return NextResponse.json({
            success: true,
            user,
            token,
          })
        }
      } catch (e) {
        // Fallback for development
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          language_code: "en",
        }

        const token = crypto.randomBytes(32).toString("hex")

        return NextResponse.json({
          success: true,
          user: mockUser,
          token,
        })
      }
    }

    // Production verification
    const user = verifyTelegramWebAppData(initData)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid Telegram data" }, { status: 401 })
    }

    // Generate JWT token or session token
    const token = crypto.randomBytes(32).toString("hex")

    // Here you would typically:
    // 1. Save user to database
    // 2. Create session
    // 3. Generate proper JWT token

    return NextResponse.json({
      success: true,
      user,
      token,
    })
  } catch (error) {
    console.error("Telegram auth error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
