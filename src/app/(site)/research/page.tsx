import { getResearch } from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResearchCaseStudy } from "@/components/public/research/research-case-study";

export async function generateMetadata() {
  return buildMetadata({ title: "Research", path: "/research" });
}

export default async function ResearchPage() {
  const research = await getResearch();

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research & Publications"
        description="Academic work, case studies and technical writing."
      />
      <section className="container-page pb-24 pt-10">
        {research.length === 0 ? (
          <SectionEmpty
            title="No research yet"
            description="Publications and case studies will be listed here."
          />
        ) : (
          <div className="flex flex-col gap-8">
            {research.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.03, 0.2)} y={16}>
                <ResearchCaseStudy item={item} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-20">
          <SectionHeading eyebrow="Note" title="Always learning" />
          <Reveal className="mt-6">
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              I regularly explore topics across software architecture, database design,
              security and .NET/Java ecosystems. If you have a collaboration idea, feel
              free to reach out.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
