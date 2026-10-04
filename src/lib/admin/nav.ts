/**
 * Admin navigation.
 *
 * Grouped rather than a flat row of tabs: the old horizontal strip put seven
 * equal-weight links side by side, so nothing indicated which were the daily
 * screens and which were occasional. Grouping by what the screen is *for* —
 * the work coming in, the work in hand, the money — means the sidebar doubles
 * as a map of the business.
 *
 * Icons are inline SVG paths rather than an icon package. The set is small and
 * fixed, and a dependency for nine glyphs is not worth the weight on a site
 * whose speed is part of the pitch.
 */

export type NavKey =
  | "dashboard"
  | "leads"
  | "clients"
  | "projects"
  | "invoices"
  | "settings"
  | "account";

export type NavItem = {
  key: NavKey;
  label: string;
  /** Path relative to the admin root, as adminPath() expects. */
  path: string;
  /** SVG path data, drawn on a 24x24 grid with currentColor stroke. */
  icon: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Today",
        path: "dashboard",
        icon: "M4 13h7V4H4v9Zm9 7h7v-9h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z",
      },
    ],
  },
  {
    label: "Pipeline",
    items: [
      {
        key: "leads",
        label: "Leads",
        path: "leads",
        icon: "M3 7h18M3 12h18M3 17h10",
      },
      {
        key: "clients",
        label: "Clients",
        path: "clients",
        icon: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm11.5 9v-1a4 4 0 0 0-3-3.87",
      },
      {
        key: "projects",
        label: "Projects",
        path: "projects",
        icon: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
      },
    ],
  },
  {
    label: "Money",
    items: [
      {
        key: "invoices",
        label: "Invoices",
        path: "invoices",
        icon: "M7 3h10a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Zm2 5h6M9 12h6",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        key: "settings",
        label: "Business",
        path: "settings",
        icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8.4-3a8.4 8.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a8.3 8.3 0 0 0-2.2-1.3L15.3 2h-4l-.4 2.4a8.3 8.3 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a8.4 8.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a8.3 8.3 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a8.3 8.3 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.06-.43.1-.86.1-1.3Z",
      },
      {
        key: "account",
        label: "Your account",
        path: "account",
        icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4Z",
      },
    ],
  },
];

export const NAV_FLAT: NavItem[] = NAV.flatMap((g) => g.items);
