import type { Cursor } from "@/lib/matrix/cursor.ts";

export class Neighborhood {
  private currentCursor: Cursor;
  private readonly cursorAtCenter: Cursor;

  public constructor(
    cursor: Cursor,
    private readonly size: number,
  ) {
    this.cursorAtCenter = cursor.copy();
    this.currentCursor = cursor.copy();
  }

  public *get(): Generator<number> {
    this.goToNeighborhoodCorner();
    for (const _ of Array.from({ length: this.size * 2 + 1 })) {
      const cursorAtStartOfRow = this.currentCursor.copy();
      for (const _ of Array.from({ length: this.size * 2 + 1 })) {
        const value = this.currentCursor.get();
        if (this.shouldYield(value)) yield value;
        this.currentCursor.right();
      }
      this.currentCursor = cursorAtStartOfRow;
      this.currentCursor.down();
    }
  }

  private goToNeighborhoodCorner() {
    for (const _ of Array.from({ length: this.size })) {
      this.currentCursor.up();
      this.currentCursor.left();
    }
  }

  private shouldYield(value: null | number): value is number {
    if (value === null) return false;
    return (
      this.currentCursor.x !== this.cursorAtCenter.x ||
      this.currentCursor.y !== this.cursorAtCenter.y
    );
  }
}
