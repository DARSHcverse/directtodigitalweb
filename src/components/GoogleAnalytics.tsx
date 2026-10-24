"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
  GA_ID,
  readConsent,
  subscribeConsent,
  track,
  type Consent,
} from "@/lib/analytics";

/**
 * Loads Google Analytics only after the visitor accepts.
 *
 * Until then this renders nothing, so no request reaches Google. Taps on the
 * phone number are recorded as click_to_call — for a trade site a call is
 * the conversion that matters, and it never reaches a form.
 */
export function GoogleAnalytics() {
  const consent = useSyncExternalStore<Consent>(
    subscribeConsent,
    readConsent,
    () => null,
  );

  useEffect(() => {
    if (consent !== "granted") return;
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (link) track("click_to_call", { page: window.location.pathname });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (consent !== "granted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
// GA4 enhanced measurement records client-side page changes itself.
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
