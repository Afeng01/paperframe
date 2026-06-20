import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { siteContent } from "@/content/site";
import {
  aboutFrontmatterSchema,
  articleFrontmatterSchema,
  projectFrontmatterSchema,
  serviceFrontmatterSchema,
  type AboutEntry,
  type ArticleEntry,
  type LocalizedContentFields,
  type ProjectEntry,
  type ServiceEntry,
  type SiteContent,
} from "@/lib/content/schemas";
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/lib/i18n/locales";

const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const MDX_EXTENSION = ".mdx";
const LOCALE_SUFFIX_PATTERN = /^[a-z]{2}(?:-[a-z]{2})?$/i;

type ContentEntry<T> = T & LocalizedContentFields & { body: string };
type FrontmatterParser<T> = (value: unknown) => T;

interface ParsedFileName {
  locale: Locale;
  translationKey: string;
}

export interface ContentLoaders {
  getSiteContent(): Promise<SiteContent>;
  getAboutEntry(locale: Locale): Promise<AboutEntry>;
  getAllArticles(locale: Locale): Promise<ArticleEntry[]>;
  getAllProjects(locale: Locale): Promise<ProjectEntry[]>;
  getAllServices(locale: Locale): Promise<ServiceEntry[]>;
  getArticleBySlug(slug: string, locale: Locale): Promise<ArticleEntry | undefined>;
  getProjectBySlug(slug: string, locale: Locale): Promise<ProjectEntry | undefined>;
  getServiceBySlug(slug: string, locale: Locale): Promise<ServiceEntry | undefined>;
}

function parseContentFileName(fileName: string): ParsedFileName {
  if (!fileName.endsWith(MDX_EXTENSION)) {
    throw new Error(`Unsupported content file "${fileName}"`);
  }

  const baseName = fileName.slice(0, -MDX_EXTENSION.length);
  const lastDotIndex = baseName.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return {
      locale: DEFAULT_LOCALE,
      translationKey: baseName,
    };
  }

  const translationKey = baseName.slice(0, lastDotIndex);
  const localeSuffix = baseName.slice(lastDotIndex + 1);

  if (isSupportedLocale(localeSuffix)) {
    return {
      locale: localeSuffix,
      translationKey,
    };
  }

  if (LOCALE_SUFFIX_PATTERN.test(localeSuffix)) {
    throw new Error(`Unsupported locale suffix "${localeSuffix}" in content file "${fileName}"`);
  }

  return {
    locale: DEFAULT_LOCALE,
    translationKey: baseName,
  };
}

async function readEntryFile<T>(
  directoryPath: string,
  fileName: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<ContentEntry<T>> {
  const fullPath = path.join(directoryPath, fileName);
  const source = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(source);
  const { locale, translationKey } = parseContentFileName(fileName);

  return {
    ...parseFrontmatter(data),
    locale,
    translationKey,
    body: content.trim(),
  };
}

async function readCollectionEntries<T>(
  contentRoot: string,
  directory: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<Array<ContentEntry<T>>> {
  const collectionDirectory = path.join(contentRoot, directory);
  const fileNames = (await fs.readdir(collectionDirectory)).filter((fileName) =>
    fileName.endsWith(MDX_EXTENSION),
  );

  return Promise.all(
    fileNames.map((fileName) => readEntryFile(collectionDirectory, fileName, parseFrontmatter)),
  );
}

async function readNamedEntries<T>(
  contentRoot: string,
  entryName: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<Array<ContentEntry<T>>> {
  const fileNames = (await fs.readdir(contentRoot)).filter((fileName) => {
    if (!fileName.endsWith(MDX_EXTENSION)) {
      return false;
    }

    return fileName === `${entryName}${MDX_EXTENSION}` || fileName.startsWith(`${entryName}.`);
  });

  return Promise.all(fileNames.map((fileName) => readEntryFile(contentRoot, fileName, parseFrontmatter)));
}

function filterEntriesByLocale<T extends LocalizedContentFields>(
  entries: T[],
  locale: Locale,
): T[] {
  return entries.filter((entry) => entry.locale === locale);
}

function requireLocale(locale: Locale | undefined, loaderName: string): Locale {
  if (locale) {
    return locale;
  }

  throw new Error(`Locale is required for localized content loader "${loaderName}"`);
}

function createMissingLocaleError(
  collection: string,
  slug: string,
  locale: Locale,
  availableLocales: Locale[],
): Error {
  const locales = Array.from(new Set(availableLocales)).sort().join(", ");

  return new Error(
    `Missing locale "${locale}" for ${collection} slug "${slug}". Available locales: ${locales}.`,
  );
}

function createSlugMismatchError(
  collection: string,
  translationKey: string,
  expectedSlug: string,
  locale: Locale,
  actualSlug: string,
): Error {
  return new Error(
    `Slug mismatch for ${collection} translationKey "${translationKey}": expected slug "${expectedSlug}", but locale "${locale}" uses "${actualSlug}".`,
  );
}

function assertStableLocalizedSlugs<T extends LocalizedContentFields & { slug: string }>(
  entries: T[],
  collection: string,
): void {
  const slugByTranslationKey = new Map<string, { locale: Locale; slug: string }>();

  for (const entry of entries) {
    const existing = slugByTranslationKey.get(entry.translationKey);

    if (!existing) {
      slugByTranslationKey.set(entry.translationKey, {
        locale: entry.locale,
        slug: entry.slug,
      });
      continue;
    }

    if (existing.slug !== entry.slug) {
      throw createSlugMismatchError(
        collection,
        entry.translationKey,
        existing.slug,
        entry.locale,
        entry.slug,
      );
    }
  }
}

function findEntryBySlug<T extends LocalizedContentFields & { slug: string }>(
  entries: T[],
  collection: string,
  slug: string,
  locale: Locale,
): T | undefined {
  const localizedEntry = entries.find((entry) => entry.slug === slug && entry.locale === locale);

  if (localizedEntry) {
    return localizedEntry;
  }

  const siblingLocales = entries
    .filter((entry) => entry.slug === slug)
    .map((entry) => entry.locale);

  if (siblingLocales.length > 0) {
    throw createMissingLocaleError(collection, slug, locale, siblingLocales);
  }

  return undefined;
}

export function createContentLoaders(contentRoot = DEFAULT_CONTENT_ROOT): ContentLoaders {
  return {
    async getSiteContent() {
      return siteContent;
    },

    async getAboutEntry(locale) {
      const requestedLocale = requireLocale(locale, "getAboutEntry");
      const entries = await readNamedEntries(contentRoot, "about", (value) =>
        aboutFrontmatterSchema.parse(value),
      );
      const localizedEntry = entries.find((entry) => entry.locale === requestedLocale);

      if (localizedEntry) {
        return localizedEntry;
      }

      const availableLocales = entries.map((entry) => entry.locale);

      if (availableLocales.length > 0) {
        throw createMissingLocaleError("about", "about", requestedLocale, availableLocales);
      }

      throw new Error('Missing content entry "about"');
    },

    async getAllArticles(locale) {
      const requestedLocale = requireLocale(locale, "getAllArticles");
      const entries = await readCollectionEntries(contentRoot, "articles", (value) =>
        articleFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "articles");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getAllProjects(locale) {
      const requestedLocale = requireLocale(locale, "getAllProjects");
      const entries = await readCollectionEntries(contentRoot, "projects", (value) =>
        projectFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "projects");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getAllServices(locale) {
      const requestedLocale = requireLocale(locale, "getAllServices");
      const entries = await readCollectionEntries(contentRoot, "services", (value) =>
        serviceFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "services");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getArticleBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getArticleBySlug");
      const entries = await readCollectionEntries(contentRoot, "articles", (value) =>
        articleFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "articles");

      return findEntryBySlug(entries, "articles", slug, requestedLocale);
    },

    async getProjectBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getProjectBySlug");
      const entries = await readCollectionEntries(contentRoot, "projects", (value) =>
        projectFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "projects");

      return findEntryBySlug(entries, "projects", slug, requestedLocale);
    },

    async getServiceBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getServiceBySlug");
      const entries = await readCollectionEntries(contentRoot, "services", (value) =>
        serviceFrontmatterSchema.parse(value),
      );
      assertStableLocalizedSlugs(entries, "services");

      return findEntryBySlug(entries, "services", slug, requestedLocale);
    },
  };
}

const defaultLoaders = createContentLoaders();

export const getSiteContent = defaultLoaders.getSiteContent;

export function getAboutEntry(): Promise<AboutEntry> {
  return defaultLoaders.getAboutEntry(DEFAULT_LOCALE);
}

export function getAllArticles(): Promise<ArticleEntry[]> {
  return defaultLoaders.getAllArticles(DEFAULT_LOCALE);
}

export function getAllProjects(): Promise<ProjectEntry[]> {
  return defaultLoaders.getAllProjects(DEFAULT_LOCALE);
}

export function getAllServices(): Promise<ServiceEntry[]> {
  return defaultLoaders.getAllServices(DEFAULT_LOCALE);
}

export function getArticleBySlug(slug: string): Promise<ArticleEntry | undefined> {
  return defaultLoaders.getArticleBySlug(slug, DEFAULT_LOCALE);
}

export function getProjectBySlug(slug: string): Promise<ProjectEntry | undefined> {
  return defaultLoaders.getProjectBySlug(slug, DEFAULT_LOCALE);
}

export function getServiceBySlug(slug: string): Promise<ServiceEntry | undefined> {
  return defaultLoaders.getServiceBySlug(slug, DEFAULT_LOCALE);
}
