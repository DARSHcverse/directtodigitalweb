import { NavBar } from "@/components/NavBar";
import { JsonLd } from "@/components/JsonLd";
import { organisationSchema, webSiteSchema } from "@/lib/schema";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { AttributionCapture } from "@/components/AttributionCapture";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      {/* Marketing pages only. Admin routes must not carry site schema. */}
      <JsonLd data={[organisationSchema(), webSiteSchema()]} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <ContactBar />
      <AttributionCapture />
      <Footer />
    </div>
  );
}
