export class Matrix {
  private readonly array: Uint8Array;

  public constructor(public readonly size: number) {
    this.array = new Uint8Array(Math.pow(size, 2));
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

  public map(func: (value: number, x: number, y: number) => number): Matrix {
    const newVector = new Matrix(this.size);
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
