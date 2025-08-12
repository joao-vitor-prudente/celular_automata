import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ExactNumberOfNeighborsTransition } from "@/lib/automaton";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";
import { ExactNumberOfNeighborsTransitionForm } from "@/routes/_automaton-form-provider/-automaton-form/transition-form/exact-number-of-neighbors-transition-form.tsx";

interface TransitionsCardProps {
  readonly state: number;
}

export function TransitionsCard(props: TransitionsCardProps) {
  const [state, setState] = useAutomatonFormContext();

  function addTransition() {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newTransition = ExactNumberOfNeighborsTransition.blank(
        prev.states.length,
        props.state,
      );
      const newState = oldState.addTransition(newTransition);
      return prev.setState(props.state, newState);
    });
  }

  return (
    <Card className="rounded-l-none">
      <CardHeader>
        <CardTitle>
          {stringCapitalize(state.states[props.state].name)} Transitions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {state.states[props.state].transitions.map((transition, index) =>
            transition.match({
              ExactNumberOfNeighborsTransition: (transition) => (
                <li key={index}>
                  <ExactNumberOfNeighborsTransitionForm
                    state={props.state}
                    transition={transition}
                    transitionIndex={index}
                  />
                </li>
              ),
            }),
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <CardAction>
          <Button onClick={addTransition} variant="secondary">
            Add Transition
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
