import { ProjectCarousel } from "@/components/public/home/project-carousel";
import type { ProjectCardData } from "@/components/public/projects/project-card";
import { Reveal } from "@/components/shared/reveal";

type PinnedProjectsProps = {
  projects: ProjectCardData[];
};

/**
 * Desktop and mobile now share the centered project carousel: one project at
 * a time, paged 1-by-1 with the prev/next buttons.
 */
export function PinnedProjects({ projects }: PinnedProjectsProps) {
  return (
    <Reveal>
      <ProjectCarousel projects={projects} />
    </Reveal>
  );
}