// AT Protocol TIDs: 13-char base32-sortable record keys from microsecond time plus a clock id.
// Monotonic within a process; the clock id separates concurrent writers.
const ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";
const CLOCK_ID = BigInt(Math.floor(Math.random() * 1024));
let last = 0n;

export function nextTid(nowMicros: bigint = BigInt(Date.now()) * 1000n): string {
  let t = nowMicros;
  if (t <= last) t = last + 1n;
  last = t;
  let n = (t << 10n) | CLOCK_ID;
  let out = "";
  for (let i = 0; i < 13; i++) {
    out = ALPHABET[Number(n & 31n)] + out;
    n >>= 5n;
  }
  return out;
}

export function isTid(s: string): boolean {
  return /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/.test(s);
}
