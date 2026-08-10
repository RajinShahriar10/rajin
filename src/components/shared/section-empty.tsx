import { Inbox } from "lucide-react";

export function SectionEmpty({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
        <Inbox className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </span>
      <p className="font-display text-lg font-semibold tracking-tight">
        {title}
      </p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
