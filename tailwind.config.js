/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enabling dark mode toggling
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    extend: {
      colors: {
        // Light Theme
        // ** Change the actual colors here
        // Lesson: Generalize color names so they could be repurposed for either theme
        fontPrimary: "#09081b", //
        fontSecondary: "#82899b",
        fontTertiary: "#645FC6",
        backgroundColorMain: "#F4F7FE", // (prev darkBlue)
        backgroundColorMenu: "#fff", // (prev darkGray)
        backgroundColor2: "#E9F0FA", // (prev veryDarkGray)
        // Dark Theme
        fontPrimaryDark: "#fff",
        fontSecondary: "#82899b",
        darkBlue: "#21212D",
        darkBlue1: "#eff2fa",
        darkGray: "#2c2c38",
        veryDarkGray: "#22252e",
        todoColors: {
          brightBlue: "#4fc4ef",
          violet: "#645fc6",
          brightGreen: "#67e4ac",
          yellow: "#fad201",
          brightRedOrange: "#f75e25",
          purpleViolet: "#4a192c",
          pink: "#a8328f",
          greenBlue: "#32a8a2",
          greenYellow: "#89a832",
          brightOrange: "#a88b32",
        },
      },
      fontFamily: {
        body: ["Roboto"],
      },
    },
  },
  plugins: [],
};
