import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { CardCarousel } from "@/components/shared/card-carousel";
import {
  AchievementCard,
  type AchievementCardData,
} from "@/components/public/achievements/achievement-card";
import { Reveal } from "@/components/shared/reveal";

export function AchievementsSection({
  achievements,
}: {
  achievements: AchievementCardData[];
}) {
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="section-edge scroll-mt-24 bg-muted/20 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Milestones"
          title="Achievements"
          description="Notable milestones, honours and results along the way."
          align="center"
        />

        <Reveal className="mt-14">
          <CardCarousel
            label="Achievements"
            previousLabel="Previous award"
            nextLabel="Next award"
          >
            {achievements.map((item) => (
              <AchievementCard key={item.id} achievement={item} />
            ))}
          </CardCarousel>
        </Reveal>

        <div className="mt-12 text-center">
          <Link
            href="/achievements"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all awards
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}