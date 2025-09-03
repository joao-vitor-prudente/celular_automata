import { Info } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { TransitionFactory } from "@/lib/automaton/transitions";
import { TransitionType } from "@/lib/automaton/transitions/transition.ts";
import { stringCapitalize } from "@/lib/utils.ts";
import { useAutomatonFormContext } from "@/routes/_automaton-form-provider/-automaton-form/automaton-form-context.tsx";
import {
  BaseTransitionForm,
  ExactNumberOfNeighborsTransitionForm,
  PositionalNeighborTransitionForm,
} from "@/routes/_automaton-form-provider/-automaton-form/transition-form";

interface TransitionsCardProps {
  readonly state: number;
}

export function TransitionsCard(props: TransitionsCardProps) {
  const [state, setState] = useAutomatonFormContext();

  function addTransition(type: TransitionType) {
    setState((prev) => {
      const oldState = prev.states[props.state];
      const newTransition = new TransitionFactory().blank(type, {
        originState: props.state,
        stateCount: prev.states.length,
      });
      const newState = oldState.addTransition(newTransition);
      return prev.setState(props.state, newState);
    });
  }

  function addExactNumberOfNeighborsTransition() {
    addTransition(TransitionType.exactNumberOfNeighbors);
  }

  function addPositionalNeighborTransition() {
    addTransition(TransitionType.positionalNeighbor);
  }

  function addAlwaysTransition() {
    addTransition(TransitionType.always);
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
              AlwaysTransition: () => (
                <li key={index}>
                  <BaseTransitionForm
                    state={props.state}
                    transition={transition}
                    transitionIndex={index}
                  />
                </li>
              ),
              ExactNumberOfNeighborsTransition: (transition) => (
                <li key={index}>
                  <ExactNumberOfNeighborsTransitionForm
                    state={props.state}
                    transition={transition}
                    transitionIndex={index}
                  />
                </li>
              ),
              PositionalNeighborTransition: (transition) => (
                <PositionalNeighborTransitionForm
                  state={props.state}
                  transition={transition}
                  transitionIndex={index}
                />
              ),
            }),
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Add Transition</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Transition Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-between"
                onClick={addExactNumberOfNeighborsTransition}
              >
                <span>Exact number of neighbors</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info />
                    <TooltipContent>
                      Transition based on number of cells in each state cell
                      surrounding the current cell
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="justify-between"
                onClick={addPositionalNeighborTransition}
              >
                <span>Positional neighbor</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info />
                    <TooltipContent>
                      Transition based on the state of the cell in a given
                      position relative to the current cell
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="justify-between"
                onClick={addAlwaysTransition}
              >
                <span>Always</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info />
                    <TooltipContent>
                      Transition the current cell always to the given state
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
