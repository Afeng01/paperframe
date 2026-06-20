import type { ProjectEntry } from "@/lib/content/schemas";
import type { Locale } from "@/lib/i18n/locales";

import { CardImage } from "@/components/shared/CardImage";
import { LocalizedLink } from "@/components/shared/LocalizedLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { formatDisplayDate } from "@/lib/utils/format";

type ProjectGridProps = {
  locale: Locale;
  projects: ProjectEntry[];
};

const PROJECT_GRID_COPY = {
  en: {
    eyebrow: "Projects",
    title: "What is being built",
    ctaLabel: "View all",
  },
  zh: {
    eyebrow: "项目",
    title: "正在搭建的东西",
    ctaLabel: "查看全部",
  },
} as const;

export function ProjectGrid({ locale, projects }: ProjectGridProps) {
  const copy = PROJECT_GRID_COPY[locale];

  return (
    <section className="border-t border-stone-200 bg-white" id="projects">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          locale={locale}
          eyebrow={copy.eyebrow}
          href="/projects"
          ctaLabel={copy.ctaLabel}
          title={copy.title}
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <LocalizedLink
              key={project.slug}
              className="group block"
              locale={locale}
              href={`/projects/${project.slug}`}
            >
              <CardImage alt={project.title} src={project.coverImage} />
              <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-stone-500">
                {formatDisplayDate(project.date, locale)}
              </div>
              <h3 className="mt-3 font-[family-name:var(--font-serif)] text-lg font-semibold leading-snug tracking-tight text-stone-950 transition-colors group-hover:text-stone-600">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{project.summary}</p>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
