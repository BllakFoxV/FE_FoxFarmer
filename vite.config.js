// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Hễ thấy request nào bắt đầu bằng /api thì tống nó sang 3275
      '/api': {
        target: 'http://localhost:3275',
        changeOrigin: true,
        secure: false, // Nếu BE không có HTTPS thì bật cái này
      }
    }
  },
  resolve: {
    alias: {
      // 🟢 Alias: Giúp import ngắn gọn bằng dấu @
      '@': path.resolve(__dirname, './src'),
    },
  },
});