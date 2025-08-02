import type {Metadata} from "next";
import "./globals.css";
import {Manrope} from "next/font/google";
import localFont from "next/font/local";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
    variable: "--font-manrope",
});

const drukTextWideMedium = localFont({
    src: "../fonts/DrukTextWideCyr/Druk Text Wide Medium.woff2",
    variable: "--font-druk-text-wide-cyr",
});

const fonts = [manrope, drukTextWideMedium].map((font) => font.variable).join(" ");

export const metadata: Metadata = {
    title: "Order Management System",
};

function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en">
            <body className={`${fonts} overflow-x-hidden`}>
                <div className="overflow-hidden">
                    <div className="device-container px-3 pb-8">{children}</div>
                </div>
            </body>
        </html>
    );
}

export default RootLayout;
