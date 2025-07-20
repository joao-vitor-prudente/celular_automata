import { useState } from "react";

export function useBoard(size: number) {
  const [boardState, setBoardState] = useState(
    Array.from({ length: size }, () => Array.from({ length: size }, () => 0)),
  );

  function advance() {
    setBoardState((prev) => {
      const curr = prev.map((row) => [...row]);
      for (const [i, row] of prev.entries()) {
        for (const [j, cell] of row.entries()) {
          const leftIndex = j - 1 < 0 ? row.length - 1 : j - 1;
          const rightIndex = j + 1 > row.length - 1 ? 0 : j + 1;
          const topIndex = i - 1 < 0 ? prev.length - 1 : i - 1;
          const bottomIndex = i + 1 > prev.length - 1 ? 0 : i + 1;
          const surroundingStates = [
            prev[topIndex][leftIndex],
            prev[topIndex][j],
            prev[topIndex][rightIndex],
            prev[i][leftIndex],
            prev[i][rightIndex],
            prev[bottomIndex][leftIndex],
            prev[bottomIndex][j],
            prev[bottomIndex][rightIndex],
          ];

          const aliveCount = surroundingStates.reduce((a, b) => a + b, 0);
          if (cell === 0 && aliveCount === 3) curr[i][j] = 1;
          if (cell === 1 && aliveCount < 2) curr[i][j] = 0;
          if (cell === 1 && aliveCount > 3) curr[i][j] = 0;
          if (cell === 1 && (aliveCount === 2 || aliveCount === 3))
            curr[i][j] = 1;
        }
      }
      return curr;
    });
  }

  function flatMap<T>(
    func: (cell: number, i: number, j: number, key: string) => T,
  ): T[] {
    return boardState.flatMap((row, i) =>
      row.map((cell, j) =>
        func(cell, i, j, `(${i.toString()}),${j.toString()})`),
      ),
    );
  }

  function set(i: number, j: number, value: number) {
    setBoardState((prev) => {
      const curr = prev.map((row) => [...row]);
      curr[i][j] = value;
      return curr;
    });
  }

  return { advance, flatMap, set };
}
