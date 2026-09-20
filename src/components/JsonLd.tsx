/**
 * Renders JSON-LD. Content is built server-side from our own constants,
 * never from user input, so dangerouslySetInnerHTML is safe here.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
