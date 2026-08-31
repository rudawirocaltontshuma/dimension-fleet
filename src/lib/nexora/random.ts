// Deterministic seeded PRNG utilities for mock data generation.
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private next: () => number;
  constructor(seed: number) {
    this.next = mulberry32(seed);
  }
  float(min = 0, max = 1) {
    return min + this.next() * (max - min);
  }
  int(min: number, max: number) {
    return Math.floor(this.float(min, max + 1));
  }
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
  pickMany<T>(arr: readonly T[], n: number): T[] {
    const copy = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i++) {
      const idx = this.int(0, copy.length - 1);
      out.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return out;
  }
  bool(pTrue = 0.5) {
    return this.next() < pTrue;
  }
  weighted<T>(items: [T, number][]): T {
    const total = items.reduce((s, [, w]) => s + w, 0);
    let r = this.float(0, total);
    for (const [item, w] of items) {
      if (r < w) return item;
      r -= w;
    }
    return items[items.length - 1][0];
  }
  dateWithinDays(daysAgo: number, referenceISO: string): Date {
    const ref = new Date(referenceISO).getTime();
    const offset = this.int(0, daysAgo) * 86400000;
    const jitter = this.int(0, 86399000);
    return new Date(ref - offset - jitter);
  }
  futureDateWithinDays(daysAhead: number, referenceISO: string): Date {
    const ref = new Date(referenceISO).getTime();
    const offset = this.int(0, daysAhead) * 86400000;
    return new Date(ref + offset);
  }
}
