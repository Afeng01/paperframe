import { z } from "zod";

import type { Locale } from "@/lib/i18n/locales";

const dateFieldSchema = z.union([z.string().min(1), z.date()]).transform((value) => {
  if (typeof value === "string") {
    return value;
  }

  return value.toISOString().slice(0, 10);
});

const stringLikeSchema = z
  .union([z.string().min(1), z.number()])
  .transform((value) => String(value));

const sharedFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  coverImage: z.string().min(1).optional(),
});

export const articleFrontmatterSchema = sharedFrontmatterSchema.extend({
  date: dateFieldSchema,
  category: z.string().min(1),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  quote: z.string().optional(),
});

export const projectFrontmatterSchema = sharedFrontmatterSchema.extend({
  date: dateFieldSchema,
  category: z.string().min(1),
  order: z.number().int().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  year: stringLikeSchema.optional(),
});

export const serviceFrontmatterSchema = sharedFrontmatterSchema.extend({
  category: z.string().min(1),
  order: z.number().int().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  date: dateFieldSchema.optional(),
});

export const aboutFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
});

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const statItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().min(1),
});

export const quoteSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  author: z.string().min(1),
});

export const contactLinkSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().min(1),
});

export const siteContentSchema = z.object({
  siteTitle: z.string().min(1),
  siteSubtitle: z.string().min(1),
  navigation: z.array(navItemSchema).min(1),
  footerLinks: z.array(navItemSchema).min(1),
  heroMeta: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        href: z.string().optional(),
      }),
    )
    .length(3),
  stats: z.array(statItemSchema).length(4),
  quote: quoteSchema,
  contact: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    links: z.array(contactLinkSchema).min(1),
  }),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;
export type AboutFrontmatter = z.infer<typeof aboutFrontmatterSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;

export interface LocalizedContentFields {
  locale: Locale;
  translationKey: string;
}

export type ArticleEntry = ArticleFrontmatter &
  LocalizedContentFields & {
  body: string;
};

export type ProjectEntry = ProjectFrontmatter &
  LocalizedContentFields & {
  body: string;
};

export type ServiceEntry = ServiceFrontmatter &
  LocalizedContentFields & {
  body: string;
};

export type AboutEntry = AboutFrontmatter &
  LocalizedContentFields & {
  body: string;
};
