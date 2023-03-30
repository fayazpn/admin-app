/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
