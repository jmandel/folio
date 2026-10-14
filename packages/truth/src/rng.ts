// Seeded PRNG. `new Rng("label")` is a stream fixed by its label, so each patient (or each part of a
// patient) draws from its own stream and adding a patient never changes the others.

function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class Rng {
  private s: number;
  constructor(readonly label: string) {
    this.s = hash32(label) || 1;
  }
  /** Uniform in [0, 1). mulberry32. */
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(lo: number, hi: number): number {
    return lo + Math.floor(this.next() * (hi - lo + 1));
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(xs: readonly T[]): T {
    return xs[Math.floor(this.next() * xs.length)];
  }
  weighted<T>(xs: readonly (readonly [T, number])[]): T {
    const total = xs.reduce((a, [, w]) => a + w, 0);
    let r = this.next() * total;
    for (const [x, w] of xs) if ((r -= w) < 0) return x;
    return xs[xs.length - 1][0];
  }
  normal(mu: number, sd: number): number {
    const u = 1 - this.next();
    const v = this.next();
    return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  shuffle<T>(xs: T[]): T[] {
    for (let i = xs.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [xs[i], xs[j]] = [xs[j], xs[i]];
    }
    return xs;
  }
  fork(label: string): Rng {
    return new Rng(`${this.label}/${label}`);
  }
  /** Deterministic digits string of length n. */
  digits(n: number): string {
    let s = "";
    for (let i = 0; i < n; i++) s += String(this.int(0, 9));
    return s;
  }
}

export { hash32 };
