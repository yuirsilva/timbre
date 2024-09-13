import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Pretendard", ...defaultTheme.fontFamily.sans],
                title: ["Reed"],
            },
            colors: {
                brand: {
                    white: "var(--white)",
                    black: "var(--black)",
                    "real-white": "var(--real-white)",

                    primary: "var(--primary)",
                    "primary-dark": "var(--primary-dark)",
                    muted: "var(--muted)",
                    "neutral-muted": "var(--neutral-muted)",
                },
            },
        },
    },
    plugins: [],
} satisfies Config;

export default config;
