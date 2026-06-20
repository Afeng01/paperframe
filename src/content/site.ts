import { siteContentSchema, type SiteContent } from "@/lib/content/schemas";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { siteConfig } from "@/lib/site-config";

export const siteContentByLocale: Record<Locale, SiteContent> = {
  en: siteContentSchema.parse({
    siteTitle: siteConfig.name,
    siteSubtitle: "A calm editorial shell for writing, projects, and service pages.",
    navigation: [
      { label: "Articles", href: "/articles" },
      { label: "Projects", href: "/projects" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/#contact" },
    ],
    footerLinks: [
      { label: "Home", href: "/" },
      { label: "Articles", href: "/articles" },
      { label: "Projects", href: "/projects" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
    ],
    heroMeta: [
      { label: "Issue", value: "VOL.01" },
      { label: "Focus", value: "Editorial Template" },
      { label: "Updated", value: "Template Ready" },
    ],
    stats: [
      { label: "Articles", value: "06", note: "Seeded sample archive" },
      { label: "Projects", value: "06", note: "Template project set" },
      { label: "Services", value: "03", note: "Sample service cards" },
      { label: "Routes", value: "08", note: "Included page surfaces" },
    ],
    quote: {
      label: "Template note",
      value: "Shape the shell well enough that real content only needs files, not rewrites.",
      author: "Paperframe",
    },
    contact: {
      title: "Swap in your details",
      summary:
        "Everything here is intentionally editable from a small number of files so the public pass can stay focused on content and art direction.",
      links: [
        {
          label: "Email",
          value: siteConfig.author.email,
          href: `mailto:${siteConfig.author.email}`,
        },
        { label: "GitHub", value: "github.com/your-handle", href: siteConfig.social.github },
        { label: "About", value: "Read the template notes", href: "/about" },
      ],
    },
  }),
  zh: siteContentSchema.parse({
    siteTitle: siteConfig.name,
    siteSubtitle: "一个安静的编辑型外壳，用来承接写作、项目与服务内容。",
    navigation: [
      { label: "文章", href: "/articles" },
      { label: "项目", href: "/projects" },
      { label: "服务", href: "/services" },
      { label: "关于", href: "/about" },
      { label: "联系", href: "/#contact" },
    ],
    footerLinks: [
      { label: "首页", href: "/" },
      { label: "文章", href: "/articles" },
      { label: "项目", href: "/projects" },
      { label: "服务", href: "/services" },
      { label: "关于", href: "/about" },
    ],
    heroMeta: [
      { label: "刊号", value: "VOL.01" },
      { label: "主题", value: "编辑型模板" },
      { label: "状态", value: "模板已就绪" },
    ],
    stats: [
      { label: "文章", value: "06", note: "种子文章存档" },
      { label: "项目", value: "06", note: "模板项目集合" },
      { label: "服务", value: "03", note: "示例服务卡片" },
      { label: "页面", value: "08", note: "已包含核心路由" },
    ],
    quote: {
      label: "模板说明",
      value: "先把外壳搭稳，让真实内容只需要替换文件，而不是重写页面。",
      author: "Paperframe",
    },
    contact: {
      title: "在这里替换成你的信息",
      summary: "所有内容都集中在少量文件里，方便把公开版本的精力留给文案、作品和视觉方向。",
      links: [
        {
          label: "邮箱",
          value: siteConfig.author.email,
          href: `mailto:${siteConfig.author.email}`,
        },
        { label: "GitHub", value: "github.com/your-handle", href: siteConfig.social.github },
        { label: "关于", value: "阅读模板说明", href: "/about" },
      ],
    },
  }),
};

export function getSiteContent(locale: Locale): SiteContent {
  return siteContentByLocale[locale];
}

export const siteContent = getSiteContent(DEFAULT_LOCALE);
