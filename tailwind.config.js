/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        alpina: ["IBM Plex Serif", "Georgia", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        cream: "#fff7e8",
        "cream-dark": "#f4eddf",
        "cream-card": "#ede6d8",
        "cream-receipt": "#ebddd3",
        olive: "#3e423c",
        "green-confirm": "#d4deca",
        "green-brand": "#1ab942",
      },
      animation: {
        spinner: "spinner 0.6s linear infinite",
      },
      keyframes: {
        spinner: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
