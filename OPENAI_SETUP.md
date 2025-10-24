# OpenAI Integration Setup

## Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

## How It Works

The application now uses the AI SDK's `useChat` hook to:

1. **Generate AI suggestions** when the page loads
2. **Stream responses** from OpenAI in real-time
3. **Handle loading states** properly
4. **Parse AI responses** to extract suggested messages

## API Route

The `/api/chat` route uses:

- `@ai-sdk/openai` for OpenAI integration
- `streamText` for streaming responses
- Error handling for API issues
- 30-second timeout for responses

## Frontend Integration

The user page now:

- Uses `useChat` hook instead of `axios`
- Handles streaming responses properly
- Shows loading states during AI generation
- Processes AI responses to extract suggestions

## Testing

1. Set up your environment variables
2. Run `npm run dev`
3. Navigate to a user page (e.g., `/u/testuser`)
4. Check that AI suggestions are generated automatically
