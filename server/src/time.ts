// Wall-clock <-> UTC conversion for an IANA timezone without a library. Admin forms take datetime-local values
// in the organization's timezone; records store UTC ISO strings.

function tzOffsetMinutes(utcMillis: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(utcMillis));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - utcMillis) / 60000);
}

/** "YYYY-MM-DDTHH:mm" in `timeZone` -> UTC ISO string. Returns null for unparseable input. */
export function localToUtc(wall: string, timeZone: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(wall.trim());
  if (!m) return null;
  const naive = Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!, +(m[6] ?? 0));
  let guess = naive - tzOffsetMinutes(naive, timeZone) * 60000;
  guess = naive - tzOffsetMinutes(guess, timeZone) * 60000; // second pass settles DST edges
  return new Date(guess).toISOString();
}

/** UTC ISO -> "YYYY-MM-DDTHH:mm" in `timeZone`, for datetime-local inputs. */
export function utcToLocal(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
