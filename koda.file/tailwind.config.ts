import type { Config } from "tailwindcss";

const config: Config = {
  /* Light theme only — no dark mode */
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Sans'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      colors: {
        koda: {
          bg: "#f1f5f9",
          surface: "#ffffff",
          card: "#ffffff",
          border: "#cbd5e1",
          accent: "#1d4ed8",
          "accent-light": "#2563eb",
          green: "#047857",
          red: "#b91c1c",
          muted: "#64748b",
          text: "#0f172a",
          "text-muted": "#475569",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "hero-title": "heroTitle 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "hero-subtitle": "heroSubtitle 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards",
        "hero-cta": "heroCta 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroTitle: {
          "0%": { opacity: "1", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroSubtitle: {
          "0%": { opacity: "1", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heroCta: {
          "0%": { opacity: "1", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
