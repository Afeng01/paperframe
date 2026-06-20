import type { Metadata } from "next";

import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { StreamList } from "@/components/list/StreamList";
import { getAllArticles } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";
import { selectArticleList } from "@/lib/content/selectors";

export const metadata: Metadata = buildPageMetadata({
  title: "Articles",
  description: "Seeded writing archive for the editorial frontsite template.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const articles = selectArticleList(await getAllArticles());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CollectionPageHeader
        eyebrow="Archive"
        summary="A seeded article stream that demonstrates the route, hierarchy, and reading rhythm of the template."
        title="Articles"
      />
      <div className="mt-12">
        <StreamList articles={articles} />
      </div>
    </div>
  );
}
