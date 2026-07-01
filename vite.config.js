import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/prescription-validator/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('tesseract')) return 'tesseract';
            if (id.includes('recharts') || id.includes('d3')) return 'charts';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        }
      }
    }
  }
});
