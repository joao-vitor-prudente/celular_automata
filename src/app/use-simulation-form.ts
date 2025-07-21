import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm, type UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";

import type { Automaton } from "@/app/automata.ts";

const formSchema = z.object({
  frameDuration: z.number(),
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
    defaultValues: { frameDuration: 1000, stateBrush: automaton.baseState },
    resolver: zodResolver(formSchema),
  });
  const frameDuration = useWatch({
    control: form.control,
    name: "frameDuration",
  });
  const stateBrush = useWatch({
    control: form.control,
    name: "stateBrush",
  });
  const stateBrushSelectId = useId();
  const frameDurationInputId = useId();

  return {
    form,
    ids: {
      frameDuration: frameDurationInputId,
      stateBrush: stateBrushSelectId,
    },
    values: {
      frameDuration,
      stateBrush,
    },
  };
}
