import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { privacySections } from "@/lib/legal";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Trade Web Co handles the personal data you submit through this website, under UK GDPR. No cookies, no tracking, no marketing lists.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Your data"
      title="Privacy policy"
      intro="What is collected when you contact me, why, who else sees it, and how to get it deleted. In plain English, because a policy nobody can read protects nobody."
      sections={privacySections}
    />
  );
}
