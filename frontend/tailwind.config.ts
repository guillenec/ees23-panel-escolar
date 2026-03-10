import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#dceeff",
          500: "#1f6fb2",
          700: "#165180"
        }
      }
    }
  },
  plugins: []
};

export default config;
