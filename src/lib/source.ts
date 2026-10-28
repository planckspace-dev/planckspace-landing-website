import { createElement } from "react";
import { createGetUrl, llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { icons } from "lucide-react";

/* The documentation, from the MDX files in content/docs. Sidebar order and
   section headings live in each folder's meta.json; a page's `icon`
   frontmatter names a lucide icon. */

const docs = defineDocs({
  dir: "content/docs",
  // keeps each page's processed Markdown, for the llms routes and "Copy Markdown"
  docs: { postprocess: { includeProcessedMarkdown: true } },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  icon(name) {
    if (name && name in icons) return createElement(icons[name as keyof typeof icons]);
  },
});

/** The docs as Markdown for AI agents: /llms.txt, /llms-full.txt and each page's Markdown. */
export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});

const markdownUrl = createGetUrl("/llms.mdx/docs");

/** Where a page's Markdown is served (the index page included). */
export function getPageMarkdownUrl(page: { slugs: string[] }) {
  return markdownUrl([...page.slugs, "content.md"]);
}
