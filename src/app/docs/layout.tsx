import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import { RootProvider } from "fumadocs-ui/provider/next";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

/* The docs: the notebook layout (a full-width bar over the sidebar and page),
   light only like the site and the app. next-themes stays off so no theme
   class is left on <html> when a reader goes back to the site. */

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <div className="docs-root flex min-h-dvh flex-col">
        <DocsLayout tree={source.getPageTree()} {...baseOptions()} nav={{ ...baseOptions().nav, mode: "top" }}>
          {children}
        </DocsLayout>
      </div>
    </RootProvider>
  );
}
