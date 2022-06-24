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
        todoColors: {
          brightBlue: "#4fc4ef",
          violet: "#645FC6",
          brightGreen: "#67e4ac",
          yellow: "#FAD201",
          brightRedOrange: "#F75E25",
          purpleViolet: "#4A192C",
        },
      },
      fontFamily: {
        body: ["Roboto"],
      },
    },
  },
  plugins: [],
};
