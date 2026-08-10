import { getProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { ProjectsGrid } from "@/components/public/projects/projects-grid";

export async function generateMetadata() {
  return buildMetadata({ title: "Projects", path: "/projects" });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Projects"
        description="Full-stack, desktop and web projects — from fintech platforms to inventory management systems."
      />
      <section className="container-page pb-24 pt-10">
        <Reveal>
          <ProjectsGrid projects={projects} />
        </Reveal>
      </section>
    </>
  );
}
