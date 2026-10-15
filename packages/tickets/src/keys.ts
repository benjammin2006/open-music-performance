// Issuer keys. An organization signs tickets with an Ed25519 key; the public half is published in its
// organization record (`issuerKeys[].publicKeyMultibase`) using the did:key convention:
// multibase base58btc ("z" prefix) of the multicodec ed25519-pub prefix 0xed 0x01 followed by the 32 raw bytes.
import { base58btcDecode, base58btcEncode } from "./encoding.ts";

const ED25519_PUB_PREFIX = new Uint8Array([0xed, 0x01]);

export interface IssuerKeyPair {
  /** Key id carried in every token so scanners can pick the right public key. */
  kid: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
  /** did:key-style multibase string, as stored in the organization record. */
  publicKeyMultibase: string;
}

export async function generateIssuerKey(kid: string): Promise<IssuerKeyPair> {
  const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"])) as CryptoKeyPair;
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  return { kid, privateKey: pair.privateKey, publicKey: pair.publicKey, publicKeyMultibase: encodePublicKeyMultibase(raw) };
}

export function encodePublicKeyMultibase(raw32: Uint8Array): string {
  if (raw32.length !== 32) throw new Error("Ed25519 public key must be 32 bytes");
  const bytes = new Uint8Array(2 + 32);
  bytes.set(ED25519_PUB_PREFIX, 0);
  bytes.set(raw32, 2);
  return "z" + base58btcEncode(bytes);
}

export function decodePublicKeyMultibase(s: string): Uint8Array {
  if (!s.startsWith("z")) throw new Error("expected multibase base58btc (z prefix)");
  const bytes = base58btcDecode(s.slice(1));
  if (bytes.length !== 34 || bytes[0] !== 0xed || bytes[1] !== 0x01) throw new Error("not an ed25519-pub multicodec key");
  return bytes.slice(2);
}

export async function importPublicKey(publicKeyMultibase: string): Promise<CryptoKey> {
  const raw = decodePublicKeyMultibase(publicKeyMultibase);
  return crypto.subtle.importKey("raw", raw as BufferSource, { name: "Ed25519" }, true, ["verify"]);
}

/** Export the private key as a JWK for storage in the issuer key service (encrypted at rest by the caller). */
export async function exportPrivateKeyJwk(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey("jwk", key);
}

export async function importPrivateKeyJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, true, ["sign"]);
}
