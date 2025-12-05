import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // SECURITY FIX: Only inject the Gemini API Key into process.env when running in 'development' mode.
      // In 'production' builds, this value will be an empty string, preventing the key from being
      // hardcoded into the client-side bundle.
      'process.env.API_KEY': mode === 'development' ? JSON.stringify(env.GEMINI_API_KEY) : JSON.stringify(''),
    },
  };
});