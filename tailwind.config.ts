import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "noir-bg": "#0a0a0a",
        "noir-surface": "#111111",
        "noir-elevated": "#1a1a1a",
        "noir-border": "#2a2a2a",
        "noir-muted": "#555555",
        "noir-text": "#e8e8e8",
        "noir-accent": "#8b0000",
        "noir-gold": "#d4af37",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        heebo: ["var(--font-heebo)", "Arial", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["96px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["72px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["52px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        "vignette":
          "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
        "hero-overlay":
          "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.85) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px rgba(212,175,55,0.15)",
        "crimson-glow": "0 0 20px rgba(139,0,0,0.3)",
        "panel": "0 0 60px rgba(0,0,0,0.8), 0 0 20px rgba(139,0,0,0.1)",
      },
      borderColor: {
        "gold-subtle": "rgba(212,175,55,0.15)",
        "gold-medium": "rgba(212,175,55,0.3)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease forwards",
        "grain": "grain 8s steps(10) infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 4px 2px rgba(139,0,0,0.8)" },
          "50%": { opacity: "0.6", boxShadow: "0 0 8px 4px rgba(139,0,0,0.4)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(2%, -2%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "60%": { transform: "translate(1%, 3%)" },
          "70%": { transform: "translate(3%, -1%)" },
          "80%": { transform: "translate(-2%, 2%)" },
          "90%": { transform: "translate(1%, -3%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
