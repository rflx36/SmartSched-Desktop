import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      "manrope-regular": ["manrope-regular"],
      "manrope-medium": ["manrope-medium"],
      "manrope-semibold": ["manrope-semibold"],
      "manrope-bold": ["manrope-bold"]
    },



    extend: {

      colors: {
        "grey": {
          50: "#FAFAFA",
          100: "#F5F5F5",
          150: "#EDEDED",
          200: "#E8E8E8",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#5A5A5A",
          750: "#363636",
          900: "#1E1E1E",
          950: "#151515"
        },
        "baseline": {
          "base": "#F5F5F5",
          "outline": "#D4D4D4",
          "border-base": "#EDEDED",
          "border-outline": "#FAFAFA"
        }
      },


    },
  },
  plugins: [],
}

