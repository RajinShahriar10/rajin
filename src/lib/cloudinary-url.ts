/**
 * Helpers for working with Cloudinary delivery URLs.
 *
 * All of the public image components funnel through these helpers so we can
 * enforce a consistent optimization policy (automatic format, quality and
 * responsive resizing) without shipping originals.
 */

export type CloudinaryTransform = {
  width?: number;
  height?: number;
  /** Fixed aspect ratio, e.g. "16:10". Only meaningful together with `crop`. */
  aspect?: string;
  /** Crop instead of plain resize (fills the requested box). */
  crop?: boolean;
  /** Crop focus. Defaults to Cloudinary's auto gravity; use "center" for a centered crop. */
  gravity?: "auto" | "center" | "face";
  /** Numeric quality or Cloudinary's "auto" optimization. */
  quality?: number | "auto";
  format?: string;
  /** A delivery effect, e.g. "blur:200". */
  effect?: string;
};

const CLOUDINARY_URL_RE =
  /^https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\//;

export function isCloudinaryUrl(url?: string | null): boolean {
  if (!url) return false;
  return CLOUDINARY_URL_RE.test(url);
}

/**
 * Inject a transformation segment (`f_auto,q_auto,w_...`) into a Cloudinary
 * delivery URL. Non-Cloudinary URLs are returned untouched so fallbacks keep
 * working for images pasted from other sources.
 */
export function cloudinaryUrl(
  url: string,
  transform: CloudinaryTransform = {},
): string {
  if (!isCloudinaryUrl(url)) return url;

  const parts: string[] = [];
  if (transform.format) parts.push(`f_${transform.format}`);
  if (transform.quality) parts.push(`q_${transform.quality}`);
  if (transform.width) parts.push(`w_${transform.width}`);
  if (transform.height) parts.push(`h_${transform.height}`);
  if (transform.crop) parts.push("c_fill", transform.gravity ? `g_${transform.gravity}` : "g_auto");
  if (transform.crop && transform.aspect) parts.push(`ar_${transform.aspect}`);
  if (transform.effect) parts.push(`e_${transform.effect}`);

  const segment = parts.join(",");
  if (!segment) return url;

  return url.replace(/\/upload\//, `/upload/${segment}/`);
}

/** A low-resolution, heavily blurred variant used as a loading placeholder. */
export function cloudinaryBlurUrl(url: string): string {
  return cloudinaryUrl(url, {
    width: 24,
    quality: 20,
    effect: "blur:400",
  });
}

/** Extract the Cloudinary public id from a delivery URL, if possible. */
export function getCloudinaryPublicId(url?: string | null): string | null {
  if (!url || !isCloudinaryUrl(url)) return null;
  const withoutQuery = url.split("?")[0];
  const match = withoutQuery.match(
    /\/(?:image|video)\/upload\/(?:[^/]+\/)*v?\d+\/(.+?)(?:\.[a-z0-9]+)?$/i,
  );
  if (!match) return null;
  return match[1];
}

/**
 * Next.js image loader that points `next/image` at Cloudinary. Widths are
 * turned into `w_` transformation params so the CDN does the resizing instead
 * of the Next optimizer. `next/image` supplies the `width` per srcset entry.
 */
export type CloudinaryLoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export function cloudinaryLoader(
  { src, width }: CloudinaryLoaderArgs,
  transform: Omit<CloudinaryTransform, "width"> = {},
) {
  return cloudinaryUrl(src, {
    ...transform,
    width,
    quality: "auto",
  });
}

/**
 * A poster frame for Cloudinary-hosted videos.
 */
export function cloudinaryVideoThumb(url: string, width = 480): string {
  if (!isCloudinaryUrl(url)) return url;
  return url
    .replace(/\/video\/upload\//, `/video/upload/w_${width},f_auto,q_auto/`)
    .replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg$1");
}
