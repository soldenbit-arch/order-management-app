import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Order Management System",
  description: "Система управления заказами услуг",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
