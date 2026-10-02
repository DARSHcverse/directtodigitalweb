"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type Theme = "system" | "light" | "dark";

const KEY = "twc-theme";

/**
 * Reads the stored choice. Anything unrecognised means "follow the system",
 * which is also what an absent key means.
 */
function stored(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

/**
 * Subscribes to theme changes. localStorage fires `storage` in *other* tabs
 * only, so a local change dispatches its own event — that keeps a second
 * toggle (header and mobile drawer are both mounted) in step with the first.
 */
function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("twc-theme-change", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("twc-theme-change", cb);
  };
}

/**
 * Light / Dark / System, in that order.
 *
 * System is kept as an explicit option rather than only offering a two-way
 * switch: once someone picks a side there is otherwise no way back to
 * following the OS, which is what most people actually want day to day.
 *
 * The CSS does the work — `data-theme` on <html> pins a palette and its
 * absence falls through to the prefers-color-scheme media query. ThemeScript
 * applies the saved value before first paint so there is no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  // localStorage is external state, so it is read through the store rather
  // than copied into an effect. The server snapshot is "system", which keeps
  // the server and first-paint markup identical; the real value arrives on
  // hydration, and ThemeScript has already applied it to <html> before paint
  // so nothing visibly changes.
  const theme = useSyncExternalStore(subscribe, stored, () => "system" as Theme);

  const choose = useCallback((next: Theme) => {
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      // Private browsing can refuse storage. The choice still applies to this
      // page; it just will not be remembered.
    }

    const root = document.documentElement;
    if (next === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);

    window.dispatchEvent(new Event("twc-theme-change"));
  }, []);

  const options: { key: Theme; label: string; icon: React.ReactNode }[] = [
    {
      key: "light",
      label: "Light",
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: "dark",
      label: "Dark",
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <path
            d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "system",
      label: "System",
      icon: (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
          <rect
            x="2.8"
            y="4"
            width="18.4"
            height="12.4"
            rx="1.8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8.5 20h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border-2 border-edge p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = theme === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => choose(o.key)}
            aria-pressed={active}
            title={`${o.label} theme`}
            className={cn(
              "inline-flex items-center justify-center rounded px-2 py-1.5 transition",
              active
                ? "bg-navy text-white"
                : "text-muted hover:bg-edge/60 hover:text-navy-text",
            )}
          >
            {o.icon}
            <span className="sr-only">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
