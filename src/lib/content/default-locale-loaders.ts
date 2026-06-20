import type { AboutEntry, ArticleEntry, ProjectEntry, ServiceEntry } from "@/lib/content/schemas";
import { createLocalizedContentLoaders } from "@/lib/content/loaders";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

// These wrappers are a temporary bridge for the pre-locale route layer.
// The explicit locale API lives in content/loaders.ts.
export function getAboutEntry(): Promise<AboutEntry> {
  return createLocalizedContentLoaders().getAboutEntry(DEFAULT_LOCALE);
}

export function getAllArticles(): Promise<ArticleEntry[]> {
  return createLocalizedContentLoaders().getAllArticles(DEFAULT_LOCALE);
}

export function getAllProjects(): Promise<ProjectEntry[]> {
  return createLocalizedContentLoaders().getAllProjects(DEFAULT_LOCALE);
}

export function getAllServices(): Promise<ServiceEntry[]> {
  return createLocalizedContentLoaders().getAllServices(DEFAULT_LOCALE);
}

export function getArticleBySlug(slug: string): Promise<ArticleEntry | undefined> {
  return createLocalizedContentLoaders().getArticleBySlug(slug, DEFAULT_LOCALE);
}

export function getProjectBySlug(slug: string): Promise<ProjectEntry | undefined> {
  return createLocalizedContentLoaders().getProjectBySlug(slug, DEFAULT_LOCALE);
}

export function getServiceBySlug(slug: string): Promise<ServiceEntry | undefined> {
  return createLocalizedContentLoaders().getServiceBySlug(slug, DEFAULT_LOCALE);
}
