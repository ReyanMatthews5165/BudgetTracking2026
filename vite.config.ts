import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sprint 3 Performance Optimizations by Josh Wilson
export default defineConfig({
  plugins: [react()],
  build: {
    // Minification and chunking for faster load times (NFR: Load time < 2s)
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
    sourcemap: false, // Reduces build size for production
  },
  server: {
    port: 3000,
    open: true,
  }
});
