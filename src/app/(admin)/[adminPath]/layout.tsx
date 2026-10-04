import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ADMIN_SEGMENT } from "@/lib/admin/paths";
import { AdminPathProvider } from "@/components/admin/AdminPathProvider";

export const metadata: Metadata = {
  title: "Admin",
  // Never index the admin, and never follow links out of it.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Catch-all segment gated to the configured admin path.
 *
 * Any other value 404s, so the admin is not discoverable by trying paths —
 * and the 404 is indistinguishable from a genuinely missing page.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath: segment } = await params;
  if (segment !== ADMIN_SEGMENT) notFound();

  // The segment is handed to client components here; process.env is not
  // available to them, so without this their links fall back to "office".
  return (
    <AdminPathProvider segment={segment}>
      <div className="min-h-screen bg-bg">{children}</div>
    </AdminPathProvider>
  );
}
