import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://dhanarkos.com"),

  title: {
    default: "DhanarkOS — Capital. Mastered.",
    template: "%s — DhanarkOS",
  },

  description:
    "The financial operating system for modern businesses. Understand your numbers, control your cash, and make better decisions.",

  keywords: [
    "DhanarkOS",
    "financial operating system",
    "business finance",
    "SME finance",
    "AI CFO",
    "financial management",
    "business cash flow",
  ],

  openGraph: {
    title: "DhanarkOS — Capital. Mastered.",
    description:
      "The financial operating system for modern businesses.",
    url: "https://dhanarkos.com",
    siteName: "DhanarkOS",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS — Capital. Mastered.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DhanarkOS — Capital. Mastered.",
    description:
      "The financial operating system for modern businesses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#070809] text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}