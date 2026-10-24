/**
 * Google Analytics, behind consent.
 *
 * Analytics cookies are not strictly necessary, so under PECR they need the
 * visitor's agreement before they are set. Nothing from Google loads until
 * the visitor accepts; if they reject, no Google script is requested at all.
 * Advertising storage is denied regardless — this is measurement only.
 *
 * The choice lives in localStorage on this device. Vercel Analytics, which is
 * cookie-free, runs regardless and needs no consent.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-01HKND1PVX";

const KEY = "twc-consent";
const EVENT = "twc-consent-change";

export type Consent = "granted" | "denied" | null;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // Blocked storage: treat as undecided, so nothing loads.
    return null;
  }
}

/** Record a choice, or clear it (null) to show the banner again. */
export function setConsent(value: Consent): void {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    // The choice still applies for this page view.
  }

  if (value !== "granted") {
    // If Analytics had already loaded on this page, stop it storing anything
    // further and remove the cookies it set.
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConsent(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Deletes Google Analytics' _ga cookies on this host and its parent domain. */
function clearAnalyticsCookies(): void {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0]!.trim())) {
    if (!name.startsWith("_ga")) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

/**
 * Record an event. A no-op unless the visitor has accepted and Analytics has
 * loaded, so callers never need to check consent themselves. No personal
 * data goes in the parameters.
 */
export function track(name: string, params: Record<string, string> = {}): void {
  window.gtag?.("event", name, params);
}
