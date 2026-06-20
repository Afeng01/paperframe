import type { ArticleEntry, ProjectEntry, ServiceEntry } from "@/lib/content/schemas";

// Callers are expected to pass entries that are already filtered to a single locale.
function sortByDateDescending<T extends { date?: string }>(entries: T[]): T[] {
  return [...entries].sort((left, right) => {
    const leftValue = left.date ? new Date(left.date).getTime() : 0;
    const rightValue = right.date ? new Date(right.date).getTime() : 0;

    return rightValue - leftValue;
  });
}

function sortProjects(entries: ProjectEntry[]): ProjectEntry[] {
  return [...entries].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

function sortServices(entries: ServiceEntry[]): ServiceEntry[] {
  return [...entries].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.slug.localeCompare(right.slug);
  });
}

export function selectFeaturedArticle(entries: ArticleEntry[]): ArticleEntry {
  const featuredEntry = sortByDateDescending(entries).find((entry) => entry.featured);

  return featuredEntry ?? sortByDateDescending(entries)[0];
}

export function selectRecentArticles(entries: ArticleEntry[], limit = 5): ArticleEntry[] {
  return sortByDateDescending(entries).slice(0, limit);
}

export function selectOrderedProjects(entries: ProjectEntry[], limit?: number): ProjectEntry[] {
  const ordered = sortProjects(entries);

  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export function selectOrderedServices(entries: ServiceEntry[], limit?: number): ServiceEntry[] {
  const ordered = sortServices(entries);

  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export function selectArticleList(entries: ArticleEntry[]): ArticleEntry[] {
  return sortByDateDescending(entries);
}
