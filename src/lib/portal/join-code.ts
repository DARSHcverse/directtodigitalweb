import "server-only";
import { randomInt } from "node:crypto";

/**
 * Client join codes.
 *
 * Format: TWC-XXXX-XXXX, e.g. TWC-7K4M-P2QX
 *
 * Grouped in fours because this gets read over the phone and typed off a
 * printed invoice. The alphabet omits characters that are misread when
 * spoken or handwritten — no O/0, I/1/L, S/5, Z/2, U/V — so "did you say
 * oh or zero" never happens.
 */

const ALPHABET = "ABCDEFGHJKMNPQRTWXY346789";
const PREFIX = "TWC";

export function generateJoinCode(): string {
  const block = () =>
    Array.from(
      { length: 4 },
      () => ALPHABET[randomInt(ALPHABET.length)],
    ).join("");

  return `${PREFIX}-${block()}-${block()}`;
}

/**
 * Accepts whatever the client actually types.
 *
 * People paste with spaces, omit the dashes, use lower case, and sometimes
 * leave off the prefix entirely because it looks like decoration. All of
 * those should sign in rather than fail.
 */
export function normaliseJoinCode(input: string): string {
  const cleaned = input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    // Common substitutions for characters not in the alphabet, so a code
    // transcribed by ear still works.
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");

  const body = cleaned.startsWith(PREFIX)
    ? cleaned.slice(PREFIX.length)
    : cleaned;

  if (body.length !== 8) return "";

  // Undo the substitutions above: the stored alphabet uses letters, not the
  // digits people sometimes hear.
  const restored = body.replace(/0/g, "O").replace(/1/g, "I");

  // Only reconstruct if every character is actually in our alphabet;
  // otherwise the substitution produced something we never issued.
  const valid = [...body].every((c) => ALPHABET.includes(c));
  const finalBody = valid ? body : restored;

  return `${PREFIX}-${finalBody.slice(0, 4)}-${finalBody.slice(4)}`;
}

/** Display form, for the admin and emails. */
export function formatJoinCode(code: string): string {
  return code;
}
