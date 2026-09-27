import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /studio is the dev-only media render target; it 404s in production,
    // and this keeps it out of any crawl of a preview deployment too.
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: "https://planckspace.dev/sitemap.xml",
  };
}
