import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Helvetica", ...defaultTheme.fontFamily.sans],
                title: ["Reed"],
                mono: ["PPSupplyMono", ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    white: "hsl(var(--white))",
                    "white-dark": "hsl(var(--white-dark))",

                    black: "hsl(var(--black))",
                    "real-white": "hsl(var(--real-white))",

                    primary: "hsl(var(--primary))",
                    "primary-dark": "hsl(var(--primary-dark))",
                    muted: "hsl(var(--muted))",
                    "neutral-muted": "hsl(var(--neutral-muted))",
                },
            },
            fontSize: {
                base: ["16px", "20px"],
            },
            keyframes: {
                about: {
                    "0%": { transform: "translate3d(0, 0%, 0)" },
                    "100%": {
                        transform: "translate3d(0, -100%, 0) scale(1.2,1.5)",
                    },
                },
            },
            animation: {
                about: "about 1s infinite",
            },
        },
    },
    plugins: [],
} satisfies Config;

export default config;
