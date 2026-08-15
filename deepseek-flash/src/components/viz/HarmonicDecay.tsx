import { useRef, useState } from 'react'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { C } from '@/lib/colors'

const MAX_N = 30

interface HarmonicDecayProps {
  active?: boolean
}

/**
 * 第六章：收缩的节奏。
 * 左：枕木距地平线 y_n = 1/n（调和级数）
 * 右：相邻间距 d_n = 1/n − 1/(n+1) ≈ 1/n²（平方倒数）
 */
export default function HarmonicDecay({ active = true }: HarmonicDecayProps) {
  const [n, setN] = useState(12)
  const nRef = useRef(n)
  nRef.current = n

  const draw = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    _t: number,
    _dt: number,
  ) => {
    ctx.clearRect(0, 0, w, h)
    const N = nRef.current

    const panelW = w / 2
    const padL = 46
    const padR = 16
    const padT = 34
    const padB = 34
    const plotW = panelW - padL - padR
    const plotH = h - padT - padB

    const drawPanel = (
      left: number,
      title: string,
      sub: string,
      color: string,
      fn: (k: number) => number,
      refCurve: (x: number) => number,
      refLabel: string,
      refColor: string,
      yMax: number,
    ) => {
      // 面板
      const x0 = left + padL
      const y0 = padT
      const X = (i: number) => x0 + (i / N) * plotW
      const Y = (v: number) => y0 + plotH - (v / yMax) * plotH

      // 标题
      ctx.fillStyle = 'rgba(226, 232, 240, 0.9)'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(title, left + padL, 20)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
      ctx.font = '10px sans-serif'
      ctx.fillText(sub, left + padL, 34)

      // 框
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.strokeRect(left + padL, padT, plotW, plotH)

      // 轴刻度
      ctx.fillStyle = 'rgba(148, 163, 184, 0.55)'
      ctx.font = '9px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText('0', x0 - 10, y0 + plotH + 14)
      ctx.fillText(String(N), x0 + plotW, y0 + plotH + 14)
      ctx.textAlign = 'right'
      ctx.fillText(String(yMax), x0 - 10, y0 + 4)
      ctx.fillText('0', x0 - 10, y0 + plotH + 4)

      // 参考曲线（连续）
      ctx.strokeStyle = refColor
      ctx.lineWidth = 1.4
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      for (let i = 0; i <= N * 8; i++) {
        const x = 1 + (i / (N * 8)) * (N - 1)
        const y = refCurve(x)
        const px = X(x)
        const py = Y(y)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // 参考曲线标注
      ctx.fillStyle = refColor
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(refLabel, x0 + plotW * 0.55, Y(refCurve(N * 0.6)) - 6)

      // 数据点
      for (let k = 1; k <= N; k++) {
        const v = fn(k)
        const px = X(k)
        const py = Y(v)
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      // 数据曲线（柔化连线）
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 1.2
      ctx.beginPath()
      for (let k = 1; k <= N; k++) {
        const px = X(k)
        const py = Y(fn(k))
        if (k === 1) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // 左：1/n
    drawPanel(
      0,
      '距地平线距离 ∝ 1/n',
      '第 n 根枕木的纵坐标（调和级数收缩）',
      C.cyan,
      (k) => 1 / k,
      (x) => 1 / x,
      '1/n',
      'rgba(34, 211, 238, 0.55)',
      1,
    )

    // 右：1/n²
    drawPanel(
      panelW,
      '相邻间距 ∝ 1/n²',
      'd_n = 1/n − 1/(n+1)（平方倒数收缩）',
      C.violet,
      (k) => 1 / k - 1 / (k + 1),
      (x) => 1 / (x * x),
      '1/n²',
      'rgba(167, 139, 250, 0.55)',
      0.6,
    )

    // 底部公式
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('v_n = 1/n       v_n − v_{n+1} = 1/[n(n+1)] ≈ 1/n²', w / 2, h - 8)
  }

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Canvas2D active={active} className="absolute inset-0 h-full w-full" draw={draw} interactive={false} />
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5">
        <span className="whitespace-nowrap text-[11px] text-slate-400">枕木数量</span>
        <input
          type="range"
          min={4}
          max={MAX_N}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-violet"
          aria-label="枕木数量"
        />
        <span className="font-mono text-[11px] text-brand-violet">n={n}</span>
      </div>
    </div>
  )
}
