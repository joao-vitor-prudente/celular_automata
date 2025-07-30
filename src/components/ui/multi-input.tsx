import { XIcon } from "lucide-react";
import {
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MultiInputProps
  extends Omit<ComponentProps<typeof Input>, "onChange" | "value"> {
  onAdd?: (value: string) => void;
  onChange?: Dispatch<SetStateAction<string[]>>;
  value: string[];
}

interface MultiInputTagsProps
  extends Omit<ComponentProps<typeof Badge>, "onChange"> {
  onChange?: Dispatch<SetStateAction<string[]>>;
  onRemove?: (value: string) => void;
  value: string[];
}

export function MultiInput({
  onAdd,
  onChange,
  value,
  ...props
}: MultiInputProps) {
  const [pending, setPending] = useState("");

  function addPending() {
    if (!pending) return;
    onChange?.(Array.from(new Set([pending, ...value])));
    onAdd?.(pending);
    setPending("");
  }

  return (
    <div className="flex w-full">
      <Input
        className="rounded-r-none"
        onChange={(e) => {
          setPending(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addPending();
          } else if (e.key === "," || e.key === " ") {
            e.preventDefault();
            addPending();
          }
        }}
        value={pending}
        {...props}
      />
      <Button
        className="rounded-l-none border border-l-0"
        onClick={addPending}
        type="button"
        variant="secondary"
      >
        Add
      </Button>
    </div>
  );
}

export function MultiInputTags({
  onChange,
  onRemove,
  value,
  ...props
}: MultiInputTagsProps) {
  return (
    <div className="border rounded-b-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
      {value.map((item, idx) => (
        <Badge key={idx} variant="secondary" {...props}>
          {item}
          <button
            className="w-3 ml-2"
            onClick={() => {
              onChange?.(value.filter((i) => i !== item));
              onRemove?.(item);
            }}
            type="button"
          >
            <XIcon className="w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
