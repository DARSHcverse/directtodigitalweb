import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { termsSections } from "@/lib/legal";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description:
    "Terms covering use of the Trade Web Co website, quotes and pricing, ownership of finished work, and liability.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      label="The small print"
      title="Terms"
      intro="How quotes, prices and ownership work. Your project is governed by the written quote you receive — these terms cover this website and the general basis of working together."
      sections={termsSections}
    />
  );
}
