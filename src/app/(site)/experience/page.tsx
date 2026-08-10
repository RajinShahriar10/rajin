import { getExperience, getEducation } from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { ExperienceSection } from "@/components/public/home/experience-section";
import { EducationSection } from "@/components/public/experience/education-section";

export async function generateMetadata() {
  return buildMetadata({ title: "Experience", path: "/experience" });
}

export default async function ExperiencePage() {
  const [experiences, education] = await Promise.all([
    getExperience(),
    getEducation(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Career"
        title="Experience & Education"
        description="Professional roles, responsibilities and the academic journey behind them."
      />
      <section className="container-page pb-24 pt-4">
        <ExperienceSection experiences={experiences} />
        <div className="mt-20">
          <EducationSection education={education} />
        </div>
      </section>
    </>
  );
}
