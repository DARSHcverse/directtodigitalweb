import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { site, telHref } from "@/lib/site";

/**
 * "Who you're dealing with", directly under the hero.
 *
 * A tradesperson's first question about a web designer is whether a real
 * person will answer. The homepage had no face and no number; this answers
 * both in two lines before anything else asks for their attention.
 */
export function MeetShan() {
  return (
    <section aria-labelledby="meet-shan" className="border-b border-edge bg-surface">
      <Container>
        <div className="flex flex-col items-start gap-5 py-8 sm:flex-row sm:items-center">
          <Image
            src="/shan.webp"
            alt={`${site.founder}, who runs ${site.name}`}
            width={80}
            height={100}
            className="h-20 w-16 shrink-0 rounded-lg border-2 border-navy object-cover"
          />
          <div className="flex-1">
            <h2 id="meet-shan" className="text-lg font-bold text-navy-text">
              You&apos;re dealing with me.
            </h2>
            <p className="mt-1 max-w-[46rem] text-muted">
              I&apos;m Shan. I build every site myself, I answer the phone
              myself, and you own what I build.{" "}
              <Link href="/about" className="font-semibold text-navy-text hover:text-amber-deep">
                More about me
              </Link>
            </p>
          </div>
          <a
            href={telHref}
            className="shrink-0 rounded-md border-2 border-navy px-5 py-3 text-sm font-bold whitespace-nowrap text-navy-text no-underline transition hover:bg-navy hover:text-white"
          >
            {site.phone.display}
          </a>
        </div>
      </Container>
    </section>
  );
}
