import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PublicSiteShell } from "@/components/layout/PublicSiteShell";
import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { StreamList } from "@/components/list/StreamList";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { selectArticleList } from "@/lib/content/selectors";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ArticlesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();
const ARTICLES_COPY = {
  en: {
    eyebrow: "Archive",
    title: "Articles",
    summary: "A seeded article stream that demonstrates the route, hierarchy, and reading rhythm of the template.",
    description: "Seeded writing archive for the editorial frontsite template.",
  },
  zh: {
    eyebrow: "归档",
    title: "文章",
    summary: "这里放的是一组种子文章，用来展示这个模板的路由结构、内容层级与阅读节奏。",
    description: "用于展示编辑型首页模板的示例文章归档。",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: ArticlesPageProps): Promise<Metadata> {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const copy = ARTICLES_COPY[locale];

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    locale,
    path: "/articles",
  });
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const articles = selectArticleList(await contentLoaders.getAllArticles(locale));
  const copy = ARTICLES_COPY[locale];

  return (
    <PublicSiteShell locale={locale}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <CollectionPageHeader
          eyebrow={copy.eyebrow}
          summary={copy.summary}
          title={copy.title}
        />
        <div className="mt-12">
          <StreamList articles={articles} locale={locale} />
        </div>
      </div>
    </PublicSiteShell>
  );
}
