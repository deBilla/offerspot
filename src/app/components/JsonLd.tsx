/**
 * Renders JSON-LD into the server HTML so crawlers see structured data without
 * having to execute JavaScript. Deliberately a plain <script> tag rather than
 * next/script — next/script with an "afterInteractive" strategy injects the tag
 * client-side, which Google's parser is not guaranteed to pick up.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps a stray "</script>" inside the data from closing the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
