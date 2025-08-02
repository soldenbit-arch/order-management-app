import type {Config} from "tailwindcss";
import {fontFamily} from "tailwindcss/defaultTheme";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                neutral: {
                    "400": "#A8A8A8",
                    "900": "#121212",
                    "950": "#0D0D0D",
                },
                primary: {
                    dark: "#2C1E4F",
                },
            },
        },

        fontSize: {
            xs: ["12px", {}],
            sm: ["13px", {}],
            md: ["14px", {letterSpacing: "0.01em"}],
            base: ["15px", {}],
            lg: ["16px", {}],
            xl: ["16px", {lineHeight: "1.29em"}],
            "3xl": ["18px", {}],
            "4xl": ["20px", {}],
            "5xl": ["24px", {}],
            "6xl": ["36px", {}],
        },
        boxShadow: {
            sm: "300px 300px 300px",
            md: "0px 3px 6px rgba(0, 0, 0, 0.02)",
            lg: "0px 4px 20px 4px rgba(255, 255, 255, 0.20) inset",
            xl: "0px 2px 6px 1px rgba(255, 255, 255, 0.25) inset",
            "2xl": "0px 73px 20px 0px rgba(0, 0, 0, 0.00), 0px 47px 19px 0px rgba(0, 0, 0, 0.00), 0px -26px 16px 0px rgba(0, 0, 0, 0.01), 0px -12px 12px 0px rgba(0, 0, 0, 0.02), 0px -3px 6px 0px rgba(0, 0, 0, 0.02), 0px 26px 16px 0px rgba(0, 0, 0, 0.01), 0px 12px 12px 0px rgba(0, 0, 0, 0.02), 0px 3px 6px 0px rgba(0, 0, 0, 0.02)",
            "3xl": "0px 73px 20px rgba(0, 0, 0, 0), 0px 47px 19px rgba(0, 0, 0, 0), 0px -26px 16px rgba(0, 0, 0, 0.01), 0px -12px 12px rgba(0, 0, 0, 0.02), 0px -3px 6px rgba(0, 0, 0, 0.02),  0px 26px 16px rgba(0, 0, 0, 0.01), 0px 12px 12px rgba(0, 0, 0, 0.02),  0px 3px 6px rgba(0, 0, 0, 0.02)",
            "4xl": "0px 73px 20px 0px rgba(0, 0, 0, 0.00), 0px 47px 19px 0px rgba(0, 0, 0, 0.00), 0px 26px 16px 0px rgba(0, 0, 0, 0.01), 0px 12px 12px 0px rgba(0, 0, 0, 0.02), 0px 3px 6px 0px rgba(0, 0, 0, 0.02)",
            "5xl": "0px 2px 12px 2px rgba(255, 255, 255, 0.20) inset",
            "6xl": "0px -73px 20px 0px rgba(0, 0, 0, 0.00), 0px -47px 19px 0px rgba(0, 0, 0, 0.00), 0px -26px 16px 0px rgba(0, 0, 0, 0.01), 0px -12px 12px 0px rgba(0, 0, 0, 0.02), 0px -3px 6px 0px rgba(0, 0, 0, 0.02)",
        },
        dropShadow: {
            sm: "drop-shadow(0px 4px 8px rgba(22, 13, 62, 0.25))",
            md: "drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.02))",
        },
        fontFamily: {
            "sf-pro": ["var(--font-sf-pro)", ...fontFamily.sans],
            manrope: ["var(--font-manrope)", ...fontFamily.sans],
            gilroy: ["var(--font-gilroy)", ...fontFamily.sans],
            "druk-text-wide-cyr": ["var(--font-druk-text-wide-cyr)", "serif"],
        },
    },
    plugins: [],
};

export default config;
