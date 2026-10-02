import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getPortalClient } from "@/lib/portal/auth";
import { PortalLoginForm } from "@/components/portal/LoginForm";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client sign in",
  robots: { index: false, follow: false },
};

const WHAT_YOU_GET = [
  {
    title: "Where your build is",
    body: "The stage it has reached, what I'm working on now, and anything I need from you.",
  },
  {
    title: "Your invoices",
    body: "What's been invoiced, what's paid, and the bank details to pay by transfer.",
  },
  {
    title: "Everything in one place",
    body: "Send me notes and details about your business without digging through email.",
  },
] as const;

export default async function PortalLoginPage() {
  if (await getPortalClient()) redirect("/portal");

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Sign-in side. First on mobile, because that is what they came for. */}
        <div className="bg-blueprint flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <Link
              href="/"
              className="rule-label mb-6 inline-block text-xs font-bold tracking-[0.2em] text-navy-text uppercase no-underline"
            >
              {site.name}
            </Link>

            <h1 className="mb-3 text-[clamp(2rem,4vw,2.75rem)] leading-tight font-bold tracking-display text-navy-text">
              Client sign in
            </h1>
            <p className="mb-8 leading-relaxed text-muted">
              Use the code I sent you. No password to remember, and it works
              every time.
            </p>

            <div className="border-2 border-navy rounded-lg bg-surface p-6">
              <PortalLoginForm />
            </div>

            <p className="mt-6 text-sm text-muted">
              Not a client yet?{" "}
              <Link
                href="/quote"
                className="font-semibold text-navy-text hover:text-amber-deep"
              >
                Get a fixed quote
              </Link>
            </p>
            <p className="mt-2 text-sm text-muted">
              Lost your code?{" "}
              <a
                href={`mailto:${site.contactEmail}?subject=Lost%20my%20sign-in%20code`}
                className="font-semibold text-navy-text hover:text-amber-deep"
              >
                Email me
              </a>{" "}
              and I&apos;ll send a new one.
            </p>
          </div>
        </div>

        {/* Reassurance side. Hidden on mobile so the form is not pushed down. */}
        <div className="hidden bg-navy rounded-md px-12 py-16 lg:flex lg:items-center">
          <div className="max-w-md">
            <p className="rule-label mb-4 text-xs font-bold tracking-[0.2em] text-white uppercase">
              Your project
            </p>
            <h2 className="mb-10 text-3xl leading-tight font-bold tracking-display text-white">
              Everything about your website, whenever you want to look.
            </h2>

            <ul className="grid gap-7">
              {WHAT_YOU_GET.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span className="shrink-0 text-2xl font-bold text-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-bold text-white">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/70">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
