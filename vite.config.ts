import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'gym-tracker' with your actual GitHub repository name
  // e.g. if your repo is https://github.com/user/my-fitness-app, this should be '/my-fitness-app/'
  base: '/gym-tracker/', 
  define: {
    // Safely replace specific process.env keys with stringified values from the build environment (GitHub Secrets)
    'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID),
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY),
  }
});