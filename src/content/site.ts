import { siteContentSchema, type SiteContent } from "@/lib/content/schemas";
import { siteConfig } from "@/lib/site-config";

export const siteContent = siteContentSchema.parse({
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
}) satisfies SiteContent;
