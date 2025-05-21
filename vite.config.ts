import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '127.0.0.1', // or use true to expose to LAN
    port: 5173,
    strictPort: true, // fail if the port is in use
    open: true,       // open browser automatically
  },
});
