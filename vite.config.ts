import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages expects the repo name as the base path
  base: '/GymTrack-AI/',
  define: {
    // Safely replace specific process.env keys with stringified values from the build environment (GitHub Secrets)
    'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  }
});