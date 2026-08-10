import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70svh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="tech-label text-primary" aria-hidden>
        404
      </p>
      <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Page not found
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Head back home to keep exploring.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            View projects
          </Link>
        </Button>
      </div>
    </section>
  );
}
