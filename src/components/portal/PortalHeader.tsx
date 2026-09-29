import Link from "next/link";
import { portalSignOut } from "@/app/portal/actions";
import { site } from "@/lib/site";

export function PortalHeader({ businessName }: { businessName: string }) {
  return (
    <header className="border-b-2 border-navy bg-surface">
      <div className="mx-auto flex w-[94%] max-w-[1000px] flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/portal" className="no-underline">
          <p className="text-lg font-bold text-navy">
            Trade Web <span className="text-amber-deep">Co.</span>
          </p>
          <p className="text-xs text-muted">{businessName}</p>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${site.contactEmail}`}
            className="border-2 border-edge px-4 py-2 text-sm font-bold text-muted no-underline transition hover:border-navy hover:text-navy"
          >
            Email me
          </a>
          <form action={portalSignOut}>
            <button
              type="submit"
              className="border-2 border-edge px-4 py-2 text-sm font-bold text-muted transition hover:border-navy hover:text-navy"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
