import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  frameDuration: z.number(),
  stateBrush: z.number(),
});

export function useSimulationForm() {
  const form = useForm({
    defaultValues: { frameDuration: 1000, stateBrush: 1 },
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
