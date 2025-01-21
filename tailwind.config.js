/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lora)', 'serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        primary: '#e3b261',
        secondary: '#1a2421',
        accent: '#3a4441',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 