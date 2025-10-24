# OpenAI Integration Setup Guide

## Step 1: Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Step 2: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

## Step 3: Test the Integration

1. Run `npm run dev`
2. Navigate to a user page (e.g., `/u/testuser`)
3. Check that AI suggestions are generated automatically

## How It Works

### API Route (`/api/chat`)

- Uses `@ai-sdk/openai` for OpenAI integration
- Implements `streamText` for streaming responses
- Handles errors gracefully
- 30-second timeout for responses

### Frontend Integration

- Uses native `fetch` API to call the streaming endpoint
- Handles streaming responses properly
- Shows loading states during AI generation
- Processes AI responses to extract suggestions

## Troubleshooting

### Common Issues:

1. **"Cannot find module" errors**: Make sure all packages are installed with `npm install`

2. **API key not working**:
   - Verify your API key is correct
   - Check that `.env.local` is in the project root
   - Restart your development server after adding the key

3. **Streaming not working**:
   - Check browser console for errors
   - Verify the API route is working by testing it directly

### Testing the API Route

You can test the API route directly with curl:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello, how are you?"}]}'
```

## Next Steps

Once the basic integration is working, you can:

1. Add more sophisticated prompt engineering
2. Implement user-specific suggestions
3. Add caching for better performance
4. Implement error handling and retry logic
