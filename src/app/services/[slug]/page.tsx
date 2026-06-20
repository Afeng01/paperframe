import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { PublicSiteShell } from "@/components/layout/PublicSiteShell";
import { ServiceDetailTemplate } from "@/components/detail/ServiceDetailTemplate";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

function isMissingLocalizedServiceError(error: unknown, slug: string, locale: Locale): boolean {
  return (
    error instanceof Error &&
    error.message.startsWith(
      `Missing locale "${locale}" for services slug "${slug}". Available locales: `,
    )
  );
}

async function getLocalizedServiceOrNotFound(slug: string, locale: Locale) {
  try {
    const service = await contentLoaders.getServiceBySlug(slug, locale);

    if (!service) {
      notFound();
    }

    return service;
  } catch (error) {
    if (isMissingLocalizedServiceError(error, slug, locale)) {
      notFound();
    }

    throw error;
  }
}

export async function generateStaticParams() {
  const services = await contentLoaders.getAllServices(DEFAULT_LOCALE);

  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ServicePageProps): Promise<Metadata> {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const service = await getLocalizedServiceOrNotFound(resolvedParams.slug, locale);

  return buildPageMetadata({
    title: service.title,
    description: service.summary,
    locale,
    path: `/services/${service.slug}`,
    imagePath: service.coverImage,
  });
}

export default async function ServicePage({ params, searchParams }: ServicePageProps) {
  const [resolvedParams, resolvedSearchParams, cookieStore] = await Promise.all([
    params,
    searchParams,
    cookies(),
  ]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const service = await getLocalizedServiceOrNotFound(resolvedParams.slug, locale);

  return (
    <PublicSiteShell locale={locale}>
      <ServiceDetailTemplate locale={locale} service={service} />
    </PublicSiteShell>
  );
}
