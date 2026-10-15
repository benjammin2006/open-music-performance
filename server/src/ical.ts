// Minimal RFC 5545 output for one or more events. Lines folded at 75 octets.
export interface IcalEvent {
  uid: string;
  summary: string;
  description?: string;
  location?: string;
  url?: string;
  startsAt: string;
  endsAt?: string;
  stamp?: string;
}

export function icalCalendar(name: string, events: IcalEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Open Music Performance//OMP Server//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(name)}`,
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${esc(e.uid)}`,
      `DTSTAMP:${stamp(e.stamp ?? new Date().toISOString())}`,
      `DTSTART:${stamp(e.startsAt)}`,
      ...(e.endsAt ? [`DTEND:${stamp(e.endsAt)}`] : []),
      `SUMMARY:${esc(e.summary)}`,
      ...(e.description ? [`DESCRIPTION:${esc(e.description)}`] : []),
      ...(e.location ? [`LOCATION:${esc(e.location)}`] : []),
      ...(e.url ? [`URL:${e.url}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let i = 0;
  while (i < bytes.length) {
    let end = Math.min(i + (out.length ? 74 : 75), bytes.length);
    while (end < bytes.length && end > i && (bytes[end]! & 0xc0) === 0x80) end--;
    out.push((out.length ? " " : "") + new TextDecoder().decode(bytes.slice(i, end)));
    i = end;
  }
  return out.join("\r\n");
}
