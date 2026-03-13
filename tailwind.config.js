/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#721111", // main brown
          light: "#8f2a2a", // lighter brown
          dark: "#4d0b0b", // deep brown
        },

        secondary: {
          DEFAULT: "#a0522d", // warm brown accent
          light: "#c17a4a",
          dark: "#7a3b1a",
        },

        background: {
          DEFAULT: "#fffaf5", // off-white beige
          muted: "#fde7b836", // your muted color
          dark: "#f3e3d3",
          shade: "#fff3d6",
        },
        text: {
          primary: "#3b1d1d", // dark brown text
          secondary: "#6b4b4b", // muted brown text
          accent: "#721111", // same as primary
          light: "#ffffff",
          dark: "#2a0f0f",
        },
        border: {
          DEFAULT: "#e6cfcf", // soft brown border
          strong: "#721111",
        },
        shade: {
          DEFAULT: "#efa20e",
          light: "#efa20e99",
        },
      },
    },
  },
  plugins: [],
};
 