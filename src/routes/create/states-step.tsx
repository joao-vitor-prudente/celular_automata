import { useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useAppForm } from "@/components/ui/form.tsx";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  arrayToRecord,
  objectEntries,
  stringCapitalize,
} from "@/lib/extensions";
import { useCreateAutomaton } from "@/routes/create/-create-automaton-context/use-create-automaton.ts";

export const Route = createFileRoute("/create/states-step")({
  component: RouteComponent,
});

function RouteComponent() {
  const [data, setData] = useCreateAutomaton<"states">();
  const navigate = Route.useNavigate();
  const statesForm = useAppForm({
    defaultValues: arrayToRecord(data.stateNames, ""),
    validators: { onChange: z.record(z.string(), z.string()) },
  });
  const statesFormValues = useStore(statesForm.store, (state) => state.values);
  const form = useAppForm({
    defaultValues: { baseState: "" },
    onSubmit: async ({ value }) => {
      const statesData = objectEntries(statesFormValues).map(
        ([name, color]) => ({ color, name }),
      );
      setData({ baseState: value.baseState, statesData });
      await navigate({ to: "/create/transitions-step" });
    },
    validators: { onChange: z.object({ baseState: z.string() }) },
  });
  return (
    <section className="space-y-6 p-8 w-md">
      <header>
        <h4 className="text-lg">States</h4>
        <p className="text-muted-foreground">
          Fill in the data regarding the automaton states.
        </p>
      </header>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <statesForm.AppForm>
          <ul className="space-y-4">
            {data.stateNames.map((stateName) => (
              <li key={stateName}>
                <Card>
                  <CardHeader>
                    <CardTitle>{stringCapitalize(stateName)}</CardTitle>
                    <CardDescription>
                      Fill in the data regarding the {stateName} state
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <statesForm.AppField name={stateName}>
                      {(field) => (
                        <field.FormItem>
                          <field.FormLabel>State Color</field.FormLabel>
                          <field.FormControl>
                            <field.Input />
                          </field.FormControl>
                          <field.FormDescription>
                            The color that represents the state
                          </field.FormDescription>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    </statesForm.AppField>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </statesForm.AppForm>
        <form.AppForm>
          <form.AppField name="baseState">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Base State</field.FormLabel>
                <field.FormControl>
                  <field.Select>
                    <field.SelectTrigger className="w-full">
                      <SelectValue placeholder="State" />
                    </field.SelectTrigger>
                    <SelectContent>
                      {data.stateNames.map((stateName) => (
                        <SelectItem key={stateName} value={stateName}>
                          {stringCapitalize(stateName)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </field.Select>
                </field.FormControl>
                <field.FormDescription>
                  The state to which cells default to
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
        </form.AppForm>
        <Button className="w-full">Next</Button>
      </form>
    </section>
  );
}
