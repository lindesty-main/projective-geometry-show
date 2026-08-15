import type { ReactNode } from 'react'
import { MousePointer2 } from 'lucide-react'

type DemoPanelProps = {
  title: string
  hint?: string
  controls?: ReactNode
  caption?: ReactNode
  children: ReactNode
}

/** 交互演示容器：标题栏 + 画布区 + 控制区 + 说明 */
export function DemoPanel({ title, hint, controls, caption, children }: DemoPanelProps) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-2xl shadow-black/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-5 py-3">
        <span className="text-sm font-medium text-ink">{title}</span>
        {hint && (
          <span className="flex items-center gap-1.5 text-xs text-ink-3">
            <MousePointer2 className="size-3.5" aria-hidden />
            {hint}
          </span>
        )}
      </div>
      <div className="relative">{children}</div>
      {controls && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/8 px-5 py-4">
          {controls}
        </div>
      )}
      {caption && (
        <figcaption className="border-t border-white/8 px-5 py-3 text-[13px] leading-relaxed text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
