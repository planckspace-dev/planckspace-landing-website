import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

/* Docs search (⌘K): an index built from the MDX pages, served to the search dialog. */
export const { GET } = createFromSource(source, {
  language: "english",
});
