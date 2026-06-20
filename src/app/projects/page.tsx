import type { Metadata } from "next";

import { CollectionPageHeader } from "@/components/list/CollectionPageHeader";
import { CollectionCardGrid } from "@/components/list/CollectionCardGrid";
import { getAllProjects } from "@/lib/content/default-locale-loaders";
import { buildPageMetadata } from "@/lib/metadata";
import { selectOrderedProjects } from "@/lib/content/selectors";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description: "Sample project grid for the editorial frontsite template.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = selectOrderedProjects(await getAllProjects());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CollectionPageHeader
        eyebrow="Projects"
        summary="Projects are seeded with sample content, but the card anatomy and detail pages are ready for real work."
        title="Projects"
      />
      <div className="mt-12">
        <CollectionCardGrid entries={projects} hrefBase="/projects" />
      </div>
    </div>
  );
}
