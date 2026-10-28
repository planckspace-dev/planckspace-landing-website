import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://planckspace.dev";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/demo`, changeFrequency: "monthly", priority: 0.9 },
    // Pricing is hidden for now — restore with the /pricing route.
    // { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
    ...source.getPages().map((page) => ({
      url: `${base}${page.url}`,
      changeFrequency: "weekly" as const,
      priority: page.url === "/docs" ? 0.8 : 0.6,
    })),
  ];
}
