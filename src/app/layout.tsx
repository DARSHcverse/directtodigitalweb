import type { Metadata, Viewport } from "next";
import { DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/lib/site";
import { ThemeScript } from "@/components/ThemeScript";

/**
 * Self-hosted and cut down to Latin text, 400 to 800 weight, one optical size.
 * The Google version was 77 KB and arrived late enough to delay the largest
 * paint on every page. SIL Open Font License.
 */
const display = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: "Arial",
});

// Small build-log and label text only, so it is not worth a preload.
const mono = DM_Mono({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
  preload: false,
  variable: "--font-code",
});

const defaultTitle = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.founder,
  publisher: site.legalName,
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    url: site.url,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: defaultTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { address: false, email: false },
};

export const viewport: Viewport = {
  // Light is the default impression; dark follows the visitor's system
  // preference. Declaring both stops the browser treating the page as
  // light-only and lets the mobile browser chrome match the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f2a47" },
    { media: "(prefers-color-scheme: dark)", color: "#0e141c" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
