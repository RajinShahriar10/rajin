"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  cloudinaryBlurUrl,
  cloudinaryLoader,
  isCloudinaryUrl,
  type CloudinaryTransform,
} from "@/lib/cloudinary-url";

type CloudinaryImageProps = {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Base transformations (aspect ratio, crop, ...). Width is added per srcset. */
  transform?: Omit<CloudinaryTransform, "width">;
  fallbackClassName?: string;
};

/**
 * `next/image` wrapper that applies Cloudinary delivery transformations for
 * Cloudinary-hosted assets and falls back to plain Next optimization for any
 * other URL. Images load with a blurred placeholder and degrade to a styled
 * placeholder when the source cannot be fetched.
 */
export function CloudinaryImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
  transform,
  fallbackClassName,
}: CloudinaryImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted/40",
          fill && "absolute inset-0",
          className,
          fallbackClassName,
        )}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <ImageOff
          className="h-8 w-8 text-muted-foreground/40"
          strokeWidth={1}
        />
      </div>
    );
  }

  const shared = {
    src,
    alt,
    fill,
    width,
    height,
    sizes,
    priority,
    className,
    onError: () => setFailed(true),
  };

  if (isCloudinaryUrl(src)) {
    return (
      <Image
        {...shared}
        alt={alt}
        loader={(args) => cloudinaryLoader(args, transform)}
        placeholder="blur"
        blurDataURL={cloudinaryBlurUrl(src)}
      />
    );
  }

  return <Image {...shared} alt={alt} />;
}
