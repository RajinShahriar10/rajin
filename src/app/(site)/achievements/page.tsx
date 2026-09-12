import { getAchievements } from "@/lib/data/content";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal } from "@/components/shared/reveal";
import { SectionEmpty } from "@/components/shared/section-empty";
import { AchievementCard } from "@/components/public/achievements/achievement-card";

export async function generateMetadata() {
  return buildMetadata({ title: "Achievements", path: "/achievements" });
}

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return (
    <>
      <PageHeader
        eyebrow="Milestones"
        title="Achievements & Awards"
        description="Notable milestones, honours and results along the way."
      />
      <section className="container-page pb-24 pt-10">
        {achievements.length === 0 ? (
          <SectionEmpty
            title="No achievements yet"
            description="Honours and results I earn will be listed here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                <AchievementCard achievement={item} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}