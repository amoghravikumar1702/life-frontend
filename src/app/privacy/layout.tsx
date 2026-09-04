import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — DhanarkOS",

  description:
    "Read the DhanarkOS Privacy Policy to understand how account, business, financial, payment and AI-related information is collected, used and protected.",

  alternates: {
    canonical: "https://dhanark.com/privacy",
  },

  openGraph: {
    title: "Privacy Policy — DhanarkOS",

    description:
      "Learn how DhanarkOS handles account, business, financial, payment and AI-related information.",

    url: "https://dhanark.com/privacy",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS Privacy Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Privacy Policy — DhanarkOS",

    description:
      "Learn how DhanarkOS handles and protects information used by the platform.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}