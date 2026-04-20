import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sprint 3 Performance Optimizations
// Goals: Minimize bundle size and meet < 2s load time NFR
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Manual chunking to split large libraries into smaller files
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  }
});
