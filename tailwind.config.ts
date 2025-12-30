/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Modern Indigo
        secondary: "#10b981", 
        background: "#F8FAFC", // Clean Slate background
        surface: "#FFFFFF",
        text: "#0F172A",
        muted: "#64748B",
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
};