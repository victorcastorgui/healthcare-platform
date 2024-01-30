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
        "dark-green": "#00383F",
        "orange-waiting": "#FFB03D",
        "blue-confirmation": "#00C0FF",
        "blue-processed": "#0500FF",
        "green-sent": "#008640",
        "gray-confirmed": "#7B818A",
        "red-canceled": "#FF2A04",
        "primary-text": "#00383F",
        whitebg: "#F2F3F9",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#36A5B2",
          secondary: "#A5D0D4",
          "primary-text": "#00383F",
          "secondary-text": "#FEF5E7",
          error: "#FF4949",
          success: "#2FAC1B",
        },
      },
      "light",
    ],
  },
};
export default config;
