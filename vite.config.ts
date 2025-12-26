import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Check for API Key presence (Useful for debugging build logs in GitHub Actions)
  const apiKey = process.env.API_KEY || env.API_KEY;
  if (mode === 'production' && !apiKey) {
    console.warn("\x1b[33m%s\x1b[0m", "⚠️  WARNING: API_KEY is missing during build! The app will likely fail at runtime.");
  }

  return {
    plugins: [react()],
    base: '/Listening2Go/', // IMPORTANTE: Ruta absoluta del repositorio para evitar errores 404
    define: {
      // Injects the API key from GitHub Secrets (process.env) or .env file into the build
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})