import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** Published posts, newest first. Drafts only show on the dev server. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Minutes to read at 230 words per minute, counting prose only. */
export function readingMinutes(body: string | undefined): number {
  const text = (body ?? "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** A site-internal path with the /blog base prefixed: href("x/") -> "/blog/x/". */
export function href(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Version of the social card design, sent as ?v= on og:image. X and LinkedIn
 * cache a card image by its URL for days; bump this when src/og.ts changes
 * how cards look, or shares keep showing the old design.
 */
export const OG_VERSION = 4;

export const SITE = {
  name: "Dodaios",
  title: "Dodaios Blog",
  tagline: "What we ship, what we measure while shipping it, and how to get more out of an AI assistant on your own machine.",
  main: "https://dodaios.ai",
  /** The project's X account, as it goes into twitter:site. */
  x: "@dodaios",
  github: "https://github.com/Dodaios/Dodaios",
};

/**
 * The project was called Personal Jarvis until this day. Posts published
 * before it name the product by its old name and are left as written; the
 * post page puts one line above them that says so (see `showsRenameNote`).
 */
export const FORMER_NAME = "Personal Jarvis";
export const RENAMED_ON = new Date("2026-10-12T00:00:00Z");
/** The post that announces the rename; the note links to it. */
export const RENAME_POST = "personal-jarvis-is-now-dodaios";

/**
 * Whether a post gets the "is now called Dodaios" line. By date, so the older
 * posts need no edit; `renameNote` in a post's frontmatter overrides it.
 */
export function showsRenameNote(post: Post): boolean {
  if (post.id === RENAME_POST) return false;
  return post.data.renameNote ?? post.data.pubDate.valueOf() < RENAMED_ON.valueOf();
}

/** How a category reads on the page; the schema enum stays the URL key. */
export const CATEGORY_LABEL: Record<Post["data"]["category"], string> = {
  features: "Features",
  tips: "Tips",
  agents: "Coding agents",
  voice: "Voice",
  engineering: "Engineering",
};

/** The index filtered to one category: a plain link that works without JS. */
export function categoryHref(category: Post["data"]["category"]): string {
  return href(`?category=${category}#posts`);
}

/**
 * The flat colour a category's pictures sit on: card thumbnails and social
 * cards alike. Fixed in both themes, like paper the drawing is printed on.
 */
export const CATEGORY_TONE: Record<Post["data"]["category"], string> = {
  agents: "#dcaa4e",
  engineering: "#c5cbd8",
  features: "#bccaa9",
  tips: "#e3b9a8",
  voice: "#d98a5f",
};

const drawings = import.meta.glob<string>("/src/illustrations/*.svg", { query: "?raw", import: "default", eager: true });

/** Whether a post has its own line drawing in src/illustrations/. */
export function hasIllustration(slug: string): boolean {
  return `/src/illustrations/${slug}.svg` in drawings;
}

/** A post's line drawing (src/illustrations/<slug>.svg), or the default one when it has none. */
export function illustration(slug: string): string {
  return drawings[`/src/illustrations/${slug}.svg`] ?? drawings["/src/illustrations/default.svg"];
}
