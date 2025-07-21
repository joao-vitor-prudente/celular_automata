import type { UseSimulationForm } from "@/components/simulation-form/use-simulation-form.ts";
import type { Automaton } from "@/lib/automata.ts";

import { Button } from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { objectKeys, stringCapitalize } from "@/lib/extensions";

interface SimulationProps extends UseSimulationForm {
  readonly automaton: Automaton<string>;
  readonly isRunning: boolean;
  readonly onAdvanceAutomaton: () => void;
  readonly onToggleAutomaton: () => void;
}

export function SimulationForm(props: SimulationProps) {
  return (
    <section className="max-w-sm flex flex-col gap-4">
      <Form {...props.form}>
        <FormField
          control={props.form.control}
          name="stateBrush"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={props.ids.stateBrush}>State Brush</FormLabel>
              <FormControl>
                <Select
                  name={field.name}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={field.disabled}
                    id={props.ids.stateBrush}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  >
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectKeys(props.automaton.states).map((state) => (
                      <SelectItem key={state} value={state}>
                        {stringCapitalize(state)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The state to paint the initial configuration of the board
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={props.form.control}
          name="fps"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={props.ids.fps}>FPS</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={props.ids.fps}
                  onChange={(e) => {
                    field.onChange(Number.parseInt(e.target.value));
                  }}
                  type="number"
                />
              </FormControl>
              <FormDescription>
                Number of steps computed each second
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <Button onClick={props.onToggleAutomaton} type="button">
        {props.isRunning ? "Stop Automaton" : "Start Automaton"}
      </Button>
      <Button
        disabled={props.isRunning}
        onClick={props.onAdvanceAutomaton}
        type="button"
      >
        Advance Automaton
      </Button>
    </section>
  );
}
