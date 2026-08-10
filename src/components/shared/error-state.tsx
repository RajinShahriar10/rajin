import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

/**
 * Reusable error fallback. Used by `app/error.tsx` and `app/global-error.tsx`.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  retryLabel = "Try again",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-20 text-center",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
        <AlertTriangle
          className="h-5 w-5 text-destructive"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <div className="space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {message ? (
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
      {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
    </div>
  );
}
