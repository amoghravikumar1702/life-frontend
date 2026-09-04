import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — DhanarkOS",

  description:
    "Read the DhanarkOS Refund Policy covering subscription payments, cancellations, free trials, duplicate charges, payment issues and applicable legal rights.",

  alternates: {
    canonical: "https://dhanark.com/refund-policy",
  },

  openGraph: {
    title: "Refund Policy — DhanarkOS",

    description:
      "Review the DhanarkOS policy for subscription refunds, cancellations, free trials and payment-related issues.",

    url: "https://dhanark.com/refund-policy",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DhanarkOS Refund Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Refund Policy — DhanarkOS",

    description:
      "Review the DhanarkOS policy for subscription refunds, cancellations and payment-related issues.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}