import { notFound } from "next/navigation";
import { docsLlms, source } from "@/lib/source";

/* One docs page as Markdown. The path ends in "content.md" so the index page
   has a file name too; /docs/<page>.md is rewritten here (next.config.mjs). */
export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/docs/[[...slug]]">) {
  const { slug } = await params;
  const slugs = slug?.slice(0, -1) ?? [];
  if (slugs.at(-1) === "index") slugs.pop();
  const page = source.getPage(slugs);
  if (!page) notFound();

  return new Response(await docsLlms.page(page), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

export function generateStaticParams() {
  return source.generateParams().map((item) => ({
    ...item,
    slug: [...(item.slug ?? []), "content.md"],
  }));
}
