"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Carries the admin URL segment to client components.
 *
 * ADMIN_PATH is server-only, so `process.env.ADMIN_PATH` is undefined in the
 * browser and adminPath() silently falls back to "office" there. Every link
 * or redirect built inside a client component therefore pointed at /office/…
 * and 404'd, while the same call in a Server Component produced the right URL
 * — which is why this only showed up on the links the sidebar renders.
 *
 * The value is not a secret: it is already in every URL, the browser history
 * and the Referer header. The path only keeps scanners off; the real guard is
 * requireOwner() on each route.
 */
const AdminPathContext = createContext<string | null>(null);

export function AdminPathProvider({
  segment,
  children,
}: {
  segment: string;
  children: ReactNode;
}) {
  return (
    <AdminPathContext.Provider value={segment}>
      {children}
    </AdminPathContext.Provider>
  );
}

/**
 * Builds an admin URL inside a client component.
 *
 * Throws when used outside the provider rather than guessing a segment: a
 * wrong URL here is a 404 the user has to decipher, which is exactly the bug
 * this replaces.
 */
export function useAdminPath(): (sub?: string) => string {
  const segment = useContext(AdminPathContext);
  if (segment === null) {
    throw new Error("useAdminPath must be used within AdminPathProvider");
  }
  return (sub = "") => `/${segment}${sub ? `/${sub}` : ""}`;
}
