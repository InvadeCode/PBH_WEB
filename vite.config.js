import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        hoistTransitiveImports: false,
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('@sanity') || id.includes('@portabletext') || id.includes('stega')) return 'vendor-sanity';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('html2canvas') || id.includes('dompurify') || id.includes('purify')) return 'vendor-utils';
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
