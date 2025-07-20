import type { useSimulationForm } from "@/app/use-simulation-form.ts";

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

export function SimulationForm(
  props: ReturnType<typeof useSimulationForm> & {
    isRunning: boolean;
    onAdvanceAutomaton: () => void;
    onToggleAutomaton: () => void;
  },
) {
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
                  onValueChange={(v) => {
                    field.onChange(Number.parseInt(v));
                  }}
                  value={field.value.toString()}
                >
                  <SelectTrigger
                    disabled={field.disabled}
                    id={props.ids.stateBrush}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  >
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Dead</SelectItem>
                    <SelectItem value="1">Alive</SelectItem>
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
          name="frameDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={props.ids.frameDuration}>
                Frame Duration
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id={props.ids.frameDuration}
                  onChange={(e) => {
                    field.onChange(Number.parseInt(e.target.value));
                  }}
                />
              </FormControl>
              <FormDescription>Duration of each frame in ms</FormDescription>
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
