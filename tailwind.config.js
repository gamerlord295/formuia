/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {},
  plugins: [nextui({
    addCommonColors: false,
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          voilet: {
            600: "#7c3aed",
          },
          secondary: {
            DEFAULT: "#7c3aed",
            foreground: "#FFFFFF",
            
          },
          red: {
            DEFAULT: "#A30000",
            foreground: "#FFF",
            background: "#A30000",
          }
        },
      },
    },
  })],
}

