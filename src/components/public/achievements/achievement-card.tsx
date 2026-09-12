"use client";

import { useState } from "react";
import { Award, Maximize2, Medal, Trophy } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { ImageLightbox } from "@/components/shared/image-lightbox";

export type AchievementCardData = {
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

export function AchievementCard({
  achievement,
  className,
}: {
  achievement: AchievementCardData;
  className?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const football = isFootball(achievement.category);
  const Icon = football
    ? Trophy
    : achievement.category
      ? Award
      : Medal;

  return (
    <article
      className={cn(
        "group flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card transition-colors",
        football
          ? "border-emerald-500/25 hover:border-emerald-500/50"
          : "border-border hover:border-primary/30",
        className,
      )}
    >
      {achievement.imageUrl ? (
        <>
          <div className="relative h-40 overflow-hidden border-b border-border bg-muted/30">
            <CloudinaryImage
              src={achievement.imageUrl}
              alt={achievement.imageAlt || achievement.title}
              fill
              sizes="(min-width: 1024px) 26rem, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Open ${achievement.title} image in fullscreen`}
              className="absolute inset-0 z-10 cursor-zoom-in"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View award image fullscreen"
              className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <ImageLightbox
            src={achievement.imageUrl}
            alt={achievement.imageAlt || achievement.title}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            backLabel="Back to awards"
          />
        </>
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
            {achievement.date ? (
              <span className="tech-label">{formatDate(achievement.date)}</span>
            ) : null}
            {achievement.category ? (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  football
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-muted/50 text-muted-foreground",
                )}
              >
                {achievement.category}
              </span>
            ) : null}
          </div>
        </div>

        <h3 className="font-display text-base font-semibold tracking-tight">
          {achievement.title}
        </h3>

        {achievement.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {achievement.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}