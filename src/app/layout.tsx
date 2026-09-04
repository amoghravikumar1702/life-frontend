import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://dhanark.com"),

  title: "DhanarkOS — AI Financial Operating System for Businesses",

  description:
    "DhanarkOS is an AI-powered financial operating system for growing businesses. Manage cash flow, invoices, customers and payments, and turn financial activity into intelligent decisions with your AI CFO.",

  alternates: {
    canonical: "https://dhanark.com/",
  },

  openGraph: {
    title: "DhanarkOS — AI Financial Operating System for Businesses",
    description:
      "Manage cash flow, invoices, customers and payments in one intelligent financial operating system. Turn your business finances into better decisions with DhanarkOS.",
    url: "https://dhanark.com/",
    siteName: "DhanarkOS",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS — AI Financial Operating System for Businesses",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DhanarkOS — AI Financial Operating System for Businesses",
    description:
      "An AI-powered financial operating system for growing businesses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dhanark.com/#organization",
      name: "DhanarkOS",
      url: "https://dhanark.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://dhanark.com/og-image.png",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://dhanark.com/#website",
      url: "https://dhanark.com/",
      name: "DhanarkOS",
      publisher: {
        "@id": "https://dhanark.com/#organization",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://dhanark.com/#software",
      name: "DhanarkOS",
      url: "https://dhanark.com/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "An AI-powered financial operating system for growing businesses with tools for cash flow, invoices, customers, payments and AI-powered financial intelligence.",
      publisher: {
        "@id": "https://dhanark.com/#organization",
      },
    },
  ],
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </QueryProvider>
  );
}