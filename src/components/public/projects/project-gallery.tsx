"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; alt?: string | null };

/**
 * Cinematic gallery with crossfading stage, thumbnails and a fullscreen
 * lightbox. The lightbox supports keyboard (Esc / arrows / Home / End),
 * backdrop click and drag-to-swipe.
 */
export function ProjectGallery({
  images,
  projectTitle,
}: {
  images: GalleryImage[];
  projectTitle: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const activeRef = useRef(activeIndex);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setActiveIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length],
  );

  const openLightbox = useCallback((i: number) => {
    setActiveIndex(i);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          go(1);
          break;
        case "ArrowLeft":
          go(-1);
          break;
        case "Home":
          setActiveIndex(0);
          break;
        case "End":
          setActiveIndex(images.length - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, go, images.length, closeLightbox]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lightboxOpen]);

  const caption = (image: GalleryImage, index: number) =>
    image.alt || `${projectTitle} — view ${index + 1}`;

  const stageTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: DURATION.base, ease: EASE.outExpo };

  const stageVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 1.04, x: 0 },
        animate: { opacity: 1, scale: 1, x: 0 },
        exit: { opacity: 0, scale: 0.985, x: 0 },
      };

  return (
    <div>
      {/* Stage */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label={`Open gallery in fullscreen: ${caption(images[activeIndex], activeIndex)}`}
        />
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={stageVariants.initial}
            animate={stageVariants.animate}
            exit={stageVariants.exit}
            transition={stageTransition}
          >
            <CloudinaryImage
              src={images[activeIndex].url}
              alt={caption(images[activeIndex], activeIndex)}
              fill
              sizes="(min-width: 1024px) 72rem, 100vw"
              transform={{ aspect: "16:10", crop: true }}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="truncate text-sm text-white/90">
              {caption(images[activeIndex], activeIndex)}
            </p>
            <span className="shrink-0 font-mono text-xs tabular-nums text-white/70">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        </div>

        <span className="pointer-events-none absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" />
          Fullscreen
        </span>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
        {images.map((image, i) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Show ${caption(image, i)}`}
            aria-current={i === activeIndex}
            className={cn(
              "group/thumb relative aspect-[16/10] overflow-hidden rounded-md border transition-[border-color,opacity]",
              i === activeIndex
                ? "border-primary opacity-100"
                : "border-border opacity-60 hover:opacity-100",
            )}
          >
            <CloudinaryImage
              src={image.url}
              alt=""
              fill
              sizes="(min-width: 640px) 10rem, 20vw"
              transform={{ aspect: "16:10", crop: true }}
              className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
            />
            {i === activeIndex ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" aria-hidden />
            ) : null}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${projectTitle} gallery lightbox`}
            className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.linear }}
            onClick={closeLightbox}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-mono text-sm tabular-nums text-white/70">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close gallery"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stage */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous image"
                className="absolute left-3 z-30 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:left-5"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex h-full w-full items-center justify-center">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeIndex}
                    className="flex max-h-full max-w-full items-center justify-center"
                    initial={stageVariants.initial}
                    animate={stageVariants.animate}
                    exit={stageVariants.exit}
                    transition={stageTransition}
                    onClick={(e) => e.stopPropagation()}
                    drag={prefersReducedMotion ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={(_, info) => {
                      if (prefersReducedMotion) return;
                      const swiped =
                        Math.abs(info.offset.x) > 64 || Math.abs(info.velocity.x) > 600;
                      if (swiped) go(info.offset.x < 0 || info.velocity.x < 0 ? 1 : -1);
                    }}
                  >
                    <CloudinaryImage
                      src={images[activeIndex].url}
                      alt={caption(images[activeIndex], activeIndex)}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 768px) 90vw, 100vw"
                      className="max-h-[72vh] w-auto max-w-[92vw] object-contain sm:max-h-[80vh]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next image"
                className="absolute right-3 z-30 flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/40 text-white/80 transition-colors hover:border-white/40 hover:text-white sm:right-5"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Caption */}
            <div className="px-5 py-4 text-center">
              <p className="mx-auto max-w-xl truncate text-sm text-white/70">
                {caption(images[activeIndex], activeIndex)}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
