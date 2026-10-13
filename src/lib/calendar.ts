/**
 * Calendar invites for confirmed calls.
 *
 * Times are entered in UK time and stored in the invite as UTC. A fixed
 * offset would be wrong for half the year — 10:00 in July is 09:00 UTC, in
 * January it is 10:00 — so the offset is read from Europe/London for the
 * date in question.
 */

const ZONE = "Europe/London";

/** Minutes London is ahead of UTC at a given instant (0 or 60). */
function londonOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
  );
  return Math.round((asUtc - at.getTime()) / 60_000);
}

/**
 * A UK wall-clock date and time ("2026-10-14", "10:00") as an instant.
 * The offset is checked twice so a time just across a clock change resolves
 * to the right side of it.
 */
export function londonToUtc(date: string, time: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;

  const naive = Date.UTC(+d[1]!, +d[2]! - 1, +d[3]!, +t[1]!, +t[2]!);
  let utc = naive - londonOffsetMinutes(new Date(naive)) * 60_000;
  const second = londonOffsetMinutes(new Date(utc));
  utc = naive - second * 60_000;
  return new Date(utc);
}

/** "Tuesday 14 October 2026 at 10:00am", in UK time. */
export function formatUkDateTime(at: Date): string {
  const date = at.toLocaleDateString("en-GB", {
    timeZone: ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = at
    .toLocaleTimeString("en-GB", {
      timeZone: ZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" ", "");
  return `${date} at ${time}`;
}

/** 20261014T090000Z */
function icsStamp(at: Date): string {
  return at.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** RFC 5545 text escaping. */
function icsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Lines over 75 octets must be folded, or some calendars reject the file. */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  while (Buffer.byteLength(rest, "utf8") > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut), "utf8") > 75) cut--;
    out.push(rest.slice(0, cut));
    rest = " " + rest.slice(cut);
  }
  out.push(rest);
  return out.join("\r\n");
}

export type CallEvent = {
  uid: string;
  start: Date;
  minutes: number;
  summary: string;
  description: string;
  location: string;
};

/**
 * A single-event .ics file.
 *
 * METHOD:PUBLISH rather than REQUEST: this is "add to your calendar", not a
 * meeting invitation expecting an RSVP, which avoids calendars asking the
 * client to accept or decline and emailing replies back.
 */
export function buildIcs(event: CallEvent): string {
  const end = new Date(event.start.getTime() + event.minutes * 60_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Trade Web Co//Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(event.start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsText(event.summary)}`,
    `DESCRIPTION:${icsText(event.description)}`,
    `LOCATION:${icsText(event.location)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "TRIGGER:-PT15M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Link that opens a pre-filled Google Calendar event. */
export function googleCalendarHref(event: CallEvent): string {
  const end = new Date(event.start.getTime() + event.minutes * 60_000);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: event.summary,
    dates: `${icsStamp(event.start)}/${icsStamp(end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
