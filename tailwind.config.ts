import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#06050A",
        "bg-elevated": "#0D0B14",
        violet: { 300: "#C4B5FD", 500: "#8B5CF6", 700: "#6D28D9" },
        magenta: { 500: "#C026D3" },
        ice: "#E9E4FF",
        muted: "#8983A3",
      },
      fontFamily: {
        display: ["var(--font-clash)", "sans-serif"],
        body: ["var(--font-general)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;