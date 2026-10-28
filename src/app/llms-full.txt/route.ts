import { docsLlms } from "@/lib/source";

/* Every docs page as Markdown, in one file. */
export const revalidate = false;

export async function GET() {
  return new Response(await docsLlms.full(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
