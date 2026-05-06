# Gemini AI Setup Guide

## Required Configuration

The AI assistant now **always** uses Google Gemini as the primary AI engine. For this to work, you need to:

### 1. Create a `.env` file in your project root

Copy `.env.example` and fill in your values:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Gemini API - REQUIRED FOR AI ASSISTANT
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_GEMINI_MODEL=gemini-2.5-flash-lite
```

### 2. Get your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into `.env` as `EXPO_PUBLIC_GEMINI_API_KEY`

### 3. How It Works

- When you send a message in the AI Assistant, it immediately calls Gemini with:
  - Your message
  - Your cycle data (phase, day, symptoms, flow details)
  - Your cycle history
  - Personalized context from your profile

- Gemini responds with a **soft, nurturing** reply tailored to your specific health context
- If Gemini fails (network error, API issue), it falls back to simple preset responses

### 4. Gemini Configuration

The AI is configured with:

- **Tone**: Warm, gentle, empathetic, never clinical
- **Temperature**: 0.6 (consistent, nurturing responses)
- **Max tokens**: 200 (concise, digestible answers)
- **Response style**: Conversational, no lists, 2-4 sentences

### 5. Verification

To verify it's working:

1. Open the AI Assistant screen
2. Type any question (e.g., "How should I eat today?")
3. You should get a response that:
   - Uses your actual cycle data
   - Mentions your current phase or symptoms
   - Feels warm and conversational
   - Never says "Personalized food guidance is not ready"

If you see preset responses instead of Gemini responses, check:

- [ ] `.env` file exists in project root
- [ ] `EXPO_PUBLIC_GEMINI_API_KEY` is set
- [ ] API key is valid (can generate a new one)
- [ ] App is restarted after changing `.env`

### 6. Troubleshooting

**If you still see preset text:**

- Run `npx expo prebuild --clean` to rebuild
- Or use `npm run start` and fully restart the app
- Check browser console for errors (if web)

**If responses are generic:**

- Make sure you've logged at least one period
- Log a few symptoms to give the AI context
- The more data you log, the better the AI personalizes
