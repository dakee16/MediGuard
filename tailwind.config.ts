import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Teal — primary
        teal: {
          50: "#effaf8",
          100: "#d7f1ec",
          200: "#b1e3d9",
          300: "#82cdc1",
          400: "#52b3a6",
          500: "#349990",
          600: "#287872",
          700: "#21605c",
          800: "#1c4d4a",
          900: "#19403e",
          950: "#0c2624",
        },
        // Soft coral — accent
        coral: {
          50: "#fef4f2",
          100: "#fde7e2",
          200: "#fbd3ca",
          300: "#f7b1a2",
          400: "#f08470",
          500: "#e35d45",
          600: "#cf4127",
          700: "#ad351f",
          800: "#8f2f1d",
          900: "#772c1e",
          950: "#41130a",
        },
        // Warm neutrals — paper-feel base
        ink: {
          50: "#faf9f7",
          100: "#f3f1ec",
          200: "#e6e2d8",
          300: "#d2cbbc",
          400: "#aea490",
          500: "#8a8170",
          600: "#6f6759",
          700: "#5a5347",
          800: "#43403a",
          900: "#2b2a26",
          950: "#191815",
        },
      },
      fontSize: {
        // Editorial display sizes
        "display-xl": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      backdropBlur: {
        "xs": "2px",
        "4xl": "72px",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "float": "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-12px) translateX(6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glass-sm": "0 1px 2px 0 rgba(25, 64, 62, 0.04), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
        "glass": "0 8px 32px -8px rgba(25, 64, 62, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
        "glass-lg": "0 24px 64px -12px rgba(25, 64, 62, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
        "soft": "0 1px 2px 0 rgba(25, 64, 62, 0.05), 0 8px 24px -6px rgba(25, 64, 62, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
