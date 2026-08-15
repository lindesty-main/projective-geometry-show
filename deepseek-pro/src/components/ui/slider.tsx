import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
  className?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  format,
  onChange,
  className,
}: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium tracking-wide text-zinc-400">{label}</span>
        <span className="font-mono tabular-nums text-zinc-200">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <SliderPrimitive.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      >
        <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-white/10">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-4 cursor-grab rounded-full border border-white/40 bg-zinc-100 shadow transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400/60" />
      </SliderPrimitive.Root>
    </div>
  );
}
