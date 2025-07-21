import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm, type UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Automaton } from "@/app/automata.ts";

const formSchema = z.object({
  fps: z.number(),
  stateBrush: z.string(),
});

export interface UseSimulationForm {
  form: UseFormReturn<FormData>;
  ids: Record<keyof FormData, string>;
  values: FormData;
}

type FormData = z.infer<typeof formSchema>;

export function useSimulationForm(
  automaton: Automaton<string>,
): UseSimulationForm {
  const form = useForm({
    defaultValues: { fps: 5, stateBrush: automaton.baseState },
    resolver: zodResolver(formSchema),
  });
  const fps = useWatch({
    control: form.control,
    name: "fps",
  });
  const stateBrush = useWatch({
    control: form.control,
    name: "stateBrush",
  });
  const stateBrushSelectId = useId();
  const fpsInputId = useId();

  return {
    form,
    ids: {
      fps: fpsInputId,
      stateBrush: stateBrushSelectId,
    },
    values: {
      fps,
      stateBrush,
    },
  };
}
