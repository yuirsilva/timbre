import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Pretendard", ...defaultTheme.fontFamily.sans],
                title: ["Reed"],
                mono: ["PPSupplyMono", ...defaultTheme.fontFamily.mono],
            },
            colors: {
                brand: {
                    white: "hsl(var(--white))",
                    black: "hsl(var(--black))",
                    "real-white": "hsl(var(--real-white))",

                    primary: "hsl(var(--primary))",
                    "primary-dark": "hsl(var(--primary-dark))",
                    muted: "hsl(var(--muted))",
                    "neutral-muted": "hsl(var(--neutral-muted))",
                },
            },
        },
        fontSize: {
            base: ["16px", "20px"],
        },
    },
    plugins: [],
} satisfies Config;

export default config;
