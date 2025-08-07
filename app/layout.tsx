// app/layout.tsx
import "./globals.css";
import Script from "next/script";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <title>Telegram Mini App</title>
      </head>
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
