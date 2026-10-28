import { docsLlms } from "@/lib/source";

/* The docs index for AI agents (llmstxt.org): every page, its URL and summary. */
export const revalidate = false;

export async function GET() {
  return new Response(await docsLlms.index(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
