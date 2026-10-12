# Dodaios Blog

Source of [dodaios.ai/blog](https://dodaios.ai/blog/): new features, field notes
and tips for [Dodaios](https://dodaios.ai), the open-source desktop AI assistant.
The project was called Personal Jarvis until October 2026; posts from before
then keep that name and carry a one-line note.

Astro 7 + MDX, static, deployed to GitHub Pages. Charts are Astro components that render
inline SVG at build time from aggregated data in `src/data/` — no chart library.

```sh
npm install
npm run dev      # http://127.0.0.1:4410
npm run verify   # type-check + production build
```

Posts live in `src/content/posts/*.mdx`; charts in `src/components/charts/`.
Social cards are rendered at build time to `/og/<slug>.png` (`src/og.ts`) from the post's
cover drawing, `src/illustrations/<slug>.svg`, on its category's flat tone; the build fails
for a published post without one. Bump `OG_VERSION` in `src/lib.ts` when the card design
changes, so X and LinkedIn fetch the new image instead of their cached copy.
