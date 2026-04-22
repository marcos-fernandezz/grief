import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Podés configurar tu fuente acá si importás Google Fonts en tu layout
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            keyframes: {
                flicker: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.4' },
                }
            },
            animation: {
                flicker: 'flicker 2s ease-in-out infinite',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
};
export default config;