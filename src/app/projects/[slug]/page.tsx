import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ProjectDetailTemplate } from "@/components/detail/ProjectDetailTemplate";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

export async function generateStaticParams() {
  const projects = await contentLoaders.getAllProjects(DEFAULT_LOCALE);

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const project = await contentLoaders.getProjectBySlug(resolvedParams.slug, locale);

  if (!project) {
    notFound();
  }

  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    locale,
    path: `/projects/${project.slug}`,
    imagePath: project.coverImage,
  });
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const project = await contentLoaders.getProjectBySlug(resolvedParams.slug, locale);

  if (!project) {
    notFound();
  }

  return <ProjectDetailTemplate project={project} />;
}
