import { useEffect } from "react";

import type { useBoard } from "@/app/use-board.ts";
import type { useSimulationForm } from "@/app/use-simulation-form.ts";

export function Board(props: {
  board: ReturnType<typeof useBoard>;
  formValues: ReturnType<typeof useSimulationForm>["values"];
  isRunning: boolean;
}) {
  useEffect(() => {
    if (!props.isRunning) return;

    props.board.advance();
    const interval = setInterval(() => {
      props.board.advance();
    }, props.formValues.frameDuration);

    return () => {
      clearInterval(interval);
    };
  }, [props.isRunning, props.board.advance, props.formValues.frameDuration]);

  return (
    <section className="grid grid-cols-32 gap-1">
      {props.board.flatMap((cell, i, j, key) => (
        <button
          className="size-6 data-[status=0]:bg-card data-[status=1]:bg-card-foreground"
          data-status={cell}
          disabled={props.isRunning}
          key={key}
          onClick={() => {
            props.board.set(i, j, props.formValues.stateBrush);
          }}
        />
      ))}
    </section>
  );
}
