import { cookies } from "next/headers";

import { getSiteContent } from "@/content/site";
import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { HeroSection } from "@/components/home/HeroSection";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { QuoteSection } from "@/components/home/QuoteSection";
import { RecentStreamList } from "@/components/home/RecentStreamList";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale-cookie";
import { resolveLocale } from "@/lib/i18n/resolve-locale";
import {
  selectFeaturedArticle,
  selectOrderedProjects,
  selectOrderedServices,
  selectRecentArticles,
} from "@/lib/content/selectors";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const contentLoaders = createLocalizedContentLoaders();

export default async function Home({ searchParams }: HomePageProps) {
  const [resolvedSearchParams, cookieStore] = await Promise.all([searchParams, cookies()]);
  const locale = resolveLocale({
    resolvedSearchParams,
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value ?? null,
  });
  const [site, articles, projects, services] = await Promise.all([
    Promise.resolve(getSiteContent(locale)),
    contentLoaders.getAllArticles(locale),
    contentLoaders.getAllProjects(locale),
    contentLoaders.getAllServices(locale),
  ]);

  const featuredArticle = selectFeaturedArticle(articles);
  const recentArticles = selectRecentArticles(articles, 5);
  const featuredProjects = selectOrderedProjects(projects, 6);
  const featuredServices = selectOrderedServices(services, 4);

  return (
    <>
      <HeroSection site={site} />
      <FeaturedArticle article={featuredArticle} />
      <RecentStreamList articles={recentArticles} />
      <StatsSection stats={site.stats} />
      <ProjectGrid projects={featuredProjects} />
      <ServiceGrid services={featuredServices} />
      <QuoteSection quote={site.quote} />
      <ContactSection contact={site.contact} />
    </>
  );
}
