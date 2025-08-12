import { type ChangeEvent, useId } from "react";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { stringCapitalize } from "@/lib/utils";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";

interface StateCardProps {
  readonly stateIndex: number;
}

export function StateCard(props: StateCardProps) {
  const [state, setState] = useAutomatonFormContext();
  const colorId = useId();

  function setColor(e: ChangeEvent<HTMLInputElement>) {
    setState((prev) => {
      const oldState = prev.states[props.stateIndex];
      const newState = oldState.copyWith({ color: e.target.value });
      return prev.setState(props.stateIndex, newState);
    });
  }

  function removeState() {
    setState((prev) => prev.removeState(props.stateIndex));
  }

  return (
    <Card className="rounded-r-none">
      <CardHeader>
        <CardTitle>
          {stringCapitalize(state.states[props.stateIndex].name)} State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor={colorId}>
          <span>Color</span>
          <Input
            id={colorId}
            onChange={setColor}
            value={state.states[props.stateIndex].color}
          />
        </Label>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button onClick={removeState} variant="destructive">
            Delete State
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
