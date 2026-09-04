import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/customers",
        "/invoices",
        "/expenses",
        "/payments",
        "/reports",
        "/company",
        "/settings",
        "/onboarding",
        "/record-payment",
        "/billing-required",
        "/api",
        "/login",
        "/signup",
      ],
    },
    sitemap: "https://dhanark.com/sitemap.xml",
  };
}