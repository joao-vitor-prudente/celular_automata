import { type MouseEvent, useRef } from "react";

import type { Automaton } from "@/lib/automaton";

import { type UseBoard } from "@/routes/simulate/-board/use-board.ts";

export type UseBoardCanvas = ReturnType<typeof useBoardCanvas>;

interface BoardCanvasConfig {
  readonly borderSize: number;
  readonly cellSize: number;
}

export function useBoardCanvas(
  automaton: Automaton,
  board: UseBoard[0],
  brush: number,
  config: BoardCanvasConfig,
) {
  const isDrawing = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    board.ref.current.forEach((state, x, y) => {
      ctx.fillStyle = automaton.states[state].color;
      ctx.fillRect(
        x * config.cellSize + config.borderSize,
        y * config.cellSize + config.borderSize,
        config.cellSize - 2 * config.borderSize,
        config.cellSize - 2 * config.borderSize,
      );
    });
  }

  function clearCanvas() {
    canvasRef.current?.getContext("2d")?.reset();
  }

  function startDrawing(e: MouseEvent) {
    isDrawing.current = true;
    draw(e);
  }

  function mouseEventToCoords(e: MouseEvent) {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - bounds.left) / config.cellSize);
    const y = Math.floor((e.clientY - bounds.top) / config.cellSize);
    return { x, y };
  }

  function draw(e: MouseEvent) {
    if (!isDrawing.current) return;
    const { x, y } = mouseEventToCoords(e);
    if (board.ref.current.get(x, y) === brush) return;
    board.ref.current.set(x, y, brush);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = automaton.states[brush].color;
    ctx.fillRect(
      x * config.cellSize + config.borderSize,
      y * config.cellSize + config.borderSize,
      config.cellSize - 2 * config.borderSize,
      config.cellSize - 2 * config.borderSize,
    );
  }

  function stopDrawing() {
    isDrawing.current = false;
  }

  return [
    { config, ref: canvasRef },
    {
      clearCanvas,

      draw,
      drawBoard,
      startDrawing,
      stopDrawing,
    },
  ] as const;
}
