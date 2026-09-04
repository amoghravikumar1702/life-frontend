import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — DhanarkOS",

  description:
    "Read the DhanarkOS Cookie Policy to understand how cookies and similar technologies are used for authentication, security, sessions and platform functionality.",

  alternates: {
    canonical: "https://dhanark.com/cookies",
  },

  openGraph: {
    title: "Cookie Policy — DhanarkOS",

    description:
      "Learn how DhanarkOS uses cookies and similar technologies for authentication, security and core platform functionality.",

    url: "https://dhanark.com/cookies",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS Cookie Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Cookie Policy — DhanarkOS",

    description:
      "Learn how DhanarkOS uses cookies and similar technologies across the platform.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}