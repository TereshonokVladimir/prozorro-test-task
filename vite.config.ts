import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/prozorro-api': {
        target: 'https://public.api.prozorro.gov.ua',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prozorro-api/, ''),
        secure: false,
      },
    },
  },
})
