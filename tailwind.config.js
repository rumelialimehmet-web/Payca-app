/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#4F46E5',
        'accent': '#F59E0B',
        'success': '#10B981',
        'primary-light': '#EEF2FF',
        'background-light': '#F9FAFB',
        'background-dark': '#111827',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-light': '#111827',
        'text-dark': '#F9FAFB',
        'text-secondary-light': '#6B7280',
        'text-secondary-dark': '#9CA3AF',
        'border-color': '#E5E7EB',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'brand': ['Poppins', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px'
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-in-out forwards',
        'float-1': 'float 8s ease-in-out infinite',
        'float-2': 'float 12s ease-in-out infinite',
        'float-3': 'float 10s ease-in-out infinite',
        'float-4': 'float 15s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s infinite',
        'subtle-pulse': 'subtlePulse 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        }
      },
      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
