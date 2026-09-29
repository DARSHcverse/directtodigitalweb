/**
 * The admin lives under a configured path rather than /admin, so bots
 * scanning for well-known paths do not find it.
 *
 * This is obscurity, not security: the path leaks through browser history,
 * the Referer header and bookmarks. Every admin route is behind a real
 * session check regardless — the path only reduces noise.
 */
export const ADMIN_SEGMENT = process.env.ADMIN_PATH?.trim() || "office";

export const adminPath = (sub = "") =>
  `/${ADMIN_SEGMENT}${sub ? `/${sub}` : ""}`;
