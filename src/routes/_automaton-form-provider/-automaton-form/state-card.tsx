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
import { stringCapitalize } from "@/lib/extensions";

import { useAutomatonFormContext } from "./automaton-form-context.tsx";

interface StateCardProps {
  readonly stateName: string;
}

export function StateCard(props: StateCardProps) {
  const [state, setState] = useAutomatonFormContext();
  const colorId = useId();
  return (
    <Card className="rounded-r-none">
      <CardHeader>
        <CardTitle>{stringCapitalize(props.stateName)} State</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor={colorId}>
          <span>Color</span>
          <Input
            id={colorId}
            onChange={(e) => {
              setState.setStateColor(props.stateName, e.target.value);
            }}
            value={state.states[props.stateName].color}
          />
        </Label>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button
            onClick={() => {
              setState.removeState(props.stateName);
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
