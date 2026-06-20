import type { Locale } from "@/lib/i18n/locales";

import type { ArticleEntry } from "@/lib/content/schemas";
import { CardImage } from "@/components/shared/CardImage";
import { RichContentRenderer } from "@/components/shared/RichContentRenderer";
import { formatDisplayDate } from "@/lib/utils/format";

type ArticleDetailTemplateProps = {
  article: ArticleEntry;
  locale: Locale;
};

export async function ArticleDetailTemplate({ article, locale }: ArticleDetailTemplateProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-12 border-b border-stone-200 pb-8">
        <div className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
          {article.category}
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-serif)] text-5xl font-semibold leading-tight tracking-tight text-stone-950 sm:text-6xl">
          {article.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{article.summary}</p>
        <div className="mt-6 text-sm text-stone-500">{formatDisplayDate(article.date, locale)}</div>
      </header>
      <div className="mb-10">
        <CardImage alt={article.title} ratio="feature" src={article.coverImage} />
      </div>
      <RichContentRenderer source={article.body} />
    </article>
  );
}
