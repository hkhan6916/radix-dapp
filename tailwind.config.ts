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
        primary: {
          100: "#E0DFFF",
          200: "#AAA7FF",
          300: "#8481E1",
          400: "#3D37FF",
          500: "#0800FE",
          600: "#0700E2",
        },
        error: {
          500: "#E18181",
        },
        light: {
          300: "#FBEBE2",
          400: "#FDF9F7",
          500: "#FFFFFF",
        },
        dark: {
          100: "#E4E4ED",
          400: "#787882",
          500: "#000000",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
