/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Will need to add colors for the bright theme as well
      colors: {
        fontPrimary: "#fff",
        fontSecondary: "#82899b",
        fontTertiary: "#645FC6",
        darkBlue: "#21212D",
        darkGray: "#2c2c38",
        veryDarkGray: "#22252e",
        // Default
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
