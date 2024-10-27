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
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        fadeInQuadrant: {
          '0%': { opacity: 0 },
          '100%': { opacity: 0.2 }
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 }
        },
        scaleIn: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
        scaleOut: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0)' }
        },
        fadeScaleIn: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.98)'
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)'
          }
        }

      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'fade-in-2': 'fadeInQuadrant 0.5s cubic-bezier(0.130, 0.835, 0.130, 0.830) forwards ',
        'fade-out': 'fadeOut 0.5s ease-in forwards',
        'scale-in': 'scaleIn 0.3s ease-in forwards',
        'scale-out': 'scaleOut 0.3s ease-in forwards',
        'fade-scale-in': 'fadeScaleIn 0.5s cubic-bezier(0.405, 1.070, 0.435, 0.780)'
      },

      width: {
        "input-full": "calc(100vw - 700px)",
        "input-half": "calc(50vw - 350px)",
      },
      transitionTimingFunction: {
        'bezier-in': "cubic-bezier(0.405, 1.070, 0.435, 0.780)",
        'bezier-in-2': "cubic-bezier(0.130, 0.835, 0.130, 0.830)"
      },
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
        },
        "invalid": "#F57272",
        "valid": "#96E99E",
        "primary": "#E9AA96",
        "secondary": "#C185A2",
        "accent": "#6962AD",
      },


    },
  },
  plugins: [],
}

