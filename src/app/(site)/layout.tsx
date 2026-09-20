import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { BookNowButton } from "@/components/BookNowButton";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <BookNowButton />
        <Footer />
      </main>
    </div>
  );
}
