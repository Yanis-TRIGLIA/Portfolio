/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        events: "minmax(0, 2fr)  auto minmax(0, 2fr)  minmax(45px, auto)",
        "events-friends":
          "auto minmax(0, 2fr) minmax(0, 2fr) minmax(0, 1fr)  auto",
      },
      colors: {
        border: "hsl(var(--border))",
        borderadmin: "hsl(var(--borderadmin))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        pending: "hsl(var(--pending))",
        rejected: "hsl(var(--rejected))",
        accepted: "hsl(var(--accepted))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F65CA",
          foreground: "hsl(var(--primary-foreground))",
        },
        gold: {
          DEFAULT: "#EEA312",
          foreground: "hsl(var(--gold-foreground))",
          opacity : "hsl(var(--gold-opacity))",
        },
        red: {
          DEFAULT: "hsl(var(--red))",
          opacity: "hsl(var(--red-opacity))",
        },
        bluelight: {
          DEFAULT: "hsl(var(--bluelight))",
        },
        green: {
          DEFAULT: "hsl(var(--green-primary))",
          opacity: "hsl(var(--green-opacity))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(.6,2.7,.8,.8)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities(
        {
          ".underline-offset-7": {
            textUnderlineOffset: "7px",
          },
        },
        ["responsive", "hover"]
      );
    },
  ],
};
