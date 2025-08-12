import { type Ref, useEffect } from "react";

import type { Automaton } from "@/lib/automaton";
import type { UseBoardCanvas } from "@/routes/simulate/-board/use-board-canvas.ts";
import type { UseBoard } from "@/routes/simulate/-board/use-board.ts";

interface BoardProps {
  readonly automaton: Automaton;
  readonly board: UseBoard[0];
  readonly canvas: UseBoardCanvas[0];
  readonly fps: number;
  readonly isRunning: boolean;
  readonly ref: Ref<HTMLCanvasElement>;
  readonly setBoard: UseBoard[1];
  readonly setCanvas: UseBoardCanvas[1];
}

export function Board(props: BoardProps) {
  useEffect(() => {
    props.setCanvas.drawBoard();
    return () => {
      props.setCanvas.clearCanvas();
    };
  }, [props.board.ref.current]);

  useEffect(() => {
    if (!props.isRunning) return;

    props.setBoard.advance();
    props.setCanvas.drawBoard();

    const interval = setInterval(() => {
      props.setBoard.advance();
      props.setCanvas.drawBoard();
    }, 1000 / props.fps);

    return () => {
      clearInterval(interval);
    };
  }, [props.isRunning, props.fps]);

  return (
    <canvas
      height={props.canvas.config.cellSize * props.board.config.boardSize}
      onMouseDown={props.setCanvas.startDrawing}
      onMouseLeave={props.setCanvas.stopDrawing}
      onMouseMove={props.setCanvas.draw}
      onMouseUp={props.setCanvas.stopDrawing}
      ref={props.ref}
      width={props.canvas.config.cellSize * props.board.config.boardSize}
    />
  );
}
