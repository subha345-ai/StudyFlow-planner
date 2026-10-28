/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sf-bg': '#050520',
        'sf-bg-dark': '#0a0428',
        'sf-primary': '#a855f7',
        'sf-primary-dark': '#7c3aed',
        'sf-accent': '#ec4899',
        'sf-success': '#10b981',
        'sf-danger': '#ef4444',
      },
    },
  },
  plugins: [],
}