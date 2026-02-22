import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#fafafa',
          elevated: '#ffffff',
          overlay: '#f5f5f5',
        },
        border: {
          DEFAULT: '#e5e7eb',
          muted: '#f0f0f0',
        },
        muted: {
          DEFAULT: '#6b7280',
          foreground: '#52525b',
        },
        accent: {
          DEFAULT: '#4f6b9c',
          hover: '#3d5a80',
          muted: 'rgb(79 107 156 / 0.12)',
        },
        destructive: '#dc2626',
        foreground: '#18181b',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['1.5rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'section-title': ['0.9375rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      boxShadow: {
        'app-sm': '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'app-md': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'app-card': '0 1px 3px 0 rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        app: '0.375rem',
        'app-lg': '0.5rem',
      },
      spacing: {
        'page-x': '1.5rem',
        'page-y': '1.5rem',
        'section': '1.5rem',
        'content': '2rem',
      },
      transitionDuration: {
        'app': '150ms',
      },
    },
  },
  plugins: [],
} satisfies Config
