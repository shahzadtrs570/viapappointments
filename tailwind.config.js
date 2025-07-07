module.exports = {
  // ... other config
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
      },
      colors: {
        card: {
          DEFAULT: "#1a1b1e",
          light: "#2c2d31",
          dark: "#141517",
        },
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(59,130,246,0.1)",
        "glow-md": "0 0 30px rgba(59,130,246,0.15)",
        "glow-lg": "0 0 45px rgba(59,130,246,0.2)",
      },
    },
  },
}
