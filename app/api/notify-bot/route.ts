import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, user, total } = await request.json()

    // Here you would send a notification to your Telegram bot
    // Example: POST to your bot's webhook or use Telegram Bot API

    console.log("Notifying bot about order:", {
      orderId,
      userId: user?.id,
      userName: user?.first_name,
      total,
    })

    // Simulate bot notification
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: "Bot notified successfully",
    })
  } catch (error) {
    console.error("Bot notification error:", error)
    return NextResponse.json({ success: false, error: "Failed to notify bot" }, { status: 500 })
  }
}
