import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#06050A",
        "bg-elevated": "#0D0B14",
        violet: {
          300: "#C4B5FD",
          500: "#8B5CF6",
          700: "#6D28D9",
        },
        magenta: {
          500: "#C026D3",
        },
        ice: "#E9E4FF",
        muted: "#8983A3",
      },
      fontFamily: {
        display: ["var(--font-clash)", "sans-serif"],
        body: ["var(--font-general)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.35), transparent 55%)",
        "aurora-2":
          "radial-gradient(circle at 80% 30%, rgba(192,38,211,0.28), transparent 50%)",
        "aurora-3":
          "radial-gradient(circle at 50% 90%, rgba(139,92,246,0.20), transparent 60%)",
      },
      animation: {
        "spin-slow": "spin 40s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
