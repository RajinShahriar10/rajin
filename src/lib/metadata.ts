import type { Metadata } from "next";
import { getSiteData, getSiteUrl } from "@/lib/data/site";
import { SITE_NAME_DEFAULT } from "@/lib/constants";
import { cloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary-url";

type SeoOverrides = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  type?: "website" | "article";
};

/**
 * Build a canonical OG image (1200×630) from a Cloudinary asset. Non-Cloudinary
 * URLs are returned untouched so they still work as Open Graph images.
 */
export function socialImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (!isCloudinaryUrl(url)) return url;
  return cloudinaryUrl(url, {
    width: 1200,
    height: 630,
    aspect: "1200:630",
    crop: true,
  });
}

export async function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: SeoOverrides & { path?: string }): Promise<Metadata> {
  const { profile, settings } = await getSiteData();
  const siteUrl = await getSiteUrl();
  const siteName = settings.siteName || profile?.name || SITE_NAME_DEFAULT;

  const resolvedTitle = title || profile?.seoTitle || siteName;
  const resolvedDescription =
    description ||
    profile?.seoDescription ||
    settings.siteDescription ||
    "Personal portfolio and software engineering work.";

  const url = `${siteUrl}${path}`;
  const ogImage = socialImage(image ?? profile?.profileImageUrl);
  const safeTitle = resolvedTitle.slice(0, 70);
  const safeDescription = resolvedDescription.slice(0, 200);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: resolvedTitle,
      template: `%s — ${siteName}`,
    },
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url,
      siteName,
      locale: "en_US",
      type,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: `${siteName} — ${safeTitle}`,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      creator: settings.twitterHandle || undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
