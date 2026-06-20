import type { Metadata } from "next";
import { cookies } from "next/headers";

import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { CollectionCardGrid } from "@/components/list/CollectionCardGrid";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { selectOrderedProjects } from "@/lib/content/selectors";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();
const PROJECTS_COPY = {
  en: {
    eyebrow: "Projects",
    title: "Projects",
    summary: "Projects are seeded with sample content, but the card anatomy and detail pages are ready for real work.",
    description: "Sample project grid for the editorial frontsite template.",
  },
  zh: {
    eyebrow: "项目",
    title: "项目",
    summary: "这里先放的是示例项目内容，但卡片结构和详情页已经具备承接真实作品的骨架。",
    description: "用于展示编辑型首页模板的示例项目列表。",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const copy = PROJECTS_COPY[locale];

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    locale,
    path: "/projects",
  });
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const projects = selectOrderedProjects(await contentLoaders.getAllProjects(locale));
  const copy = PROJECTS_COPY[locale];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CollectionPageHeader
        eyebrow={copy.eyebrow}
        summary={copy.summary}
        title={copy.title}
      />
      <div className="mt-12">
        <CollectionCardGrid entries={projects} hrefBase="/projects" />
      </div>
    </div>
  );
}
