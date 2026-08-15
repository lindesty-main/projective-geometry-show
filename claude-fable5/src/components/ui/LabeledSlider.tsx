import * as Slider from '@radix-ui/react-slider'

type LabeledSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  format?: (v: number) => string
  onChange: (v: number) => void
}

/** Radix Slider 封装：标签 + 当前值 */
export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  format = (v) => v.toFixed(2),
  onChange,
}: LabeledSliderProps) {
  return (
    <label className="flex min-w-52 flex-1 items-center gap-3 text-sm sm:flex-none">
      <span className="whitespace-nowrap text-ink-3">{label}</span>
      <Slider.Root
        className="relative flex h-5 w-full min-w-28 touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      >
        <Slider.Track className="relative h-1 grow rounded-full bg-white/15">
          <Slider.Range className="absolute h-full rounded-full bg-s1" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-4 rounded-full border border-white/30 bg-ink shadow transition-transform hover:scale-110 focus:outline-2 focus:outline-s1"
          aria-label={label}
        />
      </Slider.Root>
      <span className="w-12 whitespace-nowrap text-right font-mono text-xs text-ink-2">
        {format(value)}
      </span>
    </label>
  )
}
