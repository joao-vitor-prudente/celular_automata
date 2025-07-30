import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import type { AutomatonStepData } from "@/routes/create/-create-automaton-context/create-automaton-context.ts";

import { Button } from "@/components/ui/button.tsx";
import { useAppForm } from "@/components/ui/form.tsx";
import { useCreateAutomaton } from "@/routes/create/-create-automaton-context/use-create-automaton.ts";

export const Route = createFileRoute("/create/automaton-step")({
  component: RouteComponent,
});

const schema = z.object({
  id: z.string(),
  name: z.string(),
  stateNames: z.array(z.string()),
});
const defaultValues: AutomatonStepData = { id: "", name: "", stateNames: [] };

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [_data, setData] = useCreateAutomaton<"automaton">();
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setData(value);
      await navigate({ to: "/create/states-step" });
    },
    validators: {
      onChange: schema,
    },
  });
  return (
    <section className="space-y-6 p-8 w-md">
      <header>
        <h4 className="text-lg">Automaton</h4>
        <p className="text-muted-foreground">
          Fill in the data regarding the automaton it self
        </p>
      </header>
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppForm>
          <form.AppField name="id">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Automaton ID</field.FormLabel>
                <field.FormControl>
                  <field.Input />
                </field.FormControl>
                <field.FormDescription>
                  The unique identifier for the automaton
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
          <form.AppField name="name">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>Name</field.FormLabel>
                <field.FormControl>
                  <field.Input />
                </field.FormControl>
                <field.FormDescription>
                  The name for the automaton
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
          <form.AppField name="stateNames">
            {(field) => (
              <field.FormItem>
                <field.FormLabel>State Names</field.FormLabel>
                <field.FormControl>
                  <div>
                    <field.MultiInput />
                    <field.MultiInputTags />
                  </div>
                </field.FormControl>
                <field.FormDescription>
                  The names for the states each cell can be in
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          </form.AppField>
        </form.AppForm>
        <Button className="w-full mt-4">Next</Button>
      </form>
    </section>
  );
}
