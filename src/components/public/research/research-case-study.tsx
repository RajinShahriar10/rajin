import { ArrowUpRight, CalendarDays, Landmark, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { Markdown } from "@/components/shared/markdown";

export type ResearchCaseData = {
  id: string;
  title: string;
  category?: string | null;
  authorPosition?: string | null;
  conference?: string | null;
  institution?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  summary?: string | null;
  details?: string | null;
  url?: string | null;
  date?: Date | null;
  tags?: Array<{ id: string; name: string }>;
};

export function ResearchCaseStudy({ item }: { item: ResearchCaseData }) {
  const venue = [item.conference, item.institution].filter(Boolean).join(" · ");

  return (
    <article className="rounded-lg border border-border border-t-2 border-t-primary/40 bg-card transition-colors hover:border-primary/30">
      {item.imageUrl ? (
        <div className="relative h-48 overflow-hidden rounded-t-md border-b border-border bg-muted/30">
          <CloudinaryImage
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            fill
            sizes="(min-width: 1024px) 60rem, 100vw"
            transform={{ aspect: "16:6", crop: true }}
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {item.category ? (
            <span className="rounded-full border border-primary/30 bg-accent-soft px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
              {item.category}
            </span>
          ) : (
            <span />
          )}
          {item.date ? (
            <span className="tech-label inline-flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" />
              {formatDate(item.date)}
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
          {item.title}
        </h2>

        {item.authorPosition ? (
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary/70" />
              <span className="italic">{item.authorPosition}</span>
            </span>
            {venue ? (
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5 text-primary/70" />
                {venue}
              </span>
            ) : null}
          </p>
        ) : venue ? (
          <p className="mt-2 text-sm text-muted-foreground">{venue}</p>
        ) : null}

        {item.summary ? (
          <div className="mt-6 border-l-2 border-primary/30 bg-muted/20 py-4 pl-5 pr-4">
            <p className="tech-label mb-2">Abstract</p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          </div>
        ) : null}

        {item.tags && item.tags.length > 0 ? (
          <div className="mt-6">
            <p className="tech-label mb-2">Key topics</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {item.details ? (
          <div className="mt-6">
            <Markdown content={item.details} />
          </div>
        ) : null}

        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            View publication
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
