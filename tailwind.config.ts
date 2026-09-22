import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Presidential Blue (USWDS blue-warm-60v) */
        "blue-primary": {
          DEFAULT: "#1a4480",
          dark: "#162e51",
          darker: "#0d1b30",
          light: "#4a7cb4",
          lighter: "#d9e8f6",
        },
        /* Vivid Red (USWDS red-50v) */
        "red-secondary": {
          DEFAULT: "#d83933",
          dark: "#b50909",
          darker: "#8b0000",
          light: "#e35353",
          lighter: "#fde0de",
        },
        /* Presidential Gold (USWDS gold-20v) */
        "gold-accent": {
          DEFAULT: "#c2850c",
          dark: "#936f38",
          darker: "#744c15",
          light: "#f0c169",
          lighter: "#fef0d8",
        },
      },
      fontFamily: {
        sans: ["Public Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Merriweather", "Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
