import { Reveal } from "@/components/shared/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="section-edge container-page border-t-0 pt-16 sm:pt-20">
      <Reveal className="flex flex-col gap-4">
        {eyebrow ? <p className="tech-label">{eyebrow}</p> : null}
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
