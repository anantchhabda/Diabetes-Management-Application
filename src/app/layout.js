// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import Header from "./components/header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: "#04BF8A",
};

export const metadata = {
  title: "Diabetes Management Application",
  description: "Lightweight diabetes management app with offline capability",
};

export default function RootLayout({ children }) {
  return (
    // suppress hydration warnings
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* pwa incorporation*/}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* global header */}
        <Header />

        <div className="pb-5"></div>

        {/* page content */}
        {children}

        {/* load i18n after page hydrated */}
        <Script src="/js/i18n.js" strategy="lazyOnload" />

        {/* service worker register*/}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            (function () {
              if (typeof window === "undefined") return;
              if (!("serviceWorker" in navigator)) {
                console.log("Service Worker not supported");
                return;
              }
              navigator.serviceWorker.register("/sw.js", { scope: "/" })
                .then(reg => {
                  console.log(" Service Worker registered:", reg.scope);
                  if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
                })
                .catch(err => console.error("Service Worker registration FAILED:", err));
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
