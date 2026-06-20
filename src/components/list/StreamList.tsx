import type { ArticleEntry } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { formatDisplayDate } from "@/lib/utils/format";

type StreamListProps = {
  articles: ArticleEntry[];
  locale: Locale;
};

export function StreamList({ articles, locale }: StreamListProps) {
  return (
    <ol className="space-y-px bg-stone-200">
      {articles.map((article, index) => (
        <li key={article.slug} className="bg-white">
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
                <h2 className="font-[family-name:var(--font-serif)] text-xl leading-snug text-stone-950 transition-colors group-hover:text-stone-600">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-stone-500">{article.summary}</p>
              </div>
            </div>
          </LocalizedLink>
        </li>
      ))}
    </ol>
  );
}
