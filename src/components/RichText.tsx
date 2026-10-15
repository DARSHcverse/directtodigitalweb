import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders **bold** and [text](href) inside plain copy strings.
 *
 * Deliberately tiny: page copy lives in data files as strings, and these
 * two marks are all it needs. Anything else is printed as written.
 */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(<strong key={key++} className="font-bold text-navy-text">{match[1]}</strong>);
    } else {
      const href = match[3]!;
      const cls = "font-semibold text-navy-text underline underline-offset-2 hover:text-amber-deep";
      parts.push(
        /^https?:\/\//.test(href) ? (
          <a key={key++} href={href} target="_blank" rel="noreferrer noopener" className={cls}>
            {match[2]}
          </a>
        ) : (
          <Link key={key++} href={href} className={cls}>
            {match[2]}
          </Link>
        ),
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
