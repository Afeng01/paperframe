import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { ServiceDetailTemplate } from "@/components/detail/ServiceDetailTemplate";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import { buildPageMetadata } from "@/lib/metadata";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

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
  const service = await contentLoaders.getServiceBySlug(resolvedParams.slug, locale);

  if (!service) {
    notFound();
  }

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
  const service = await contentLoaders.getServiceBySlug(resolvedParams.slug, locale);

  if (!service) {
    notFound();
  }

  return <ServiceDetailTemplate service={service} />;
}
