// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // 🟢 Mở LAN: Cho phép điện thoại truy cập qua IP máy tính
    proxy: {
      '/api': {
        target: 'http://localhost:3275',
        changeOrigin: true,
        secure: false,
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