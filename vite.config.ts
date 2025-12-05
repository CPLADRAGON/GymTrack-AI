import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process for this file context since we might not have @types/node loaded
declare const process: { env: Record<string, string | undefined> };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages expects the repo name as the base path
  base: '/GymTrack-AI/', 
  define: {
    // Safely replace specific process.env keys with stringified values
    // Using || '' ensures JSON.stringify doesn't receive undefined, which avoids build syntax errors
    'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || ''),
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY || ''),
  }
});