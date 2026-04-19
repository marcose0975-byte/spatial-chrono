import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        /* ─── Glass-specific semantic tokens ──────── */
        "glass-bg": "rgba(255,255,255,0.06)",
        "glass-border": "rgba(255,255,255,0.12)",
        "vibrant-primary": "oklch(0.95 0.02 245)",
        "vibrant-secondary": "oklch(0.65 0.06 245)",
        "vibrant-tertiary": "oklch(0.45 0.04 245)",
        "cyan-glow": "oklch(0.75 0.18 220)",
        "success": "oklch(0.70 0.18 145)",
        "warning": "oklch(0.60 0.20 25)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
        "glass-card": "16px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "glass-sm": "inset 0 1px 0 rgba(255,255,255,0.12)",
        "glass-md": "0 4px 24px rgba(0,0,0,0.3), 0 0 24px oklch(0.75 0.18 220 / 0.15), inset 0 1px 0 rgba(255,255,255,0.10)",
        "glass-lg": "0 8px 40px rgba(0,0,0,0.4), 0 0 40px oklch(0.75 0.18 220 / 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
        "glass-glow": "0 0 20px oklch(0.75 0.18 220 / 0.3), 0 0 40px oklch(0.75 0.18 220 / 0.15)",
        "pill-nav": "0 8px 32px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)",
        "active-tab": "0 0 20px oklch(0.75 0.18 220 / 0.35), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 0 1px oklch(0.75 0.18 220 / 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px oklch(0.75 0.18 220 / 0.2), inset 0 1px 0 0 rgba(255,255,255,0.10)",
          },
          "50%": {
            boxShadow: "0 0 40px oklch(0.75 0.18 220 / 0.45), inset 0 1px 0 0 rgba(255,255,255,0.18)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "40%": { transform: "rotate(8deg)" },
          "60%": { transform: "rotate(-5deg)" },
          "80%": { transform: "rotate(5deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "fade-up": "fade-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
