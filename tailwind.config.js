/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bảng màu Dark chuyên dụng cho Automation Tool
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Blue primary
          600: '#2563eb',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#050505',
          panel: '#0a0a0a',
          card: '#0d0d0d',
          border: '#1a1a1a'
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}