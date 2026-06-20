import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ProjectDetailTemplate } from "@/components/detail/ProjectDetailTemplate";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

function isMissingLocalizedProjectError(error: unknown, slug: string, locale: Locale): boolean {
  return (
    error instanceof Error &&
    error.message.startsWith(
      `Missing locale "${locale}" for projects slug "${slug}". Available locales: `,
    )
  );
}

async function getLocalizedProjectOrNotFound(slug: string, locale: Locale) {
  try {
    const project = await contentLoaders.getProjectBySlug(slug, locale);

    if (!project) {
      notFound();
    }

    return project;
  } catch (error) {
    if (isMissingLocalizedProjectError(error, slug, locale)) {
      notFound();
    }

    throw error;
  }
}

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
  const project = await getLocalizedProjectOrNotFound(resolvedParams.slug, locale);

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
  const project = await getLocalizedProjectOrNotFound(resolvedParams.slug, locale);

  return <ProjectDetailTemplate locale={locale} project={project} />;
}
