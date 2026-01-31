export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0b1020",
        ember: "#ff7a59",
        aurora: "#20c997",
        haze: "#9aa6c7",
      },
      fontFamily: {
        display: ["\"Cabinet Grotesk\"", "system-ui", "sans-serif"],
        body: ["\"Sora\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(32, 201, 151, 0.35)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};
