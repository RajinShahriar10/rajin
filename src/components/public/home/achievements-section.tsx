import { Award, Medal, TrendingUp, Trophy } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";

type AchievementData = {
  id: string;
  title: string;
  description?: string | null;
  date?: Date | null;
  category?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

function isFootball(category?: string | null) {
  const value = (category ?? "").toLowerCase();
  return (
    value.includes("football") ||
    value.includes("soccer") ||
    value.includes("sports") ||
    value.includes("tournament")
  );
}

export function AchievementsSection({
  achievements,
}: {
  achievements: AchievementData[];
}) {
  return (
    <section id="achievements" className="section-edge scroll-mt-24 bg-muted/20 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Milestones"
          title="Achievements"
          description="Notable milestones, honours and results along the way."
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item, i) => {
            const football = isFootball(item.category);
            const Icon = football
              ? Trophy
              : item.category
                ? Award
                : Medal;

            return (
              <Reveal key={item.id} delay={(i % 3) * 0.06} y={18}>
                <article
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors",
                    football
                      ? "border-emerald-500/25 hover:border-emerald-500/50"
                      : "border-border hover:border-primary/30",
                  )}
                >
                  {item.imageUrl ? (
                    <div className="relative h-36 overflow-hidden border-b border-border bg-muted/30">
                      <CloudinaryImage
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="(min-width: 1024px) 28rem, (min-width: 640px) 50vw, 100vw"
                        transform={{ aspect: "16:9", crop: true }}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-md border",
                          football
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-primary/30 bg-accent-soft text-primary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col items-end gap-1">
                        {item.date ? (
                          <span className="tech-label">{formatDate(item.date)}</span>
                        ) : null}
                        {item.category ? (
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                              football
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-border bg-muted/50 text-muted-foreground",
                            )}
                          >
                            {item.category}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {item.title}
                    </h3>

                    {item.description ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <p className="tech-label inline-flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Continuously learning, building and shipping
          </p>
        </Reveal>
      </div>
    </section>
  );
}
