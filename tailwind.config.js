/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "orange-primary-1": "#FF9F1C",
        "orange-primary-2": "#FFB941",
        "orange-primary-3": "#FFBF69",
        "green-primary-1": "#2EC4B6",
        "green-primary-2": "#CBF3F0",
        "green-primary-3": "#1f5d5d",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
