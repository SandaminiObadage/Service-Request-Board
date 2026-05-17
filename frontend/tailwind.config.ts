import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./hooks/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#D0D5DD",
        surface: "#F4F7FB",
        brand: "#2952CC",
        brandDark: "#1E3A8A",
        accent: "#D92D20",
        success: "#067647",
        warning: "#B54708"
      },
      boxShadow: {
        soft: "0 14px 36px rgba(23, 32, 51, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
