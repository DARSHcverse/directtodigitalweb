/**
 * Renders JSON-LD.
 *
 * An array is emitted as one script tag per object rather than a single tag
 * containing an array: both are valid to Google, but consumers that read a
 * tag and access d["@context"] directly throw on an array.
 *
 * Content is built server-side from our own constants, never user input, so
 * dangerouslySetInnerHTML is safe here.
 */
function serialise(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serialise(item) }}
        />
      ))}
    </>
  );
}
