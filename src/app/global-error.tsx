"use client";

import { ErrorState } from "@/components/shared/error-state";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ErrorState
          title="Something went wrong"
          message={
            isDev
              ? error.message
              : "An unexpected error occurred. Please reload the page."
          }
          retryLabel="Try again"
          onRetry={reset}
        />
      </body>
    </html>
  );
}
