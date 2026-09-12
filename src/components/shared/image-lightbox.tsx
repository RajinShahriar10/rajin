"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { CloudinaryImage } from "@/components/shared/cloudinary-image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DURATION, EASE } from "@/lib/motion";

type ImageLightboxProps = {
  src: string;
  alt?: string | null;
  open: boolean;
  onClose: () => void;
  backLabel?: string;
};

const emptySubscribe = () => () => {};

/**
 * True once the component is rendering on the client. Used to defer the
 * portal to `document.body`, which does not exist during SSR.
 */
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

/**
 * Fullscreen single-image preview with a Back button, Esc and backdrop-click
 * to close. Locks body scroll while open. Rendered through a portal to
 * `document.body` so it works even when the trigger sits inside a
 * `transform`ed ancestor (e.g. a carousel card), which would otherwise break
 * `position: fixed`.
 */
export function ImageLightbox({
  src,
  alt,
  open,
  onClose,
  backLabel = "Back",
}: ImageLightboxProps) {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image preview"}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: DURATION.fast, ease: EASE.linear }
          }
          onClick={onClose}
        >
          <div className="flex items-center px-5 py-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Back"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white/85 transition-colors hover:border-white/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-5 pb-6">
            <div
              className="flex max-h-full max-w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <CloudinaryImage
                src={src}
                alt={alt || "Image preview"}
                width={1600}
                height={1200}
                sizes="(min-width: 768px) 90vw, 100vw"
                className="max-h-[82vh] w-auto max-w-[92vw] object-contain"
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}