import { useState } from 'react'
import { RotateCcw, Ruler, TrainFront } from 'lucide-react'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { C } from '@/lib/colors'
import { clsx } from 'clsx'

const W_RAIL = 0.9 // 铁轨在空间中的 x 坐标
const MAX_TIES = 16

interface RailroadProblemProps {
  active?: boolean
}

/**
 * 第五章：铁轨上的枕木。
 * 已知两根相邻枕木（z=1, z=2），用两种方法严格画出下一根。
 * 方法一（对角线消失点）；方法二（中点三点共线）。
 */
export default function RailroadProblem({ active = true }: RailroadProblemProps) {
  const [ties, setTies] = useState<number[]>([1, 2])
  const [method, setMethod] = useState<'A' | 'B'>('A')

  const n = ties.length // 当前最后一根是 z=n
  const next = n + 1

  const draw = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    _dt: number,
  ) => {
    ctx.clearRect(0, 0, w, h)

    const cx = w / 2
    const hy = h * 0.3
    const s = w * 0.34 // u → 像素
    const vScale = h * 0.6
    const px = (u: number) => cx + u * s
    const py = (v: number) => hy + v * vScale

    const L = (z: number) => px(-W_RAIL / z)
    const R = (z: number) => px(W_RAIL / z)
    const Y = (z: number) => py(1 / z)

    // 地平线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
    ctx.lineWidth = 1
    ctx.setLineDash([8, 6])
    ctx.beginPath()
    ctx.moveTo(0, hy)
    ctx.lineTo(w, hy)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('地平线（消失点所在）', 14, hy - 8)

    // 铁轨
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(L(1), Y(1))
    ctx.lineTo(cx, hy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(R(1), Y(1))
    ctx.lineTo(cx, hy)
    ctx.stroke()

    // 铁轨消失点
    ctx.beginPath()
    ctx.arc(cx, hy, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = C.amber
    ctx.fill()

    // 已有枕木
    ties.forEach((z, i) => {
      const isLast = i === ties.length - 1
      ctx.strokeStyle = isLast ? C.emerald : 'rgba(34, 211, 238, 0.85)'
      ctx.lineWidth = isLast ? 3 : 2
      if (isLast) {
        ctx.shadowColor = 'rgba(52, 211, 153, 0.8)'
        ctx.shadowBlur = 8
      }
      ctx.beginPath()
      ctx.moveTo(L(z), Y(z))
      ctx.lineTo(R(z), Y(z))
      ctx.stroke()
      ctx.shadowBlur = 0
      ctx.fillStyle = isLast ? C.emerald : 'rgba(34, 211, 238, 0.7)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`z=${z}`, R(z) - 6, Y(z) - 5)
    })

    const constructionColor = method === 'A' ? C.amber : C.violet
    const glow = 0.5 + 0.5 * Math.sin(t * 3)

    if (method === 'A') {
      // 方法一：对角线消失点
      // 1) 上一格的矩形对角线（通过 L(n-1), R(n)），延至地平线 → DVP
      const n1 = n - 1
      const diagA = [L(n1), Y(n1)] as const
      const diagB = [R(n), Y(n)] as const
      ctx.strokeStyle = C.amber
      ctx.lineWidth = 1.6
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      // 延长到地平线：y=hy 处的 x
      const xAtHorizon = diagA[0] + ((hy - diagA[1]) / (diagB[1] - diagA[1])) * (diagB[0] - diagA[0])
      ctx.moveTo(xAtHorizon, hy)
      ctx.lineTo(diagA[0], diagA[1])
      ctx.lineTo(diagB[0], diagB[1])
      ctx.stroke()
      ctx.setLineDash([])

      // DVP = (2W, 0)
      const dvpX = px(2 * W_RAIL)
      ctx.beginPath()
      ctx.arc(dvpX, hy, 5, 0, Math.PI * 2)
      ctx.fillStyle = C.amber
      ctx.fill()
      ctx.fillStyle = 'rgba(251, 191, 36, 0.85)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('对角线消失点', dvpX + 8, hy - 6)

      // 2) 连接 DVP 与 L(n)，延长交右轨于 R(n+1)
      const e = [px(W_RAIL / next), Y(next)] as const
      ctx.strokeStyle = C.amber
      ctx.lineWidth = 1.6
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.moveTo(dvpX, hy)
      ctx.lineTo(L(n), Y(n))
      ctx.lineTo(e[0], e[1])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(e[0], e[1], 4, 0, Math.PI * 2)
      ctx.fillStyle = C.amber
      ctx.fill()
      ctx.fillStyle = 'rgba(251, 191, 36, 0.85)'
      ctx.fillText('E', e[0] + 7, e[1] - 5)
    } else {
      // 方法二：中点法 —— L(n-1) → M(n) 延长交右轨
      const n1 = n - 1
      const m = [cx, Y(n)] as const
      const f = [px(W_RAIL / next), Y(next)] as const

      // 中点标记
      ctx.strokeStyle = C.violet
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(m[0], m[1] - 12)
      ctx.lineTo(m[0], m[1] + 12)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(m[0], m[1], 4, 0, Math.PI * 2)
      ctx.fillStyle = C.violet
      ctx.fill()
      ctx.fillStyle = 'rgba(167, 139, 250, 0.85)'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText('中点 M', m[0] - 8, m[1] - 8)

      // 延长线
      ctx.strokeStyle = C.violet
      ctx.lineWidth = 1.6
      ctx.setLineDash([6, 5])
      ctx.beginPath()
      ctx.moveTo(L(n1), Y(n1))
      ctx.lineTo(m[0], m[1])
      ctx.lineTo(f[0], f[1])
      ctx.stroke()
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.arc(f[0], f[1], 4, 0, Math.PI * 2)
      ctx.fillStyle = C.violet
      ctx.fill()
      ctx.fillStyle = 'rgba(167, 139, 250, 0.85)'
      ctx.textAlign = 'left'
      ctx.fillText('F', f[0] + 7, f[1] - 5)
    }

    // 下一根枕木预览
    ctx.strokeStyle = method === 'A' ? 'rgba(251, 191, 36, 0.75)' : 'rgba(167, 139, 250, 0.75)'
    ctx.lineWidth = 2.4
    ctx.globalAlpha = 0.55 + 0.35 * glow
    ctx.beginPath()
    ctx.moveTo(L(next), Y(next))
    ctx.lineTo(R(next), Y(next))
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.fillStyle = constructionColor
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`下一根枕木 z=${next}`, R(next) + 8, Y(next) + 3)

    // 顶部信息
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(
      `已铺 ${n} 根 · 距地平线 ∝ 1/z（调和级数）· 间距 ∝ 1/z²`,
      14,
      20,
    )
  }

  const canAdd = ties.length < MAX_TIES

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Canvas2D active={active} className="absolute inset-0 h-full w-full" draw={draw} interactive={false} />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-2.5">
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setMethod('A')}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 text-[11px] transition',
              method === 'A' ? 'bg-brand-amber/15 text-brand-amber' : 'bg-white/5 text-slate-400 hover:text-slate-200',
            )}
          >
            方法一 · 对角线
          </button>
          <button
            onClick={() => setMethod('B')}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 text-[11px] transition',
              method === 'B' ? 'bg-brand-violet/15 text-brand-violet' : 'bg-white/5 text-slate-400 hover:text-slate-200',
            )}
          >
            方法二 · 中点
          </button>
        </div>
        <button onClick={() => canAdd && setTies((ts) => [...ts, ts.length + 1])} disabled={!canAdd} className="btn-ghost px-3 py-1.5 text-[11px]">
          <TrainFront size={13} />
          铺下一根枕木
        </button>
        <button onClick={() => setTies([1, 2])} className="btn-ghost px-3 py-1.5 text-[11px]">
          <RotateCcw size={13} />
          重置
        </button>
        <span className="ml-auto hidden items-center gap-1 text-[10px] text-slate-500 sm:flex">
          <Ruler size={11} />
          虚线为作图辅助线 · 观察枕木如何向地平线收拢
        </span>
      </div>
    </div>
  )
}
