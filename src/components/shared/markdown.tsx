import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

const components = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="font-display text-3xl font-semibold tracking-tight mt-8 first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="font-display text-2xl font-semibold tracking-tight mt-8 first:mt-0" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="font-display text-xl font-semibold tracking-tight mt-6 first:mt-0" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="leading-relaxed text-foreground/90 mt-4 first:mt-0" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="list-disc pl-6 mt-4 space-y-1.5 marker:text-primary/60" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="list-decimal pl-6 mt-4 space-y-1.5 marker:text-primary/60" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed text-foreground/90" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="border-l-2 border-primary pl-4 italic text-muted-foreground mt-4"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-invert", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
