# Sitewide Bilingual Transition Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full-site English/Chinese switching to `/Users/cherry_xiao/Developer/xiao12-top`, including localized content loading, persistent locale state, a compact `EN / 中` slider toggle, and sectional stagger transitions across all public routes.

**Architecture:** Keep locale as a first-class input to server-rendered content and metadata, resolved from `lang` query plus cookie. Introduce a small client-side transition layer only for the toggle, URL/cookie updates, and sectional motion triggers; keep actual content rendering and SEO on the server side. Split content into paired `.en.mdx` / `.zh.mdx` sources that share slugs, then thread locale through loaders, pages, and shared layout components.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, MDX via `gray-matter`, Zod, Vitest, React Testing Library, jsdom, git

---

## File Structure

Planned file map before implementation:

- Modify: `/Users/cherry_xiao/Developer/xiao12-top/package.json`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/vitest.config.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/test/setup.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/test/smoke.test.tsx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locales.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/resolve-locale.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-cookie.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-url.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/resolve-locale.test.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-url.test.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/schemas.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/loaders.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/selectors.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/loaders.test.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/content/site.ts`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.mdx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.en.mdx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.zh.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/articles/*.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/projects/*.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/services/*.mdx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/layout.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/about/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/articles/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/articles/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/projects/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/projects/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/services/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/services/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/not-found.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/metadata.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/LanguageToggle.tsx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/LanguageToggle.test.tsx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/transition/LocaleTransitionProvider.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/SiteHeader.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/MobileMenu.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/SiteFooter.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/HeroSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/FeaturedArticle.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/RecentStreamList.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/StatsSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ProjectGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ServiceGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/QuoteSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ContactSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/CollectionPageHeader.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/CollectionCardGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/StreamList.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ArticleDetailTemplate.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ProjectDetailTemplate.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ServiceDetailTemplate.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/globals.css`

Design rules locked by this structure:

- `src/lib/i18n/**` owns locale types, resolver, URL, and cookie logic.
- `src/lib/content/**` must accept locale explicitly and never assume a default language internally.
- `src/app/**` resolves locale once per request and passes it down.
- `LanguageToggle` owns interaction only; content rendering stays server-driven.
- Motion is driven by data attributes and CSS, not by per-page bespoke JavaScript.

## Chunk 1: Testing Baseline and Locale Infrastructure

### Task 1: Add a minimal test harness for locale and toggle work

**Files:**
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/package.json`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/vitest.config.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/test/setup.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/test/smoke.test.tsx`

- [ ] **Step 1: Install the smallest useful test toolchain**

Run:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Expected: dev dependencies are added without changing app runtime dependencies.

- [ ] **Step 2: Add explicit test scripts**

Update `package.json` to include:
- `test`: `vitest run`
- `test:watch`: `vitest`
- `engines.node`: explicit floor matching the installed Vitest/Vite toolchain

Expected: locale and component tests can be run independently from `lint`, `typecheck`, and `build`.

- [ ] **Step 3: Add Vitest config and shared DOM test setup**

Implement `vitest.config.ts` and `src/test/setup.ts` so:
- Vitest defaults to `node` for non-UI tests
- DOM/UI tests can opt into `jsdom`
- DOM/UI tests can import one shared setup module to load `@testing-library/jest-dom` and cleanup

- [ ] **Step 4: Verify the harness boots with a baseline smoke test**

Run:

```bash
npm run test
```

Expected: Vitest starts successfully and runs a minimal smoke test with exit code `0`.

- [ ] **Step 5: Commit the testing baseline**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/test/smoke.test.tsx
git commit -m "chore: add bilingual test baseline"
```

### Task 2: Build locale primitives before touching content or UI

**Files:**
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locales.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/resolve-locale.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-cookie.ts`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-url.ts`
- Test: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/resolve-locale.test.ts`
- Test: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/i18n/locale-url.test.ts`

- [ ] **Step 1: Write the failing locale resolver tests**

Cover:
- `lang` query beats cookie
- cookie beats default
- invalid values fall back to `en`
- helper constants only allow `en | zh`

- [ ] **Step 2: Run resolver tests to confirm failure**

Run:

```bash
npm run test -- src/lib/i18n/resolve-locale.test.ts
```

Expected: FAIL because resolver files do not exist yet.

- [ ] **Step 3: Implement locale constants and resolver**

Implement:
- `SUPPORTED_LOCALES`
- `DEFAULT_LOCALE`
- `isSupportedLocale`
- `resolveLocale({ searchParams, cookieLocale })`

- [ ] **Step 4: Write failing URL helper tests**

Cover:
- appending `lang=en`
- appending `lang=zh`
- replacing an existing `lang` param
- preserving unrelated query params and hashes

- [ ] **Step 5: Implement cookie and URL helpers**

Keep functions small and pure where possible:
- cookie name constant
- serialize locale cookie options
- build next URL for current pathname/search

- [ ] **Step 6: Run locale tests**

Run:

```bash
npm run test -- src/lib/i18n/resolve-locale.test.ts src/lib/i18n/locale-url.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit the locale primitives**

```bash
git add src/lib/i18n
git commit -m "feat: add locale resolution primitives"
```

## Chunk 2: Localized Content Model

### Task 3: Extend content schemas and loaders to understand locale-paired files

**Files:**
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/schemas.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/loaders.ts`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/selectors.ts`
- Test: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/content/loaders.test.ts`

- [ ] **Step 1: Write the failing loader tests**

Cover:
- selecting `article-01.en.mdx` for `locale=en`
- selecting `article-01.zh.mdx` for `locale=zh`
- matching the same slug across locales
- throwing a useful error when a requested locale file is missing

- [ ] **Step 2: Run loader tests to verify failure**

Run:

```bash
npm run test -- src/lib/content/loaders.test.ts
```

Expected: FAIL because the loader still assumes one `.mdx` file per entry.

- [ ] **Step 3: Add locale fields to the content types**

Update frontmatter and entry types so each entry includes:
- `locale`
- `translationKey`

Keep `slug` stable across both languages.

- [ ] **Step 4: Refactor the file reader**

Teach the loader to:
- parse file names like `article-01.en.mdx`
- infer locale from file name
- reject unsupported locale suffixes
- filter collections by explicit locale
- expose `getAllArticles(locale)`, `getArticleBySlug(slug, locale)` style APIs

- [ ] **Step 5: Keep selectors locale-agnostic**

Selectors should continue sorting entries exactly as today; the only change is that callers now provide already-localized entry arrays.

- [ ] **Step 6: Run loader and locale tests together**

Run:

```bash
npm run test -- src/lib/i18n/resolve-locale.test.ts src/lib/i18n/locale-url.test.ts src/lib/content/loaders.test.ts
```

Expected: PASS

- [ ] **Step 7: Commit the localized content layer**

```bash
git add src/lib/content src/lib/i18n
git commit -m "feat: localize content loaders"
```

### Task 4: Split all content into English/Chinese pairs

**Files:**
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/content/site.ts`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.mdx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.en.mdx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/content/about.zh.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/articles/*.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/projects/*.mdx`
- Replace: `/Users/cherry_xiao/Developer/xiao12-top/src/content/services/*.mdx`

- [ ] **Step 1: Convert `site.ts` into a locale dictionary**

Restructure shell copy so `getSiteContent(locale)` can return:
- localized navigation
- localized footer
- localized hero subtitle and meta labels
- localized stats labels/notes
- localized quote
- localized contact content

- [ ] **Step 2: Split `about` into paired files**

Create:
- `src/content/about.en.mdx`
- `src/content/about.zh.mdx`

Delete the old single-language `src/content/about.mdx` after both new files are in place.

- [ ] **Step 3: Duplicate and translate article seed entries**

For each existing article seed:
- keep the same `slug`
- add `locale` and `translationKey`
- write a Chinese title, summary, and body

- [ ] **Step 4: Duplicate and translate project and service seed entries**

Apply the same paired-file rule to:
- `src/content/projects/*.mdx`
- `src/content/services/*.mdx`

- [ ] **Step 5: Sanity-check the content layer with a build-level type pass**

Run:

```bash
npm run typecheck
```

Expected: all localized content files parse cleanly under the updated schemas.

- [ ] **Step 6: Commit the bilingual seed content**

```bash
git add src/content
git commit -m "feat: add bilingual seed content"
```

## Chunk 3: Route, Metadata, and Toggle Integration

### Task 5: Thread locale through layout, pages, and metadata

**Files:**
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/layout.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/about/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/articles/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/articles/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/projects/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/projects/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/services/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/services/[slug]/page.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/not-found.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/lib/metadata.ts`

- [ ] **Step 1: Read locale in App Router entry points**

Update layout and route files to resolve locale from:
- `searchParams`
- cookies

Use the shared resolver instead of duplicating fallback logic.

- [ ] **Step 2: Localize home and list pages**

Switch calls from:
- `getSiteContent()`
- `getAllArticles()`
- `getAllProjects()`
- `getAllServices()`

to locale-aware forms.

- [ ] **Step 3: Localize detail pages and `generateMetadata`**

Update each detail route so:
- `generateMetadata` reads the same locale as the page render
- `get*BySlug(slug, locale)` is the only source of truth
- missing localized entries call `notFound()`

- [ ] **Step 4: Localize `not-found` and shared metadata strings**

Ensure:
- 404 copy follows current locale
- canonical and OG metadata descriptions use localized text where available

- [ ] **Step 5: Verify the localized server render compiles**

Run:

```bash
npm run typecheck
npm run build
```

Expected: all public routes build successfully with locale-aware loaders and metadata.

- [ ] **Step 6: Commit the localized route integration**

```bash
git add src/app src/lib/metadata.ts
git commit -m "feat: localize app routes and metadata"
```

### Task 6: Add the compact `EN / 中` slider toggle and persistent switching behavior

**Files:**
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/LanguageToggle.tsx`
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/LanguageToggle.test.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/SiteHeader.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/MobileMenu.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/layout/SiteFooter.tsx`

- [ ] **Step 1: Write the failing toggle test**

Cover:
- rendering `EN / 中`
- highlighting the active locale
- updating the URL with `lang=...`
- persisting the locale cookie

- [ ] **Step 2: Run the toggle test to verify failure**

Run:

```bash
npm run test -- src/components/layout/LanguageToggle.test.tsx
```

Expected: FAIL because the component does not exist yet.

- [ ] **Step 3: Implement the compact toggle**

Build a client component that:
- accepts `locale`
- uses the URL helper to compute the next URL
- writes the locale cookie
- wraps navigation in `document.startViewTransition?.(...)` when available
- respects `prefers-reduced-motion`

- [ ] **Step 4: Place the toggle in desktop and mobile navigation**

Update:
- `SiteHeader` to render the toggle immediately after `Contact`
- `MobileMenu` to show the same toggle in the top visible menu area
- `SiteFooter` only if needed for locale continuity cues; otherwise leave footer passive

- [ ] **Step 5: Run toggle and locale tests**

Run:

```bash
npm run test -- src/components/layout/LanguageToggle.test.tsx src/lib/i18n/resolve-locale.test.ts src/lib/i18n/locale-url.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit the toggle integration**

```bash
git add src/components/layout src/lib/i18n
git commit -m "feat: add bilingual language toggle"
```

## Chunk 4: Sectional Motion and Final Verification

### Task 7: Add sectional stagger transitions across shared templates

**Files:**
- Create: `/Users/cherry_xiao/Developer/xiao12-top/src/components/transition/LocaleTransitionProvider.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/layout.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/app/globals.css`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/HeroSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/FeaturedArticle.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/RecentStreamList.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/StatsSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ProjectGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ServiceGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/QuoteSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/home/ContactSection.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/CollectionPageHeader.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/CollectionCardGrid.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/list/StreamList.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ArticleDetailTemplate.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ProjectDetailTemplate.tsx`
- Modify: `/Users/cherry_xiao/Developer/xiao12-top/src/components/detail/ServiceDetailTemplate.tsx`

- [ ] **Step 1: Add a transition provider that marks switching state**

Use a tiny client wrapper to:
- add root-level `data-locale` and `data-locale-switching`
- expose the previous/next locale for CSS selectors
- no-op safely when `startViewTransition` is unavailable

- [ ] **Step 2: Mark shared page regions explicitly**

Add stable `data-locale-region` values such as:
- `header`
- `page-header`
- `main`
- `side`
- `footer`

Do this in shared components so every route inherits the same motion grammar.

- [ ] **Step 3: Implement the `B` motion in CSS**

Add CSS that:
- compresses outgoing English slightly
- lets incoming Chinese land slightly wider/heavier
- staggers regions with short delays
- reduces blur/offset when reduced motion is enabled

- [ ] **Step 4: Verify the UI still compiles after motion attributes**

Run:

```bash
npm run lint
npm run typecheck
```

Expected: PASS

- [ ] **Step 5: Commit the transition layer**

```bash
git add src/components/transition src/components/home src/components/list src/components/detail src/app/globals.css src/app/layout.tsx
git commit -m "feat: add bilingual sectional transitions"
```

### Task 8: Run the full proof pack and manual QA

**Files:**
- Modify if needed: any files touched in Tasks 1-7

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands pass.

- [ ] **Step 2: Run the local dev server for manual QA**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 4321
```

Expected: site is available at `http://127.0.0.1:4321`.

- [ ] **Step 3: Manually verify desktop routes**

Check:
1. Home page toggle updates URL and persists after refresh
2. About page switches title, summary, and body
3. Article/project/service list pages switch labels and summaries
4. Detail pages switch body language while keeping the same slug

- [ ] **Step 4: Manually verify mobile and motion behavior**

Check:
1. Mobile menu shows the compact `EN / 中` toggle near the top
2. Toggle feels tight, not CTA-sized
3. Header, page header, main, and side regions hand off in sequence
4. Reduced motion mode removes heavy blur and large offsets

- [ ] **Step 5: Capture proof before final delivery**

Record:
- exact test/build outputs
- one desktop screenshot
- one mobile screenshot
- any remaining gaps, especially around untranslated content

- [ ] **Step 6: Commit the finished implementation**

```bash
git add .
git commit -m "feat: add sitewide bilingual switching"
```

## Execution Notes

- Do not commit `.superpowers/` artifacts.
- Keep existing slugs stable across both locales.
- If a localized entry is missing during implementation, fail loudly in development rather than silently falling back.
- Prefer small commits at the end of each task as listed above.

**Plan complete and saved to `docs/superpowers/plans/2026-06-20-sitewide-bilingual-transition-implementation.md`. Ready to execute?**
