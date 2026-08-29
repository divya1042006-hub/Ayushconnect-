/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0f5238",
        "primary-container": "#2d6a4f",
        "on-primary": "#ffffff",
        "on-primary-container": "#a8e7c5",
        "leaf-green-accent": "#52B788",
        "leaf-green-light": "#D8F3DC",
        "corporate-blue-pale": "#E0FBFC",
        "tertiary": "#004b75",
        "tertiary-container": "#00649a",
        "on-tertiary-container": "#bcddff",
        "secondary": "#3f6653",
        "secondary-container": "#beead1",
        "match-success": "#2D6A4F",
        "match-warning": "#FFB703",
        "match-error": "#E63946",
        "surface-white": "#FFFFFF",
        "surface": "#f8f9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-variant": "#e1e3e4",
        "text-main": "#1A1C1E",
        "outline": "#707973",
        "outline-variant": "#bfc9c1"
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        sans: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        "wellness": "0px 4px 20px rgba(45, 106, 79, 0.08)",
        "wellness-hover": "0px 8px 30px rgba(45, 106, 79, 0.15)"
      }
    },
  },
  plugins: [],
}
