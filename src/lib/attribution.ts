/**
 * First-touch attribution, without cookies.
 *
 * The first page of a visit is where a flyer QR code, a partner's link or an
 * ad lands, so that is where the source is read. It is held in
 * sessionStorage — this tab only, cleared when it closes — and sent along
 * with any enquiry. Nothing persists across visits or identifies anyone.
 */

const KEY = "twc-attribution";

export type Attribution = {
  ref?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  referrer?: string;
};

/** Record the visit's source once, on its first page. */
export function captureAttribution(): void {
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams;
    const clip = (v: string | null, n = 80) => (v ? v.slice(0, n) : undefined);

    const existing = sessionStorage.getItem(KEY);
    if (existing) {
      // First touch wins, except that a ref picked up later in the visit
      // (e.g. a guide's quote button) fills an empty one.
      const data = JSON.parse(existing) as Attribution;
      const ref = clip(q.get("ref"));
      if (ref && !data.ref) {
        sessionStorage.setItem(KEY, JSON.stringify({ ...data, ref }));
      }
      return;
    }

    // Internal navigation is not a source; only another site is.
    let referrer: string | undefined;
    if (document.referrer) {
      const r = new URL(document.referrer);
      if (r.host !== url.host) referrer = clip(r.origin + r.pathname, 300);
    }

    const data: Attribution = {
      ref: clip(q.get("ref")),
      utmSource: clip(q.get("utm_source")),
      utmMedium: clip(q.get("utm_medium")),
      utmCampaign: clip(q.get("utm_campaign")),
      landingPage: clip(url.pathname, 200),
      referrer,
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing or blocked storage: the enquiry still goes through,
    // just without a source.
  }
}

export function readAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
