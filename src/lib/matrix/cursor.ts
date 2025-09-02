import type { Matrix } from "@/lib/matrix/matrix.ts";

interface CursorCases<TReturn> {
  readonly NonWrappingCursor: (cursor: NonWrappingCursor) => TReturn;
  readonly WrappingCursor: (cursor: WrappingCursor) => TReturn;
}

interface CursorInit {
  readonly matrix: Matrix;
  readonly x: number;
  readonly y: number;
}

export abstract class Cursor {
  public readonly matrix: Matrix;
  public x: number;
  public y: number;

  protected constructor(init: CursorInit) {
    this.matrix = init.matrix;
    this.x = init.x;
    this.y = init.y;
  }

  public static create(init: CursorInit, shouldWrap: boolean): Cursor {
    return shouldWrap ? new WrappingCursor(init) : new NonWrappingCursor(init);
  }

  public abstract copy(): Cursor;
  public abstract down(): Cursor;
  public abstract get(): null | number;
  public abstract left(): Cursor;
  public abstract match<TReturn>(cases: CursorCases<TReturn>): TReturn;
  public abstract right(): Cursor;
  public abstract set(value: number): Cursor;
  public abstract up(): Cursor;
}

export class NonWrappingCursor extends Cursor {
  private get isOutOfBounds(): boolean {
    return (
      this.x < 0 ||
      this.y < 0 ||
      this.x >= this.matrix.size ||
      this.y >= this.matrix.size
    );
  }

  public constructor(init: CursorInit) {
    super(init);
  }

  public override copy(): NonWrappingCursor {
    return new NonWrappingCursor({ matrix: this.matrix, x: this.x, y: this.y });
  }

  public override down(): this {
    this.y += 1;
    return this;
  }

  public override get(): null | number {
    return this.isOutOfBounds ? null : this.matrix.get(this.x, this.y);
  }

  public override left(): this {
    this.x -= 1;
    return this;
  }

  public override match<TReturn>(cases: CursorCases<TReturn>): TReturn {
    return cases.NonWrappingCursor(this);
  }

  public override right(): this {
    this.x += 1;
    return this;
  }

  public override set(value: number): this {
    this.matrix.set(this.x, this.y, value);
    return this;
  }

  public override up(): this {
    this.y -= 1;
    return this;
  }
}

export class WrappingCursor extends Cursor {
  public constructor(init: CursorInit) {
    super(init);
  }

  public override copy(): WrappingCursor {
    return new WrappingCursor({ matrix: this.matrix, x: this.x, y: this.y });
  }

  public override down(): this {
    this.y = this.wrap(this.y + 1);
    return this;
  }

  public override get(): number {
    return this.matrix.get(this.x, this.y);
  }

  public override left(): this {
    this.x = this.wrap(this.x - 1);
    return this;
  }

  public override match<TReturn>(cases: CursorCases<TReturn>): TReturn {
    return cases.WrappingCursor(this);
  }

  public override right(): this {
    this.x = this.wrap(this.x + 1);
    return this;
  }

  public override set(value: number): this {
    this.matrix.set(this.x, this.y, value);
    return this;
  }

  public override up(): this {
    this.y = this.wrap(this.y - 1);
    return this;
  }

  private wrap(value: number): number {
    return ((value % this.matrix.size) + this.matrix.size) % this.matrix.size;
  }
}
