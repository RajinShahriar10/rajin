import { ProjectCarousel } from "@/components/public/home/project-carousel";
import type { ProjectCardData } from "@/components/public/projects/project-card";

type PinnedProjectsProps = {
  projects: ProjectCardData[];
};

/**
 * Desktop and mobile now share the centered project carousel: one project at
 * a time, paged 1-by-1 with the prev/next buttons.
 */
export function PinnedProjects({ projects }: PinnedProjectsProps) {
  return <ProjectCarousel projects={projects} />;
}