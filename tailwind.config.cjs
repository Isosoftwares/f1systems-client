/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E63946", // Red requested
        secondary: "#FFD700", // Golden requested
        dark: "#0e111d", // Deep Navy Background
        "dark-lighter": "#1b2034", // Card Backgrounds
        light: "#ffffff",
        "gray-text": "#94a3b8", // Muted text for dark mode
        // Legacy mappings
        gold: "#FFD700",
        tertiary: "#1b2034", // Mapping old green to new dark-lighter for now
      },
      backgroundImage: {
        hero: "url('/src/assets/graphics/solid4.jpg')",
        bg1: "url('/src/assets/graphics/bg1.jpg')",
        bg2: "url('/src/assets/graphics/bg2.avif')",
        bg3: "url('/src/assets/graphics/bgpatt.png')",
        bg4: "url('/src/assets/graphics/bg3.jpg')",
        onlineclass: "url('/src/assets/graphics/online.jpg')",
        exam: "url('/src/assets/graphics/exam.jpg')",
        gedtest: "url('/src/assets/graphics/test2.avif')",
        chatBg: "url('/src/assets/graphics/w2.jpg')",
      },

      borderWidth: {
        3: "3px",
      },

      zIndex: {
        60: "60",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
});
