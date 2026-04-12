import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        // Asegurate de que cubra la carpeta donde tenés tus componentes
    ],
    theme: {
        extend: {
            // ... tus extensiones existentes
        },
    },
    // 👇 AQUÍ ESTÁ LA SOLUCIÓN 👇
    plugins: [
        require("tailwindcss-animate"),
    ],
};
export default config;