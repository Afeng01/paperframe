import type { ArticleEntry } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { formatDisplayDate } from "@/lib/utils/format";
import { LocalizedLink } from "@/components/shared/LocalizedLink";

type RecentStreamListProps = {
  articles: ArticleEntry[];
  locale: Locale;
};

const RECENT_STREAM_COPY = {
  en: {
    eyebrow: "Stream",
    title: "Recent notes and",
    titleBreak: "working thoughts",
    summary: "Ordered by date. Seed content now, real archive later.",
    ctaLabel: "View all",
  },
  zh: {
    eyebrow: "流",
    title: "最近的记录与",
    titleBreak: "正在成形的想法",
    summary: "按时间排序。现在先放占位内容，之后再替换成真实归档。",
    ctaLabel: "查看全部",
  },
} as const;

export function RecentStreamList({ articles, locale }: RecentStreamListProps) {
  const copy = RECENT_STREAM_COPY[locale];

  return (
    <section
      className="bg-stone-950 text-stone-100"
      data-locale-region="main"
      data-locale-solid-surface="dark"
      data-locale-stagger="2"
    >
      <div
        className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8"
        data-locale-surface-content="true"
      >
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-locale-region="side" data-locale-stagger="3">
            <div className="mb-4 text-[11px] uppercase tracking-[0.24em] text-stone-500">
              {copy.eyebrow}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] text-4xl leading-[1.1] text-white sm:text-5xl">
              {copy.title}
              <br />
              {copy.titleBreak}
            </h2>
            <p className="mt-6 max-w-xs font-[family-name:var(--font-serif)] text-sm leading-relaxed text-stone-400">
              {copy.summary}
            </p>
            <LocalizedLink
              className="mt-8 inline-flex items-center gap-2 border-b border-stone-700 pb-1 text-[11px] uppercase tracking-[0.24em] text-stone-300 transition-colors hover:border-stone-300 hover:text-white"
              locale={locale}
              href="/articles"
            >
              {copy.ctaLabel}
            </LocalizedLink>
          </div>
          <ol className="space-y-px bg-stone-800/40 lg:col-span-8">
            {articles.map((article, index) => (
              <li key={article.slug} className="bg-stone-950">
                <LocalizedLink
                  className="group block px-1 py-6 transition-[padding] duration-300 hover:px-3"
                  locale={locale}
                  href={`/articles/${article.slug}`}
                >
                  <div className="grid grid-cols-12 items-baseline gap-4">
                    <div className="col-span-2 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-3 text-[11px] text-stone-500">
                      {formatDisplayDate(article.date, locale)}
                    </div>
                    <div className="col-span-7">
                      <h3 className="font-[family-name:var(--font-serif)] text-xl leading-snug text-stone-100 transition-colors group-hover:text-white">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-stone-500">{article.summary}</p>
                    </div>
                  </div>
                </LocalizedLink>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
