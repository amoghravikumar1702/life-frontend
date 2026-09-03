import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/customers/",
        "/invoices/",
        "/expenses/",
        "/reports/",
        "/settings/",
        "/api/",
        "/login/",
        "/signup/",
      ],
    },
    sitemap: "https://dhanarkos.com/sitemap.xml",
  };
}