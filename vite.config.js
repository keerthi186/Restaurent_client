import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
