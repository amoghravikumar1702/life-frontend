import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DhanarkOS Pricing — AI Financial Software for Businesses",

  description:
    "Explore DhanarkOS pricing for growing businesses. Manage invoices, payments, expenses, cash flow, financial analysis, and AI CFO insights from one intelligent financial operating system.",

  alternates: {
    canonical: "https://dhanark.com/pricing",
  },

  openGraph: {
    title: "DhanarkOS Pricing — AI Financial Software for Businesses",

    description:
      "Choose the DhanarkOS plan that fits your business and manage finance, cash flow, invoices, payments, and AI CFO insights in one intelligent operating system.",

    url: "https://dhanark.com/pricing",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS Pricing — AI Financial Software for Businesses",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "DhanarkOS Pricing — AI Financial Software for Businesses",

    description:
      "Choose a DhanarkOS plan for smarter business finance management and AI CFO intelligence.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PricingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}