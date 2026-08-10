import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { Reveal } from "@/components/shared/reveal";

type ResearchData = {
  id: string;
  title: string;
  category?: string | null;
  authorPosition?: string | null;
  conference?: string | null;
  institution?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  summary?: string | null;
  url?: string | null;
  date?: Date | null;
  tags?: Array<{ id: string; name: string }>;
};

export function ResearchSection({
  research,
}: {
  research: ResearchData[];
}) {
  if (research.length === 0) return null;

  return (
    <section id="research" className="section-edge scroll-mt-24 bg-muted/20 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Research"
          title="Research & Writing"
          description="Papers, technical writing and deep dives."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
          {research.map((item, i) => (
            <Reveal key={item.id} delay={(i % 2) * 0.08}>
              <article className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30">
                {item.imageUrl ? (
                  <div className="relative -mx-6 -mt-6 mb-1 h-36 overflow-hidden rounded-t-lg border-b border-border bg-muted/30">
                    <CloudinaryImage
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      fill
                      sizes="(min-width: 1024px) 38rem, (min-width: 640px) 50vw, 100vw"
                      transform={{ aspect: "16:7", crop: true }}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3">
                  {item.category ? (
                    <span className="tech-label">{item.category}</span>
                  ) : null}
                  {item.date ? (
                    <span className="tech-label">{formatDate(item.date)}</span>
                  ) : null}
                </div>

                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>

                {item.authorPosition || item.conference || item.institution ? (
                  <p className="text-xs italic text-muted-foreground">
                    {[item.authorPosition, item.conference, item.institution]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                ) : null}

                {item.summary ? (
                  <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {item.summary}
                  </p>
                ) : null}

                {item.tags && item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, i) => (
                      <span
                        key={`${tag.name}-${i}`}
                        className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                  >
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/research"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            View all research
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
