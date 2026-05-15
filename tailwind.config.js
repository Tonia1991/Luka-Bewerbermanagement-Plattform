/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark:        '#0F1E3A',
        'dark-card': '#1A3050',
        'dark-nav':  '#3A5070',
        light:       '#F4F6F9',
        'light-card':'#FFFFFF',
        blue:        '#4A8CC8',
        'blue-light':'#5a9cd8',
        gold:        '#B8962A',
        'gold-light':'#caa832',
        'text-d':    '#0F1E3A',
        'text-sub':  '#3A5070',
        'text-muted':'#6A8090',
        border:      '#DDE4EE',
        'note-1': '#16a34a',
        'note-2': '#22c55e',
        'note-3': '#eab308',
        'note-4': '#f97316',
        'note-5': '#ef4444',
        'note-6': '#991b1b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(15,30,58,0.06)',
        'card-hover': '0 4px 16px rgba(15,30,58,0.1)',
      },
    },
  },
  plugins: [],
};
