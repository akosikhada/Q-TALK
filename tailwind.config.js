/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1A8D60",
        primaryDark: "#25BE80",
        secondary: "#E8FFF4",
        secondaryDark: "#1E3D31",
        accent: "#FF6B6B",
        background: {
          light: "#FFFFFF",
          dark: "#121212",
        },
        bubble: {
          sent: "#1A8D60",
          received: "#F5F7FA",
          sentDark: "#25BE80",
          receivedDark: "#2A2A2A",
        },
        text: {
          primary: "#212121",
          secondary: "#616161",
          light: "#FFFFFF",
          muted: "#9E9E9E",
          dark: {
            primary: "#FFFFFF",
            secondary: "#CCCCCC",
            muted: "#A0A0A0",
          },
        },
        gray: {
          100: "#F5F7FA",
          200: "#EBEEF2",
          300: "#D8DEE6",
          400: "#BDC6D1",
          500: "#9AA5B4",
          600: "#7A8699",
          700: "#5D6B7E",
          800: "#2D3748",
          900: "#1A202C",
        },
        red: {
          500: "#E53935",
          dark: "#FF5252",
        },
        blue: {
          500: "#2196F3",
          dark: "#64B5F6",
        },
        green: {
          500: "#4CAF50",
          dark: "#81C784",
        },
        yellow: {
          500: "#FFC107",
          dark: "#FFD54F",
        },
      },
    },
  },
  plugins: [],
};
