import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — DhanarkOS",

  description:
    "Read the DhanarkOS Terms of Service covering account use, business and financial data, AI CFO functionality, subscriptions, payments, acceptable use and service availability.",

  alternates: {
    canonical: "https://dhanark.com/terms",
  },

  openGraph: {
    title: "Terms of Service — DhanarkOS",

    description:
      "Review the terms governing your use of DhanarkOS, including accounts, financial data, AI intelligence, subscriptions and payments.",

    url: "https://dhanark.com/terms",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS Terms of Service",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Terms of Service — DhanarkOS",

    description:
      "Review the terms governing the use of DhanarkOS and its financial intelligence platform.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}