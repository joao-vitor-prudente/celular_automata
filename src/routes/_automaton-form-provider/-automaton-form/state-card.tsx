import { useId } from "react";

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
            onChange={(e) => {
              setState.setStateColor(props.stateIndex, e.target.value);
            }}
            value={state.states[props.stateIndex].color}
          />
        </Label>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button
            onClick={() => {
              setState.removeState(props.stateIndex);
            }}
            variant="destructive"
          >
            Delete State
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
