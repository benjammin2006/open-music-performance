// Per-event revocation list in the shape of the W3C Bitstring Status List: one bit per ticket serial,
// gzip-compressed and base64url-encoded so a 10,000-ticket event's list is a few hundred bytes.
// Scanners download it whenever online and keep the last copy; a set bit means "revoked".
import { base64urlDecode, base64urlEncode } from "./encoding.ts";

export class StatusList {
  private bits: Uint8Array;
  readonly size: number;

  constructor(size: number, bits?: Uint8Array) {
    this.size = size;
    if (!Number.isInteger(size) || size <= 0) throw new Error("size must be a positive integer");
    const bytes = Math.ceil(size / 8);
    this.bits = bits ?? new Uint8Array(bytes);
    if (this.bits.length !== bytes) throw new Error("bit array length does not match size");
  }

  get(index: number): boolean {
    if (index < 0 || index >= this.size) return false;
    return (this.bits[index >> 3]! & (1 << (index & 7))) !== 0;
  }

  set(index: number, value = true): void {
    if (index < 0 || index >= this.size) throw new RangeError(`index ${index} outside list of size ${this.size}`);
    if (value) this.bits[index >> 3]! |= 1 << (index & 7);
    else this.bits[index >> 3]! &= ~(1 << (index & 7));
  }

  /** Serials currently marked revoked. */
  revoked(): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.size; i++) if (this.get(i)) out.push(i);
    return out;
  }

  /** `{ size, encodedList }` where encodedList is base64url(gzip(bits)). */
  async encode(): Promise<{ size: number; encodedList: string }> {
    const gz = await gzip(this.bits);
    return { size: this.size, encodedList: base64urlEncode(gz) };
  }

  static async decode(input: { size: number; encodedList: string }): Promise<StatusList> {
    const bits = await gunzip(base64urlDecode(input.encodedList));
    return new StatusList(input.size, bits);
  }
}

async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip");
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(cs);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("gzip");
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
