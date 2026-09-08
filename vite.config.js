import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT) || 5173,
    strictPort: Boolean(process.env.PORT),
    proxy: {
      '/api/scan': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/recalculate': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/log-chain': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
