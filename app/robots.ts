import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/sign-in/", "/sign-up/", "/profile/", "/settings/"],
    },
    sitemap: "https://engineroomnetwork.com/sitemap.xml",
  };
}
