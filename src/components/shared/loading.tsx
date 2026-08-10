import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingProps = {
  label?: string;
  full?: boolean;
  className?: string;
};

/**
 * Accessible loading indicator with optional label.
 * `full` stretches to a full-viewport-height placeholder.
 */
export function Loading({ label = "Loading…", full = false, className }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-3 text-muted-foreground",
        full && "min-h-[50vh]",
        className,
      )}
    >
      <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" aria-hidden />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
