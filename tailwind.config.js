/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F6B',
        accent: '#D4E84A',
        'bg-light': '#f5f8d4',
        'text-dark': '#1a1a2e',
        'text-muted': '#6b7280',
        'note-1': '#16a34a',
        'note-2': '#22c55e',
        'note-3': '#eab308',
        'note-4': '#f97316',
        'note-5': '#ef4444',
        'note-6': '#991b1b',
        'status-neu': '#3b82f6',
        'status-screening': '#8b5cf6',
        'status-offen': '#f59e0b',
        'status-eingeladen': '#22c55e',
        'status-abgesagt': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
