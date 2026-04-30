/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // EngineRoom Network brand palette
        hull: "#0D1B2A",
        signal: "#1B6CFF",
        steel: "#5C6B7A",
        brass: "#B98A3D",
        sail: "#F4F1EA",
        mist: "#DCE6F0",
        pale: "#F7F9FC",
        char: "#1A1F2E",
        silver: "#A8B4C0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
        wide: "0.05em",
        wider: "0.15em",
        widest: "0.2em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
