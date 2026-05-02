/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#e6b84a',
          500: '#c9962a',
          600: '#a37820',
          700: '#7c5a16',
          800: '#55400f',
          900: '#1a1200',
        },
        champagne: '#f5e6c8',
        onyx: '#0d0d0d',
        pearl: '#f8f4ef',
        charcoal: '#1c1c1e',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e6b84a 0%, #c9962a 50%, #a37820 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1c1c1e 0%, #0d0d0d 100%)',
        'hero-gradient': 'linear-gradient(to right, #0d0d0d 0%, #1c1c1e 40%, transparent 100%)',
      },
      boxShadow: {
        'gold':  '0 4px 24px rgba(201, 150, 42, 0.35)',
        'gold-lg': '0 8px 48px rgba(201, 150, 42, 0.45)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.18)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
