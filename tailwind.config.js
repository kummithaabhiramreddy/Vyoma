/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0E1224",
        surface: "#171B36",
        surface2: "#20254A",
        border: "#2A2F58",
        accent: "#FF8A3D",
        accent2: "#4FD1C5",
        dim: "#9CA3C4",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};