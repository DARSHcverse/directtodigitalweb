"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Search box that keeps the current filter in the URL.
 *
 * Debounced so a query runs when typing pauses rather than on every
 * keystroke, and the term lives in the URL so a search can be bookmarked,
 * shared, or survive a back button.
 */
export function SearchBox({
  basePath,
  placeholder,
}: {
  basePath: string;
  placeholder: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("q", value.trim());
      else next.delete("q");
      router.replace(`${basePath}?${next.toString()}`, { scroll: false });
    }, 250);

    return () => clearTimeout(timer);
  }, [value, basePath, params, router]);

  return (
    <div className="relative mb-4">
      <label htmlFor="admin-search" className="sr-only">
        {placeholder}
      </label>
      <input
        id="admin-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-edge rounded-lg bg-surface px-4 py-3 text-ink outline-none transition focus:border-navy focus:shadow-[0_0_0_3px_rgb(15_42_71/0.15)]"
      />
    </div>
  );
}
