import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetailTemplate } from "@/components/detail/ArticleDetailTemplate";
import { getAllArticles, getArticleBySlug } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const articles = await getAllArticles();

  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildPageMetadata({
    title: article.title,
    description: article.summary,
    path: `/articles/${article.slug}`,
    imagePath: article.coverImage,
    type: "article",
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailTemplate article={article} />;
}
