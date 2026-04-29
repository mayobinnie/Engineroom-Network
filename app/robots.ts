import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/sign-in/",
          "/sign-up/",
          "/profile/",
          "/settings/",
          "/admin/",
        ],
      },
      // Block AI training crawlers explicitly. Content remains visible
      // to humans and conventional search engines, but we don't license
      // our editorial directory work for LLM training without consent.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "PerplexityBot", disallow: "/" },
    ],
    sitemap: "https://engineroomnetwork.com/sitemap.xml",
    host: "https://engineroomnetwork.com",
  };
}
