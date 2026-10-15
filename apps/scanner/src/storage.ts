// Persistence for the door state. localStorage is enough for one event's ledger and outbox (a few hundred KB
// at most); every read and write is guarded because private browsing or a cleared site can throw.
import type { DoorState } from "./core.ts";

const KEY = "omp.scanner.v1";

export interface Saved { server: string; doorCode: string; state: DoorState }

export function load(): Saved | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

export function save(s: Saved): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable: the session still works in memory */
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY);
  } catch { /* ignore */ }
}

export function scannerId(): string {
  try {
    const k = "omp.scanner.id";
    let id = localStorage.getItem(k);
    if (!id) {
      id = "door-" + Math.random().toString(36).slice(2, 7);
      localStorage.setItem(k, id);
    }
    return id;
  } catch {
    return "door-" + Math.random().toString(36).slice(2, 7);
  }
}
