import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Mọi request bắt đầu bằng /api sẽ được đẩy sang Backend port 3275
      '/api': {
        target: 'http://localhost:3275',
        changeOrigin: true,
        secure: false,
      },
      // Cấu hình cho WebSocket (nếu mày dùng để stream ảnh 10 FPS)
      '/ws': {
        target: 'ws://localhost:3275',
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});