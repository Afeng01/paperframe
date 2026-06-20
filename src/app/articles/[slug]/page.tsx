import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ArticleDetailTemplate } from "@/components/detail/ArticleDetailTemplate";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

export async function generateStaticParams() {
  const articles = await contentLoaders.getAllArticles(DEFAULT_LOCALE);

  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ArticlePageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const article = await contentLoaders.getArticleBySlug(resolvedParams.slug, locale);

  if (!article) {
    notFound();
  }

  return buildPageMetadata({
    title: article.title,
    description: article.summary,
    locale,
    path: `/articles/${article.slug}`,
    imagePath: article.coverImage,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const article = await contentLoaders.getArticleBySlug(resolvedParams.slug, locale);

  if (!article) {
    notFound();
  }

  return <ArticleDetailTemplate article={article} />;
}
