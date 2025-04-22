import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
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
			fontFamily: {
				mono: ["var(--font-geist-mono)"],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--dusk))",
					foreground: "hsl(var(--dusk-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--fog))",
					foreground: "hsl(var(--fog-foreground))",
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
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				solaralizedlight: {
					DEFAULT: "hsl(var(--solarized-light))",
					darkened: "hsl(var(--solarized-light-darkened))",
					foreground: "hsl(var(--solarized-light-foreground)",
				},
				solaralizeddark: {
					DEFAULT: "hsl(var(--solarized-dark))",
					darkened: "hsl(var(--solarized-dark-darkened))",
					foreground: "hsl(var(--solarized-dark-foreground)",
				},
				midnight: {
					DEFAULT: "hsl(var(--midnight))",
					foreground: "hsl(var(--midnight-foreground))",
				},
				twilight: {
					DEFAULT: "hsl(var(--twilight))",
					foreground: "hsl(var(--twilight-foreground))",
				},
				dusk: {
					DEFAULT: "hsl(var(--dusk))",
					foreground: "hsl(var(--dusk-foreground))",
				},
				cloud: {
					DEFAULT: "hsl(var(--cloud))",
					foreground: "hsl(var(--cloud-foreground))",
				},
				fog: {
					DEFAULT: "hsl(var(--fog))",
					foreground: "hsl(var(--fog-foreground))",
				},
				radiance: {
					DEFAULT: "hsl(var(--radiance))",
					foreground: "hsl(var(--radiance-foreground))",
				},
				warmth: {
					DEFAULT: "hsl(var(--warmth))",
					foreground: "hsl(var(--warmth-foreground))",
				},
				shine: {
					DEFAULT: "hsl(var(--shine))",
					foreground: "hsl(var(--shine-foreground))",
				},
				gleam: {
					DEFAULT: "hsl(var(--gleam))",
					foreground: "hsl(var(--gleam-foreground))",
				},
				bright: {
					DEFAULT: "hsl(var(--bright))",
					foreground: "hsl(var(--bright-foreground))",
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
			scale: {
				101: "1.01",
			},
			gridTemplateRows: {
				hero: "repeat(2, minmax(0, 0.5fr))",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
