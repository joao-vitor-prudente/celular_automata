import { useId } from "react";

import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { ExactNumberOfNeighborsTransition } from "@/lib/automaton/transitions";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";
import {
  BaseTransitionForm,
  type TransitionFormProps,
} from "@/routes/_automaton-form-provider/-automaton-form/transition-form/base-transition-form.tsx";

interface CountSelectProps
  extends TransitionFormProps<ExactNumberOfNeighborsTransition> {
  readonly ifState: number;
}

export function ExactNumberOfNeighborsTransitionForm(
  props: TransitionFormProps<ExactNumberOfNeighborsTransition>,
) {
  const [state] = useAutomatonFormContext();

  return (
    <BaseTransitionForm {...props}>
      <ul className="flex gap-2">
        {state.states.map((s, index) => (
          <li key={s.name}>
            <CountSelect {...props} ifState={index} />
          </li>
        ))}
      </ul>
    </BaseTransitionForm>
  );
}

function CountSelect(props: CountSelectProps) {
  const [state, setState] = useAutomatonFormContext();
  const countId = useId();

  function setTransitionIf(value: string) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newState = oldState.setTransition(
        props.transitionIndex,
        props.transition.setIf(props.ifState, Number.parseInt(value)),
      );
      return prev.setState(props.state, newState);
    });
  }

  return (
    <Label className="flex-col items-start" htmlFor={countId}>
      <span>{stringCapitalize(state.states[props.ifState].name)}</span>
      <Select
        onValueChange={setTransitionIf}
        value={props.transition.if_[props.ifState].toString()}
      >
        <SelectTrigger id={countId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 9 }, (_, i) => i.toString()).map((count) => (
            <SelectItem key={count} value={count}>
              {count}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Label>
  );
}
