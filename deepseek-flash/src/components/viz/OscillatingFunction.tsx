import { useEffect, useRef, useState } from 'react'
import { Pause, Play, ZoomIn, ZoomOut } from 'lucide-react'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { C } from '@/lib/colors'
import { clamp, fmt, smoothstep } from '@/lib/math'
import { clsx } from 'clsx'

const MIN_ZOOM = 1.4 // 视窗半宽（世界单位）
const MAX_ZOOM = 0.0004
const AUTO_PERIOD = 13 // 自动巡航周期（秒）

const halfFromSlider = (s: number) => MIN_ZOOM * Math.pow(MAX_ZOOM / MIN_ZOOM, s / 100)

interface OscillatingFunctionProps {
  active?: boolean
  className?: string
  /** 是否显示控制条（章节内 true，Hero 背景 false） */
  controls?: boolean
}

/**
 * 序章：f(x) = x·sin(1/x) 的放大镜之旅。
 * 自动巡航把镜头推向原点，也可手动缩放。
 */
export default function OscillatingFunction({
  active = true,
  className,
  controls = false,
}: OscillatingFunctionProps) {
  const [auto, setAuto] = useState(true)
  const [slider, setSlider] = useState(0)
  const autoRef = useRef(true)
  const halfRef = useRef(MIN_ZOOM)

  useEffect(() => {
    autoRef.current = auto
    if (auto) setSlider(0)
  }, [auto])

  useEffect(() => {
    halfRef.current = halfFromSlider(slider)
  }, [slider])

  const draw = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    _dt: number,
  ) => {
    ctx.clearRect(0, 0, w, h)

    let S = halfRef.current
    if (autoRef.current) {
      const p = (t % AUTO_PERIOD) / AUTO_PERIOD
      S = MIN_ZOOM * Math.exp(-9.2 * smoothstep(p))
      halfRef.current = S
    }
    const cx = w / 2
    const cy = h / 2
    const scale = Math.min(w / (2 * S), h / (2 * S))
    const X = (x: number) => cx + x * scale
    const Y = (y: number) => cy - y * scale

    // 坐标轴
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(w, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, h)
    ctx.stroke()

    // 十进制刻度
    const mag = Math.pow(10, Math.floor(Math.log10(S)))
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.font = '10px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    for (let k = 1; k <= 9; k++) {
      const v = k * mag
      if (v >= S * 0.92) continue
      ctx.fillText(k === 1 ? fmt(v, 1) : '', X(v), cy + 15)
      ctx.fillText(k === 1 ? `−${fmt(v, 1)}` : '', X(-v), cy + 15)
    }

    // 函数曲线（自适应采样：越深越密）
    const n = S < 0.05 ? 20000 : 5000
    const dx = (2 * S) / n
    ctx.save()
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 1.6
    ctx.shadowColor = 'rgba(34, 211, 238, 0.7)'
    ctx.shadowBlur = 10
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const x = -S + (i + 0.5) * dx
      const y = x * Math.sin(1 / x)
      const px = X(x)
      const py = Y(y)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.restore()

    // 原点
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#f8fafc'
    ctx.fill()

    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`视窗半宽 ${fmt(S)}`, 14, 18)
    if (autoRef.current) {
      ctx.textAlign = 'right'
      ctx.fillText('镜头正推向原点…', w - 14, 18)
    }
  }

  return (
    <div className={clsx('relative h-full w-full', className)}>
      <Canvas2D active={active} className="absolute inset-0 h-full w-full" draw={draw} interactive={false} />
      {controls && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setAuto((v) => !v)}
            className={clsx('btn-ghost px-3 py-1.5 text-xs', auto && 'border-brand-cyan/40 text-brand-cyan')}
          >
            {auto ? <Pause size={13} /> : <Play size={13} />}
            {auto ? '暂停巡航' : '自动巡航'}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => {
              setAuto(false)
              setSlider(Number(e.target.value))
            }}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-cyan"
            aria-label="缩放视窗"
          />
          <span className="font-mono text-[11px] text-slate-500">
            ×{fmt(halfFromSlider(slider) / MAX_ZOOM, 1)}
          </span>
          <button
            onClick={() => setSlider((s) => clamp(s + 8, 0, 100))}
            className="btn-ghost px-2.5 py-1.5"
            title="放大"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setSlider((s) => clamp(s - 8, 0, 100))}
            className="btn-ghost px-2.5 py-1.5"
            title="缩小"
          >
            <ZoomOut size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
