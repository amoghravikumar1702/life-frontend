import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact DhanarkOS — Support & Business Enquiries",

  description:
    "Contact DhanarkOS for product support, privacy questions, general enquiries, and business communication. Reach the DhanarkOS team directly.",

  alternates: {
    canonical: "https://dhanark.com/contact",
  },

  openGraph: {
    title: "Contact DhanarkOS — Support & Business Enquiries",

    description:
      "Get in touch with DhanarkOS for product support, privacy questions, and business enquiries.",

    url: "https://dhanark.com/contact",

    siteName: "DhanarkOS",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact DhanarkOS — Support & Business Enquiries",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Contact DhanarkOS — Support & Business Enquiries",

    description:
      "Contact DhanarkOS for product support, privacy questions, and business enquiries.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}