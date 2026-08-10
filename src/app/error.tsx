"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <ErrorState
      message={
        isDev
          ? error.message
          : "Something went wrong while loading this page. Please try again."
      }
      retryLabel="Try again"
      onRetry={reset}
    />
  );
}
