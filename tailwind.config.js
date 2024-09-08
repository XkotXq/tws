const {nextui} = require("@nextui-org/react");

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
const svgToDataUri = require("mini-svg-data-uri");
 
const colors = require("tailwindcss/colors");



/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s ease-in-out infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      }
    },
  },
  darkMode: "class",
  plugins: [
    addVariablesForColors,
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
    nextui(
      {
        themes: {
          light: {
            colors: {
              background: "#171C21",
              foreground: "#fff",
            }
          },
          dark: {
            colors: {
              background: "#000",
            //   divider: "#73b2d3",
            //   focus: "#F5733B",
              foreground: "#fff",
              default: {
                100: "#2a0045",
                200: "#8628bf",
                300: "#850ad1",
                400: "#7b02c7",
                500: "#6505a1",
                600: "#5a068f",
                700: "#4b007a",
                800: "#3f0066",
                900: "#2a0045",
                DEFAULT: "#AA7CFB",
              },
              primary: {
                50: "#250245",
                100: "#2A045D",
                200: "#3B0771",
                300: "#530B8C",
                400: "#6F10A7",
                500: "#8E16C3",
                600: "#B849DB",
                700: "#D76EEC",
                800: "#EFA0F9",
                900: "#FACFFC",
                DEFAULT: "#ad6ceb",
              },
              success: {
                100: "#DAFBD1",
                200: "#AFF7A4",
                300: "#77E773",
                400: "#4DD054",
                500: "#1DB233",
                600: "#159934",
                700: "#0E8034",
                800: "#096731",
                900: "#05552F",
                DEFAULT: "#1DB233",
              },
              info: {
                100: "#CBF7FD",
                200: "#98EAFB",
                300: "#64D1F3",
                400: "#3DB5E7",
                500: "#058cd7",
                600: "#036CB8",
                700: "#02519A",
                800: "#01397C",
                900: "#002967",
                DEFAULT: "#058cd7",
              },
              warning: {
                100: "#FFFACC",
                200: "#FFF399",
                300: "#FFEB66",
                400: "#FFE23F",
                500: "#FFD500",
                600: "#DBB300",
                700: "#B79300",
                800: "#937300",
                900: "#7A5D00",
                DEFAULT: "#FFD500",
              },
              danger: {
                100: "#FEE9DA",
                200: "#FECEB5",
                300: "#FEAD8F",
                400: "#FD8E74",
                500: "#fd5a46",
                600: "#D93733",
                700: "#B6232A",
                800: "#921626",
                900: "#790D24",
                DEFAULT: "#fd5a46",
              },
              secondary: {
                50: "#ff0000",
                100: "#ff0000",
                200: "#ff0000",
                300: "#ff0000",
                400: "#ff0000",
                500: "#ff0000",
                600: "#ff0000",
                700: "#ff0000",
                800: "#ff0000",
                900: "#ff0000",
                DEFAULT: "#ff0000",
              },
            }
          },
        },
        layout: {
          disabledOpacity: "0.3", // opacity-[0.3]
          // radius: {
          //   small: "2px", // rounded-small
          //   medium: "4px", // rounded-medium
          //   large: "6px", // rounded-large
          // },
          // borderWidth: {
          //   small: "1px", // border-small
          //   medium: "1px", // border-medium
          //   large: "2px", // border-large
          // },
        },
      }
  ),
  require("tailwindcss-animate")],
};