/**
 * Values both the browser and the server need.
 *
 * Kept out of attachments.ts, which is server-only: the composer is a client
 * component and needs the limit to validate before uploading.
 */
export const MAX_BYTES = 10 * 1024 * 1024;

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
