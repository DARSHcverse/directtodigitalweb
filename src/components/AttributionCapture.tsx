"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records where this visit came from. Renders nothing.
 *
 * Runs on every page change, not just the first load: the layout stays
 * mounted during client-side navigation, so a ref on a later page (a guide's
 * quote button) would otherwise never be read.
 */
export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution();
  }, [pathname]);
  return null;
}
