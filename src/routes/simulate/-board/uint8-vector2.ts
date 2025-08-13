export class Uint8Vector2 {
  private readonly array: Uint8Array;

  public constructor(private readonly size: number) {
    this.array = new Uint8Array(Math.pow(size, 2));
  }

  public cellOnBottom(x: number, y: number, wrap: boolean): null | number {
    if (!wrap) return this.isOutOfBounds(x, y + 1) ? null : this.get(x, y + 1);
    return this.get(x, intWrap(y + 1, 0, this.size - 1));
  }

  public cellOnBottomLeft(x: number, y: number, wrap: boolean): null | number {
    if (!wrap)
      return this.isOutOfBounds(x - 1, y + 1) ? null : this.get(x - 1, y + 1);
    return this.get(
      intWrap(x - 1, 0, this.size - 1),
      intWrap(y + 1, 0, this.size - 1),
    );
  }

  public cellOnBottomRight(x: number, y: number, wrap: boolean): null | number {
    if (!wrap)
      return this.isOutOfBounds(x + 1, y + 1) ? null : this.get(x + 1, y + 1);
    return this.get(
      intWrap(x + 1, 0, this.size - 1),
      intWrap(y + 1, 0, this.size - 1),
    );
  }

  public cellOnLeft(x: number, y: number, wrap: boolean): null | number {
    if (!wrap) return this.isOutOfBounds(x - 1, y) ? null : this.get(x - 1, y);
    return this.get(intWrap(x - 1, 0, this.size - 1), y);
  }

  public cellOnRight(x: number, y: number, wrap: boolean): null | number {
    if (!wrap) return this.isOutOfBounds(x + 1, y) ? null : this.get(x + 1, y);
    return this.get(intWrap(x + 1, 0, this.size - 1), y);
  }

  public cellOnTop(x: number, y: number, wrap: boolean): null | number {
    if (!wrap) return this.isOutOfBounds(x, y - 1) ? null : this.get(x, y - 1);
    return this.get(x, intWrap(y - 1, 0, this.size - 1));
  }

  public cellOnTopLeft(x: number, y: number, wrap: boolean): null | number {
    if (!wrap)
      return this.isOutOfBounds(x - 1, y - 1) ? null : this.get(x - 1, y - 1);
    return this.get(
      intWrap(x - 1, 0, this.size - 1),
      intWrap(y - 1, 0, this.size - 1),
    );
  }

  public cellOnTopRight(x: number, y: number, wrap: boolean): null | number {
    if (!wrap)
      return this.isOutOfBounds(x + 1, y - 1) ? null : this.get(x + 1, y - 1);
    return this.get(
      intWrap(x + 1, 0, this.size - 1),
      intWrap(y - 1, 0, this.size - 1),
    );
  }

  public fill(value: number): this {
    this.array.fill(value);
    return this;
  }

  public forEach(func: (value: number, x: number, y: number) => void): void {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        func(this.get(x, y), x, y);
      }
    }
  }

  public get(x: number, y: number): number {
    return this.array[y * this.size + x];
  }

  public *getNeighborhood(
    x: number,
    y: number,
    size: number,
  ): Generator<number> {
    for (const dy of arrayRange(-size, size)) {
      for (const dx of arrayRange(-size, size)) {
        if (dy === 0 && dx === 0) continue;
        if (x + dx < 0 || x + dx >= this.size) continue;
        if (y + dy < 0 || y + dy >= this.size) continue;
        yield this.get(x + dx, y + dy);
      }
    }
  }

  public *getWrappingNeighborhood(
    x: number,
    y: number,
    size: number,
  ): Generator<number> {
    for (const dy of arrayRange(-size, size)) {
      for (const dx of arrayRange(-size, size)) {
        if (dy === 0 && dx === 0) continue;
        const curY = intWrap(y + dy, 0, this.size - 1);
        const curX = intWrap(x + dx, 0, this.size - 1);
        yield this.get(curX, curY);
      }
    }
  }

  public isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || y < 0 || x >= this.size || y >= this.size;
  }

  public map(
    func: (value: number, x: number, y: number) => number,
  ): Uint8Vector2 {
    const newVector = new Uint8Vector2(this.size);
    this.forEach((value, x, y) => {
      const newValue = func(value, x, y);
      newVector.set(x, y, newValue);
    });
    return newVector;
  }

  public set(x: number, y: number, value: number): void {
    this.array[y * this.size + x] = value;
  }
}

function arrayRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

function intWrap(value: number, lower: number, upper: number): number {
  if (lower > upper)
    throw new Error("Lower bound cannot be greater than upper bound.");
  const rangeSize = upper - lower + 1;
  const normalizedValue = value - lower;
  const wrappedNormalized =
    ((normalizedValue % rangeSize) + rangeSize) % rangeSize;
  return wrappedNormalized + lower;
}
