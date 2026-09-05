/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B9975B", // Premium accent & primary CTA elements
        secondary: "#3B4A35", // Secondary surfaces
        dark: "#2A2A28", // Deep backgrounds
        "dark-lighter": "#3B4A35", // Card & secondary surfaces
        light: "#F4F0E8", // Light surfaces & typography
        "masonic-bg": "#2A2A28",
        "masonic-surface": "#3B4A35",
        "masonic-gold": "#B9975B",
        "masonic-light": "#F4F0E8",
        "gray-text": "#c5c3be", // Crisp readable text
        gold: "#B9975B",
        tertiary: "#3B4A35",
      },
      fontFamily: {
        algerian: ["Algerian", "Cinzel Decorative", "Cinzel", "Georgia", "serif"],
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
