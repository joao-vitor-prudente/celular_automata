import { Trash } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { PositionalNeighborTransition } from "@/lib/automaton/transitions";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form";

interface TransitionFormProps {
  readonly state: number;
  readonly transition: PositionalNeighborTransition;
  readonly transitionIndex: number;
}

export function PositionalNeighborTransitionForm(props: TransitionFormProps) {
  const [state, setState] = useAutomatonFormContext();
  const thenId = useId();
  const positionId = useId();
  const stateId = useId();

  function setTransitionThen(value: string) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.copyWith({ then: Number.parseInt(value) }),
      );
      return prev.setState(props.state, newState);
    });
  }

  function setTransitionIfPosition(value: string) {
    if (!PositionalNeighborTransition.validatePosition(value)) return;
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.setIfPosition(value),
      );
      return prev.setState(props.state, newState);
    });
  }

  function setTransitionIfState(value: string) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.setIfState(Number.parseInt(value)),
      );
      return prev.setState(props.state, newState);
    });
  }

  function removeTransition() {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.removeTransition(props.transitionIndex);
      return prev.setState(props.state, newState);
    });
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex gap-2">
        <Label className="flex-col items-start" htmlFor={positionId}>
          <span>Position</span>
          <Select
            onValueChange={setTransitionIfPosition}
            value={props.transition.if_.position.toString()}
          >
            <SelectTrigger id={positionId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex-col items-start" htmlFor={stateId}>
          <span>State</span>
          <Select
            onValueChange={setTransitionIfState}
            value={props.transition.if_.state.toString()}
          >
            <SelectTrigger id={stateId}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.states.map((s, index) => (
                <SelectItem key={s.name} value={index.toString()}>
                  {stringCapitalize(s.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </div>
      <div className="w-full" />
      <Label className="flex-col items-start" htmlFor={thenId}>
        <span>Then</span>
        <Select
          onValueChange={setTransitionThen}
          value={props.transition.then.toString()}
        >
          <SelectTrigger id={thenId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {state.states.map((s, index) => (
              <SelectItem
                disabled={index === props.state}
                key={s.name}
                value={index.toString()}
              >
                {stringCapitalize(s.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <Button onClick={removeTransition} variant="destructive">
        <Trash />
      </Button>
    </div>
  );
}
