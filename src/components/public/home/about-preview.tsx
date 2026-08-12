import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { initials } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Markdown } from "@/components/shared/markdown";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { Parallax } from "@/components/shared/parallax";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { parseStat } from "@/lib/stats";

type AboutPreviewData = {
  heading: string;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  stats?: Array<{ id: string; label: string; value: string }>;
};

export function AboutPreview({
  about,
  name,
}: {
  about: AboutPreviewData;
  name?: string | null;
}) {
  if (!about.content) return null;
  const stats = about.stats ?? [];

  return (
    <section id="about" className="container-page scroll-mt-24 py-24">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Reveal className="order-2 lg:order-1">
          <Parallax strength={30}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card lg:max-w-sm">
              {about.imageUrl ? (
                <CloudinaryImage
                  src={about.imageUrl}
                  alt={about.imageAlt || "About"}
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  transform={{ aspect: "4:5", crop: true, gravity: "center" }}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="font-display text-5xl font-semibold text-primary/30">
                    {initials(name || "MD. Rajin Shahriar")}
                  </p>
                </div>
              )}
            </div>
          </Parallax>

          {stats.length > 0 ? (
            <dl className="mt-6 grid max-w-sm grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {stats.map((stat) => {
                const parsed = parseStat(stat.value);
                return (
                  <div key={stat.id} className="flex flex-col gap-1 bg-card px-5 py-4">
                    <dd className="font-display text-2xl font-semibold">
                      {parsed.number !== null ? (
                        <AnimatedNumber
                          value={parsed.number}
                          prefix={parsed.prefix}
                          suffix={parsed.suffix}
                        />
                      ) : (
                        stat.value
                      )}
                    </dd>
                    <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  </div>
                );
              })}
            </dl>
          ) : null}
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow="Introduction" title={about.heading} />
          <Reveal delay={0.1} className="mt-6">
            <div className="line-clamp-[9]">
              <Markdown content={about.content} />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              More about me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
