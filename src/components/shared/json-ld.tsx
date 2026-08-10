/**
 * Renders a server-safe JSON-LD structured-data block.
 * Must only be used inside Server Components (it injects raw JSON).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
