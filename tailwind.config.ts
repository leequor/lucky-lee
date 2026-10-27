import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#08090B",
        surface: "#111317",
        raised: "#171A20",
        ink: "#F2EFE7",
        muted: "#969DA6",
        line: "#252A32",
        wash: "#1A1E25",
        accent: "#FF6B35",
        gold: "#E7B45A",
        steel: "#7C8794",
        positive: {
          DEFAULT: "#5BE0A0",
          soft: "#10281E",
          ink: "#B9F7D9",
        },
        negative: {
          DEFAULT: "#FF6B6B",
          soft: "#2B1517",
          ink: "#FFD0D0",
        },
        warn: {
          DEFAULT: "#F0B54A",
          soft: "#2B2113",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "26px",
        full: "9999px",
      },
      maxWidth: {
        canvas: "1120px",
        form: "440px",
      },
    },
  },
  plugins: [],
};

export default config;
