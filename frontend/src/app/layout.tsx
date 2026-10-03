import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a",
};

export const metadata: Metadata = {
  title: {
    default:  "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার",
    template: "%s | শেরপুর আধুনিক চক্ষু হাসপাতাল",
  },
  description:
    "শেরপুর জেলার সেরা চক্ষু হাসপাতাল। ফ্যাকো ক্যাটারেক্ট সার্জারি, রেটিনা, গ্লুকোমা ও সকল চক্ষু সেবা।",
  keywords: ["চক্ষু হাসপাতাল", "শেরপুর", "ফ্যাকো", "eye hospital", "Sherpur"],
  openGraph: {
    type:   "website",
    locale: "bn_BD",
    siteName: "শেরপুর আধুনিক চক্ষু হাসপাতাল",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-bangla antialiased">
        {/* Accessibility: skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-primary-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          মূল বিষয়বস্তুতে যান
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
