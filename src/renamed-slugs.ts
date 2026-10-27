/**
 * Posts whose address named the product by its old name, mapped old slug ->
 * new slug. Kept forever: links already shared keep working.
 *
 * - astro.config.mjs turns each pair into a redirect page at the old address.
 * - src/pages/og/[slug].png.ts renders the post's current social card at the
 *   old /og/<old>.png too, so earlier shares do not lose their preview image.
 *
 * Plain module on purpose (no astro:* imports): the Astro config loads it.
 */
export const RENAMED_SLUGS: Record<string, string> = {
  "jarvis-verse": "dodaios-verse",
  "how-jarvis-voice-works": "how-dodaios-voice-works",
  "how-jarvis-gives-agents-their-tools": "how-dodaios-gives-agents-their-tools",
  "jarvis-learns-who-you-are": "dodaios-learns-who-you-are",
  "jarvis-agents-keep-working": "dodaios-agents-keep-working",
  "what-a-month-of-jarvis-cost": "what-a-month-of-dodaios-cost",
};
