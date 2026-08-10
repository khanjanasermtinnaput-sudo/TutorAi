import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        canvas: "var(--canvas)",
        "canvas-elevated": "var(--canvas-elevated)",

        "glass-surface-1": "var(--glass-surface-1)",
        "glass-surface-2": "var(--glass-surface-2)",
        "glass-surface-3": "var(--glass-surface-3)",
        "glass-border": "var(--glass-border)",
        "glass-highlight": "var(--glass-highlight)",
        "glass-scrim": "var(--glass-scrim)",

        "ink-primary": "var(--ink-primary)",
        "ink-secondary": "var(--ink-secondary)",
        "ink-muted": "var(--ink-muted)",

        "accent-primary": "var(--accent-primary)",
        "accent-primary-deep": "var(--accent-primary-deep)",
        "accent-secondary": "var(--accent-secondary)",

        success: "var(--success)",
        "success-tint": "var(--success-tint)",
        error: "var(--error)",
        "error-tint": "var(--error-tint)",
        warning: "var(--warning)",
        "warning-tint": "var(--warning-tint)",
      },
      backgroundImage: {
        "gradient-liquid": "var(--gradient-liquid)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        droplet: "var(--radius-droplet)",
        full: "var(--radius-full)",
      },
      backdropBlur: {
        "layer-1": "var(--blur-layer-1)",
        "layer-2": "var(--blur-layer-2)",
        "layer-3": "var(--blur-layer-3)",
      },
      boxShadow: {
        "glass-rest": "var(--shadow-glass-rest)",
        "glass-elevated": "var(--shadow-glass-elevated)",
        "glass-pressed": "var(--shadow-glass-pressed)",
      },
      fontFamily: {
        display: ["'SF Pro Display'", "'Noto Sans Thai'", "Inter", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};
export default config;
