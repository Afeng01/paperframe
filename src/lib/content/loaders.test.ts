import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createContentLoaders } from "@/lib/content/loaders";

const articleFrontmatter = {
  summary: "Fixture summary",
  date: "2026-06-20",
  category: "Notes",
};

const temporaryDirectories: string[] = [];

async function createContentRoot(): Promise<string> {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "xiao12-top-content-"));

  temporaryDirectories.push(directory);
  await fs.mkdir(path.join(directory, "articles"), { recursive: true });

  return directory;
}

async function writeArticleFixture(
  contentRoot: string,
  fileName: string,
  overrides: Record<string, unknown> = {},
): Promise<void> {
  const frontmatter = {
    title: "Fixture article",
    slug: "shared-article",
    ...articleFrontmatter,
    ...overrides,
  };

  const source = `---
title: ${frontmatter.title}
slug: ${frontmatter.slug}
summary: ${frontmatter.summary}
date: ${frontmatter.date}
category: ${frontmatter.category}
---

Fixture body for ${fileName}
`;

  await fs.writeFile(path.join(contentRoot, "articles", fileName), source, "utf8");
}

async function writeAboutFixture(
  contentRoot: string,
  fileName: string,
  overrides: Record<string, unknown> = {},
): Promise<void> {
  const frontmatter = {
    title: "About fixture",
    summary: "About summary",
    ...overrides,
  };

  const source = `---
title: ${frontmatter.title}
summary: ${frontmatter.summary}
---

About body for ${fileName}
`;

  await fs.writeFile(path.join(contentRoot, fileName), source, "utf8");
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      fs.rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("content loaders", () => {
  it("requires an explicit locale in the core loader API", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx");

    const loaders = createContentLoaders(contentRoot);

    await expect(
      (loaders.getAllArticles as unknown as () => Promise<unknown>)(),
    ).rejects.toThrow('Locale is required for localized content loader "getAllArticles"');
  });

  it("selects article-01.en.mdx for locale en", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      title: "English article",
    });
    await writeArticleFixture(contentRoot, "article-01.zh.mdx", {
      title: "Chinese article",
    });

    const loaders = createContentLoaders(contentRoot);
    const articles = await loaders.getAllArticles("en");

    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      title: "English article",
      slug: "shared-article",
      locale: "en",
      translationKey: "article-01",
    });
  });

  it("selects article-01.zh.mdx for locale zh", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      title: "English article",
    });
    await writeArticleFixture(contentRoot, "article-01.zh.mdx", {
      title: "Chinese article",
    });

    const loaders = createContentLoaders(contentRoot);
    const articles = await loaders.getAllArticles("zh");

    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      title: "Chinese article",
      slug: "shared-article",
      locale: "zh",
      translationKey: "article-01",
    });
  });

  it("rejects duplicate default-locale siblings for the same translation key", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.mdx", {
      title: "Default locale article",
    });
    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      title: "Explicit English article",
    });

    const loaders = createContentLoaders(contentRoot);

    await expect(loaders.getAllArticles("en")).rejects.toThrow(
      'Duplicate localized entry for articles translationKey "article-01" and locale "en"',
    );
  });

  it("rejects malformed collection locale suffixes instead of treating them as default locale", async () => {
    for (const suffix of ["zh_CN", "zhHans"]) {
      const contentRoot = await createContentRoot();

      await writeArticleFixture(contentRoot, `article-01.${suffix}.mdx`);

      const loaders = createContentLoaders(contentRoot);

      await expect(loaders.getAllArticles("en")).rejects.toThrow(
        `Unsupported locale suffix "${suffix}" in content file "article-01.${suffix}.mdx"`,
      );
    }
  });

  it("memoizes parsed collection entries per loader instance", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx");
    await writeArticleFixture(contentRoot, "article-01.zh.mdx");

    const readFileSpy = vi.spyOn(fs, "readFile");
    const loaders = createContentLoaders(contentRoot);

    try {
      await loaders.getAllArticles("en");
      await loaders.getArticleBySlug("shared-article", "zh");

      expect(readFileSpy).toHaveBeenCalledTimes(2);
    } finally {
      readFileSpy.mockRestore();
    }
  });

  it("matches the same slug across locales", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      title: "English article",
    });
    await writeArticleFixture(contentRoot, "article-01.zh.mdx", {
      title: "Chinese article",
    });

    const loaders = createContentLoaders(contentRoot);
    const englishEntry = await loaders.getArticleBySlug("shared-article", "en");
    const chineseEntry = await loaders.getArticleBySlug("shared-article", "zh");

    expect(englishEntry).toMatchObject({
      slug: "shared-article",
      locale: "en",
      translationKey: "article-01",
    });
    expect(chineseEntry).toMatchObject({
      slug: "shared-article",
      locale: "zh",
      translationKey: "article-01",
    });
  });

  it("throws a useful error when the requested locale file is missing", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      title: "English article",
    });

    const loaders = createContentLoaders(contentRoot);

    await expect(loaders.getArticleBySlug("shared-article", "zh")).rejects.toThrow(
      'Missing locale "zh" for articles slug "shared-article"',
    );
  });

  it("throws a clear error when locale siblings drift on slug", async () => {
    const contentRoot = await createContentRoot();

    await writeArticleFixture(contentRoot, "article-01.en.mdx", {
      slug: "shared-article",
    });
    await writeArticleFixture(contentRoot, "article-01.zh.mdx", {
      slug: "different-article",
    });

    const loaders = createContentLoaders(contentRoot);

    await expect(loaders.getAllArticles("en")).rejects.toThrow(
      'Slug mismatch for articles translationKey "article-01"',
    );
  });

  it("rejects unsupported singleton suffixes instead of treating them as english about content", async () => {
    const contentRoot = await createContentRoot();

    await writeAboutFixture(contentRoot, "about.mdx");
    await writeAboutFixture(contentRoot, "about.draft.mdx", {
      title: "Draft about",
    });

    const loaders = createContentLoaders(contentRoot);

    await expect(loaders.getAboutEntry("en")).rejects.toThrow(
      'Unsupported singleton content file "about.draft.mdx" for entry "about"',
    );
  });
});
