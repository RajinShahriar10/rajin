import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Magnetic } from "@/components/shared/magnetic";
import { Reveal } from "@/components/shared/reveal";
import { SocialIcon } from "@/components/shared/social-icon";
import { Button } from "@/components/ui/button";

type ContactCtaProps = {
  email?: string | null;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    label?: string | null;
  }>;
};

export function ContactCta({ email, socialLinks }: ContactCtaProps) {
  return (
    <section id="contact" className="container-page scroll-mt-24 py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl border border-border bg-card px-6 py-16 text-center sm:px-12">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]"
          />

          <div className="relative flex flex-col items-center gap-6">
            <p className="tech-label">Let&apos;s connect</p>
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Have a project in mind? Let&apos;s build something together.
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              I&apos;m always open to discussing new opportunities, freelance work or
              collaborations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {email ? (
                <Magnetic>
                  <Button asChild size="lg">
                    <a href={`mailto:${email}`}>
                      <Mail className="h-4 w-4" />
                      {email}
                    </a>
                  </Button>
                </Magnetic>
              ) : null}
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">
                  Contact form
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || link.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <SocialIcon platform={link.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
