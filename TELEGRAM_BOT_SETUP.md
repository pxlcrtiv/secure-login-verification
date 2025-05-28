# Telegram Bot Setup Instructions

## Overview
This secure verification system integrates with Telegram to send form submissions directly to a Telegram chat. This allows for real-time monitoring of verification requests.

## Prerequisites
- Telegram account
- BotFather access on Telegram

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the prompts to name your bot (e.g., "SecureVerify Bot")
5. Choose a username ending in "bot" (e.g., "secureverify_bot")
6. BotFather will provide you with a bot token - **save this token securely**

## Step 2: Get Your Chat ID

1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Look for the "chat" object and note the "id" value
4. This is your chat ID

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Step 4: Enable the Integration

In `src/app/api/telegram/route.ts`, uncomment the Telegram API call section:

```typescript
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
```

## Features

### Real-time Notifications
- Instant notifications when users submit verification forms
- Formatted messages with all user details
- Timestamp tracking

### Message Format
```
🔐 New Verification Request

👤 Name: John Doe
📧 Email: john@example.com
📱 Phone: +1234567890
🎂 Date of Birth: 1990-01-01
⏰ Submitted: 5/28/2025, 10:30:00 AM

Status: Pending Verification
```

## Security Considerations

1. **Token Security**: Never commit your bot token to version control
2. **Chat ID Validation**: Ensure only authorized chat IDs receive notifications
3. **Data Protection**: Consider what personal information to send via Telegram
4. **Rate Limiting**: Implement rate limiting to prevent spam

## Testing

1. Fill out the verification form on your website
2. Check your Telegram chat for the notification
3. Verify all form data is correctly formatted and transmitted

## Troubleshooting

### Bot Not Sending Messages
- Check that the bot token is correct
- Ensure the chat ID is valid
- Verify you've sent at least one message to the bot first

### Environment Variables Not Loading
- Make sure `.env.local` is in the project root
- Restart your development server after adding environment variables
- Check that variable names match exactly

### API Errors
- Check the browser console for error messages
- Verify the API endpoint is accessible at `/api/telegram`
- Ensure proper JSON formatting in requests

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform
2. Test the integration thoroughly
3. Monitor for any failed message deliveries
4. Consider implementing retry logic for failed sends

## Additional Features

You can extend the bot functionality by:
- Adding inline keyboards for quick actions
- Implementing OTP delivery via Telegram
- Creating admin commands for verification management
- Adding user feedback mechanisms
