import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** The categories a post can live in. Order here is the order of the index tabs. */
export const CATEGORIES = ["features", "tips", "agents", "voice", "engineering"] as const;

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** One sentence, shown under the title and used as the meta description. */
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("The Dodaios team"),
    category: z.enum(CATEGORIES),
    /** Optional series prefix, e.g. "Using Dodaios". */
    series: z.string().optional(),
    /** App version the post was written against, e.g. "1.4". */
    version: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    /**
     * Force the "Written when the project was still called Personal Jarvis" line on or off. Left
     * out, a post published before the rename gets it (RENAMED_ON in lib.ts).
     */
    renameNote: z.boolean().optional(),
  }),
});

export const collections = { posts };
