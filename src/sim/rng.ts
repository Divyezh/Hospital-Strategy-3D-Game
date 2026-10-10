/**
 * Deterministic Mulberry32 seeded Pseudo-Random Number Generator
 */
export class PRNG {
  private s: number;

  constructor(seed = 123456789) {
    this.s = seed;
  }

  // Returns random float between 0 and 1
  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Returns float in [min, max)
  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Returns integer in [min, max]
  public rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  // Pick random element from array
  public choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

export const defaultRNG = new PRNG(424242);
