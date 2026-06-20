import type { Metadata } from "next";
import { cookies } from "next/headers";

import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { CollectionCardGrid } from "@/components/list/CollectionCardGrid";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { selectOrderedServices } from "@/lib/content/selectors";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ServicesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();
const SERVICES_COPY = {
  en: {
    eyebrow: "Services",
    title: "Services",
    summary: "This route stays intentionally simple so the template can show a clean services section without adding product complexity.",
    description: "Sample service cards for the editorial frontsite template.",
  },
  zh: {
    eyebrow: "服务",
    title: "服务",
    summary: "这个页面刻意保持简洁，让模板可以展示一个干净的服务版块，而不额外引入产品复杂度。",
    description: "用于展示编辑型首页模板的示例服务卡片。",
  },
} as const;

export async function generateMetadata({
  searchParams,
}: ServicesPageProps): Promise<Metadata> {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const copy = SERVICES_COPY[locale];

  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    locale,
    path: "/services",
  });
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const services = selectOrderedServices(await contentLoaders.getAllServices(locale));
  const copy = SERVICES_COPY[locale];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CollectionPageHeader
        eyebrow={copy.eyebrow}
        summary={copy.summary}
        title={copy.title}
      />
      <div className="mt-12">
        <CollectionCardGrid entries={services} hrefBase="/services" locale={locale} />
      </div>
    </div>
  );
}
