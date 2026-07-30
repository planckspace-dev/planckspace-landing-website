import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // This directory sits inside `planckspace/`, which is an npm workspaces root
    // for the sibling repos and has its own lockfile. The landing site is not one
    // of those workspaces, but Turbopack infers the project root by walking up to
    // the first lockfile it finds, so it would pick the parent and watch every
    // sibling repo. Pin the root to this package instead.
    root: import.meta.dirname,
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

export default nextConfig;
