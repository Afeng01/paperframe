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

type ContentEntry<T> = T & LocalizedContentFields & { body: string };
type InternalContentEntry<T> = ContentEntry<T> & { sourceFileName: string };
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

  throw new Error(`Unsupported locale suffix "${localeSuffix}" in content file "${fileName}"`);
}

async function readEntryFile<T>(
  directoryPath: string,
  fileName: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<InternalContentEntry<T>> {
  const fullPath = path.join(directoryPath, fileName);
  const source = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(source);
  const { locale, translationKey } = parseContentFileName(fileName);

  return {
    ...parseFrontmatter(data),
    locale,
    translationKey,
    body: content.trim(),
    sourceFileName: fileName,
  };
}

async function readCollectionEntries<T>(
  contentRoot: string,
  directory: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<Array<InternalContentEntry<T>>> {
  const collectionDirectory = path.join(contentRoot, directory);
  const fileNames = (await fs.readdir(collectionDirectory)).filter((fileName) =>
    fileName.endsWith(MDX_EXTENSION),
  );

  return Promise.all(
    fileNames.map((fileName) => readEntryFile(collectionDirectory, fileName, parseFrontmatter)),
  );
}

function isNamedEntryFile(fileName: string, entryName: string): boolean {
  if (!fileName.endsWith(MDX_EXTENSION)) {
    return false;
  }

  return fileName === `${entryName}${MDX_EXTENSION}` || fileName.startsWith(`${entryName}.`);
}

function assertValidNamedEntryFileName(fileName: string, entryName: string): void {
  if (fileName === `${entryName}${MDX_EXTENSION}`) {
    return;
  }

  const baseName = fileName.slice(0, -MDX_EXTENSION.length);

  if (!baseName.startsWith(`${entryName}.`)) {
    throw new Error(`Unsupported singleton content file "${fileName}" for entry "${entryName}"`);
  }

  const suffix = baseName.slice(entryName.length + 1);

  if (!isSupportedLocale(suffix)) {
    throw new Error(`Unsupported singleton content file "${fileName}" for entry "${entryName}"`);
  }
}

async function readNamedEntries<T>(
  contentRoot: string,
  entryName: string,
  parseFrontmatter: FrontmatterParser<T>,
): Promise<Array<InternalContentEntry<T>>> {
  const fileNames = (await fs.readdir(contentRoot)).filter((fileName) =>
    isNamedEntryFile(fileName, entryName),
  );

  for (const fileName of fileNames) {
    assertValidNamedEntryFileName(fileName, entryName);
  }

  return Promise.all(fileNames.map((fileName) => readEntryFile(contentRoot, fileName, parseFrontmatter)));
}

function filterEntriesByLocale<T extends LocalizedContentFields>(
  entries: T[],
  locale: Locale,
): T[] {
  return entries.filter((entry) => entry.locale === locale);
}

function requireLocale(locale: string | undefined, loaderName: string): Locale {
  if (locale == null) {
    throw new Error(`Locale is required for localized content loader "${loaderName}"`);
  }

  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale "${locale}" for localized content loader "${loaderName}"`);
  }

  return locale;
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

function createDuplicateLocalizedEntryError(
  collection: string,
  translationKey: string,
  locale: Locale,
  firstFileName: string,
  duplicateFileName: string,
): Error {
  return new Error(
    `Duplicate localized entry for ${collection} translationKey "${translationKey}" and locale "${locale}": "${firstFileName}" conflicts with "${duplicateFileName}".`,
  );
}

function assertUniqueLocalizedEntries<T extends LocalizedContentFields & { sourceFileName: string }>(
  entries: T[],
  collection: string,
): void {
  const seenEntries = new Map<string, string>();

  for (const entry of entries) {
    const key = `${entry.translationKey}::${entry.locale}`;
    const existingFileName = seenEntries.get(key);

    if (existingFileName) {
      throw createDuplicateLocalizedEntryError(
        collection,
        entry.translationKey,
        entry.locale,
        existingFileName,
        entry.sourceFileName,
      );
    }

    seenEntries.set(key, entry.sourceFileName);
  }
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

function createDuplicateSlugError(
  collection: string,
  slug: string,
  locale: Locale,
  firstTranslationKey: string,
  duplicateTranslationKey: string,
): Error {
  return new Error(
    `Duplicate slug "${slug}" for ${collection} locale "${locale}": translationKey "${firstTranslationKey}" conflicts with "${duplicateTranslationKey}".`,
  );
}

function assertUniqueSlugsPerLocale<
  T extends LocalizedContentFields & { slug: string; translationKey: string },
>(entries: T[], collection: string): void {
  const slugByLocale = new Map<string, string>();

  for (const entry of entries) {
    const key = `${entry.locale}::${entry.slug}`;
    const existingTranslationKey = slugByLocale.get(key);

    if (existingTranslationKey && existingTranslationKey !== entry.translationKey) {
      throw createDuplicateSlugError(
        collection,
        entry.slug,
        entry.locale,
        existingTranslationKey,
        entry.translationKey,
      );
    }

    slugByLocale.set(key, entry.translationKey);
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
  const collectionCache = new Map<string, Promise<unknown>>();
  const namedEntryCache = new Map<string, Promise<unknown>>();

  async function loadCollection<T>(
    directory: string,
    parseFrontmatter: FrontmatterParser<T>,
  ): Promise<Array<InternalContentEntry<T>>> {
    const cacheKey = `collection:${directory}`;
    const cachedEntries = collectionCache.get(cacheKey) as
      | Promise<Array<InternalContentEntry<T>>>
      | undefined;

    if (cachedEntries) {
      return cachedEntries;
    }

    const entriesPromise = readCollectionEntries(contentRoot, directory, parseFrontmatter);
    collectionCache.set(cacheKey, entriesPromise);

    return entriesPromise;
  }

  async function loadNamedEntry<T>(
    entryName: string,
    parseFrontmatter: FrontmatterParser<T>,
  ): Promise<Array<InternalContentEntry<T>>> {
    const cacheKey = `named:${entryName}`;
    const cachedEntries = namedEntryCache.get(cacheKey) as
      | Promise<Array<InternalContentEntry<T>>>
      | undefined;

    if (cachedEntries) {
      return cachedEntries;
    }

    const entriesPromise = readNamedEntries(contentRoot, entryName, parseFrontmatter);
    namedEntryCache.set(cacheKey, entriesPromise);

    return entriesPromise;
  }

  return {
    async getSiteContent() {
      return siteContent;
    },

    async getAboutEntry(locale) {
      const requestedLocale = requireLocale(locale, "getAboutEntry");
      const entries = await loadNamedEntry("about", (value) =>
        aboutFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "about");
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
      const entries = await loadCollection("articles", (value) =>
        articleFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "articles");
      assertStableLocalizedSlugs(entries, "articles");
      assertUniqueSlugsPerLocale(entries, "articles");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getAllProjects(locale) {
      const requestedLocale = requireLocale(locale, "getAllProjects");
      const entries = await loadCollection("projects", (value) =>
        projectFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "projects");
      assertStableLocalizedSlugs(entries, "projects");
      assertUniqueSlugsPerLocale(entries, "projects");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getAllServices(locale) {
      const requestedLocale = requireLocale(locale, "getAllServices");
      const entries = await loadCollection("services", (value) =>
        serviceFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "services");
      assertStableLocalizedSlugs(entries, "services");
      assertUniqueSlugsPerLocale(entries, "services");

      return filterEntriesByLocale(entries, requestedLocale);
    },

    async getArticleBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getArticleBySlug");
      const entries = await loadCollection("articles", (value) =>
        articleFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "articles");
      assertStableLocalizedSlugs(entries, "articles");
      assertUniqueSlugsPerLocale(entries, "articles");

      return findEntryBySlug(entries, "articles", slug, requestedLocale);
    },

    async getProjectBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getProjectBySlug");
      const entries = await loadCollection("projects", (value) =>
        projectFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "projects");
      assertStableLocalizedSlugs(entries, "projects");
      assertUniqueSlugsPerLocale(entries, "projects");

      return findEntryBySlug(entries, "projects", slug, requestedLocale);
    },

    async getServiceBySlug(slug, locale) {
      const requestedLocale = requireLocale(locale, "getServiceBySlug");
      const entries = await loadCollection("services", (value) =>
        serviceFrontmatterSchema.parse(value),
      );
      assertUniqueLocalizedEntries(entries, "services");
      assertStableLocalizedSlugs(entries, "services");
      assertUniqueSlugsPerLocale(entries, "services");

      return findEntryBySlug(entries, "services", slug, requestedLocale);
    },
  };
}

// These top-level exports are legacy compatibility shims for the current route layer only.
// New callers should prefer createContentLoaders(...), which requires an explicit locale.
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
