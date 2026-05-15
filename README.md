# Indus AI Dashboard

A powerful, AI-driven dashboard featuring web synthesis, artifact management, and conversational interfaces.

## Run Locally

**Prerequisites:**
- Node.js (v18 or higher recommended)
- npm

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` or `.env.local` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: See `.env.example` for the full list of available environment variables)*

### 3. Run the app
Start the local development server:
```bash
npm run dev
```

Your app will be available at `http://localhost:3000` (or the port specified by Vite in the terminal output).
