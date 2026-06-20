import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PublicSiteShell } from "@/components/layout/PublicSiteShell";
import { RichContentRenderer } from "@/components/shared/RichContentRenderer";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type AboutPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();
const ABOUT_LABELS = {
  en: "About",
  zh: "关于",
} as const;

export async function generateMetadata({
  searchParams,
}: AboutPageProps): Promise<Metadata> {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const about = await contentLoaders.getAboutEntry(locale);

  return buildPageMetadata({
    title: about.title,
    description: about.summary,
    locale,
    path: "/about",
  });
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const about = await contentLoaders.getAboutEntry(locale);

  return (
    <PublicSiteShell locale={locale}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 pb-8">
          <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
            {ABOUT_LABELS[locale]}
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
            {about.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{about.summary}</p>
        </div>
        <div className="mt-10">
          <RichContentRenderer source={about.body} />
        </div>
      </div>
    </PublicSiteShell>
  );
}
