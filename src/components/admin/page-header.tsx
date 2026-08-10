import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  href,
  ctaLabel,
  backHref,
}: {
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  backHref?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {href && ctaLabel ? (
        <Button asChild>
          <Link href={href}>
            <Plus className="h-4 w-4" />
            {ctaLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
