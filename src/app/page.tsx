import { ContactSection } from "@/components/home/ContactSection";
import { FeaturedArticle } from "@/components/home/FeaturedArticle";
import { HeroSection } from "@/components/home/HeroSection";
import { ProjectGrid } from "@/components/home/ProjectGrid";
import { QuoteSection } from "@/components/home/QuoteSection";
import { RecentStreamList } from "@/components/home/RecentStreamList";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { getAllArticles, getAllProjects, getAllServices } from "@/lib/content/default-locale-loaders";
import { getSiteContent } from "@/lib/content/loaders";
import {
  selectFeaturedArticle,
  selectOrderedProjects,
  selectOrderedServices,
  selectRecentArticles,
} from "@/lib/content/selectors";

export default async function Home() {
  const [site, articles, projects, services] = await Promise.all([
    getSiteContent(),
    getAllArticles(),
    getAllProjects(),
    getAllServices(),
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
