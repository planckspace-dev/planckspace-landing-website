import { createMDX } from "fumadocs-mdx/next";

/* ESM, not next.config.ts: Fumadocs MDX is ESM-only and its plugin has to load
   through Node's own resolver. */

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    // This directory sits inside `planckspace/`, which is an npm workspaces root
    // for the sibling repos and has its own lockfile. The landing site is not one
    // of those workspaces, but Turbopack infers the project root by walking up to
    // the first lockfile it finds, so it would pick the parent and watch every
    // sibling repo. Pin the root to this package instead.
    root: import.meta.dirname,
  },
  async rewrites() {
    // any docs page as Markdown: /docs/quickstart.md (the llms routes in src/app)
    return [{ source: "/docs/:slug*.md", destination: "/llms.mdx/docs/:slug*/content.md" }];
  },
  async headers() {
    return [
      {
        // `public/install` is the script behind
        // `curl -fsSL https://planckspace.dev/install | sh`. Without this, the
        // extensionless filename is sniffed as application/x-install-instructions,
        // which makes a browser download the file instead of showing it. Anyone
        // told to pipe a script into their shell should be able to read it first,
        // so force text/plain. Header rules match before the filesystem, so this
        // wins over the static file's guessed type.
        source: "/install",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          // Short TTL: an installer fix has to reach users quickly, and this is
          // fetched once per machine — nothing to gain from a long cache.
          { key: "Cache-Control", value: "public, max-age=300, must-revalidate" },
        ],
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
