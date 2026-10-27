import type { APIRoute, GetStaticPaths } from "astro";
import { CATEGORY_LABEL, CATEGORY_TONE, formatDate, getPosts, hasIllustration, illustration, readingMinutes } from "@/lib";
import { renderOg, type OgCard } from "@/og";
import { RENAMED_SLUGS } from "@/renamed-slugs";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  // Every published post wears its own cover drawing: it is the index
  // thumbnail and the link preview. Drafts may borrow the default until then.
  const bare = posts.filter((p) => !p.data.draft && !hasIllustration(p.id)).map((p) => p.id);
  if (bare.length) {
    throw new Error(`Missing cover drawing for ${bare.join(", ")}: add src/illustrations/<slug>.svg`);
  }
  const cards: { slug: string; card: OgCard }[] = [
    {
      slug: "default",
      card: {
        title: "Notes from building Dodaios",
        label: "New features, field notes and tips",
        meta: "dodaios.ai/blog",
        tone: CATEGORY_TONE.agents,
        drawing: illustration("default"),
      },
    },
    ...posts.map((p) => ({
      slug: p.id,
      card: {
        title: p.data.title,
        label: p.data.series ?? CATEGORY_LABEL[p.data.category],
        meta: `${formatDate(p.data.pubDate)} · ${readingMinutes(p.body)} min read`,
        tone: CATEGORY_TONE[p.data.category],
        drawing: illustration(p.id),
      },
    })),
  ];
  // A renamed post's card is served at its old address too, so a share made
  // before the rename keeps its preview image (now with the current title).
  for (const [from, to] of Object.entries(RENAMED_SLUGS)) {
    const current = cards.find((c) => c.slug === to);
    if (current) cards.push({ slug: from, card: current.card });
  }
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.card as OgCard);
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
