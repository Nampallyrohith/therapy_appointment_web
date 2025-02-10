/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "orange-primary-1": "#FF9F1C", // Example: blue
        "orange-primary-2": "#FFB941", //
        "orange-primary-3": "#FFBF69", // Example: orange
        "green-primary-1": "#2EC4B6",
        "green-primary-2": "#CBF3F0",
        "green-primary-3": "#1f5d5d",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
