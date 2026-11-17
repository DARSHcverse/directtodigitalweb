/**
 * The homepage hero picture: a website taking a booking, and the phone that
 * hears about it.
 *
 * It shows the offer in one glance — site, booking, app — which a list of
 * services cannot. Built from markup rather than an image so it costs no
 * download, themes with the site, and never becomes the LCP element. The
 * garage is generic on purpose: it must not read as a client's real site.
 *
 * Decorative: everything here is said in words beside it, so it is hidden
 * from screen readers.
 */
const slots = [
  { day: "Mon", time: "08:30" },
  { day: "Tue", time: "10:00" },
  { day: "Wed", time: "13:30" },
  { day: "Thu", time: "09:30", picked: true },
  { day: "Fri", time: "11:00" },
  { day: "Sat", time: "08:00" },
] as const;

export function HeroDevices() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none sm:pb-10">
      <div className="overflow-hidden rounded-lg border-2 border-navy bg-surface shadow-[8px_8px_0_0_var(--color-navy)] sm:mr-16">
        <div className="flex items-center gap-2 border-b-2 border-navy bg-navy px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="ml-3 flex-1 truncate rounded bg-white/10 px-3 py-1 text-xs text-white/80">
            yourgarage.co.uk/book
          </span>
        </div>
        {/* From sm the phone covers the card's right-hand strip, so the
            content stops short of it. */}
        <div className="p-5 sm:p-6 sm:pr-24">
          <p className="text-xs font-bold tracking-[0.2em] text-amber-deep uppercase">
            MOT &amp; servicing
          </p>
          <p className="mt-2 text-xl font-bold text-navy-text">Book your MOT online</p>
          <p className="mt-1 text-sm text-muted">Pick a time. We&apos;ll confirm by email.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <span
                key={slot.day}
                className={
                  "picked" in slot
                    ? "rounded-md border-2 border-navy bg-amber px-2 py-2 text-center text-xs font-bold text-on-amber"
                    : "rounded-md border-2 border-edge px-2 py-2 text-center text-xs font-semibold text-muted"
                }
              >
                {slot.day}
                <span className="block text-sm">{slot.time}</span>
              </span>
            ))}
          </div>
          <span className="mt-5 block rounded-md bg-navy py-2.5 text-center text-sm font-bold text-white">
            Confirm booking
          </span>
        </div>
      </div>

      {/* The phone overlaps the site's corner: one booking, two screens. */}
      <div className="absolute right-0 bottom-0 hidden w-40 rounded-[1.6rem] border-2 border-navy bg-navy p-1.5 shadow-lg sm:block">
        <div className="rounded-[1.25rem] bg-surface px-3 pt-5 pb-4">
          <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-edge" />
          <div className="rounded-lg border-2 border-edge p-2.5">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider text-amber-deep uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              New booking
            </p>
            <p className="mt-1 text-sm font-bold text-navy-text">Thu 09:30 · MOT</p>
            <p className="text-xs text-muted">Deposit paid</p>
          </div>
          <div className="mt-2 rounded-lg border-2 border-edge p-2.5 opacity-70">
            <p className="text-xs font-semibold text-navy-text">Fri 11:00 · Service</p>
            <p className="text-xs text-muted">Reminder sent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
