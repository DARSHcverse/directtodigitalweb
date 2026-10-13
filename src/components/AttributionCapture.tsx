"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records where this visit came from. Renders nothing. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
