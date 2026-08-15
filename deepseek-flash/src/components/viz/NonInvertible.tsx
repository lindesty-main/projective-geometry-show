import { useRef, useState } from 'react'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { C } from '@/lib/colors'
import { clamp, lerp } from '@/lib/math'

const D_MIN = 1.3
const D_MAX = 6.5
const W = 0.5 // 画布上正方形的半宽（u 坐标）

const GHOSTS = [
  { d: 1.8, color: C.violet },
  { d: 3.4, color: C.emerald },
  { d: 5.2, color: C.rose },
]

interface NonInvertibleProps {
  active?: boolean
}

/**
 * 第三章：近大远小与不可逆性。
 * 顶视图：从眼睛射出的四条射线穿过画布正方形四角；
 * 任何边长为 d 的"真实"正方形都能投出同样的画面。
 */
export default function NonInvertible({ active = true }: NonInvertibleProps) {
  const [d, setD] = useState(2.6)
  const dRef = useRef(d)
  dRef.current = d

  const draw = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    t: number,
    _dt: number,
    _ptr: { x: number; y: number; down: boolean },
  ) => {
    ctx.clearRect(0, 0, w, h)

    // ---- 顶视图映射 ----
    const cx = w * 0.42
    const baseY = h * 0.86
    const sx = (w * 0.30) / 2.6 // x 世界坐标 → 像素
    const sy = (h * 0.68) / (D_MAX + 0.4)
    const X = (x: number) => cx + x * sx
    const Z = (z: number) => baseY - z * sy

    // 画布（z=1 竖线）
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(X(0), Z(1) - 40)
    ctx.lineTo(X(0), Z(1) + 40)
    ctx.stroke()
    ctx.fillStyle = 'rgba(34, 211, 238, 0.9)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('画布 z=1', X(0), Z(1) - 48)

    // 四条射线（穿过画布正方形四角）
    const cornerU = W
    ctx.save()
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    for (const s of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(X(0), baseY)
      ctx.lineTo(X(s * cornerU * (D_MAX + 0.6)), Z(D_MAX + 0.6))
      ctx.stroke()
    }
    ctx.restore()

    // 幽灵正方形：边长 = 深度 d → 投影恒为 2W 宽
    for (const g of GHOSTS) {
      drawSquare(ctx, X, Z, g.d, g.color, t)
    }

    // 活动正方形（跟随滑块）
    drawSquare(ctx, X, Z, dRef.current, C.amber, t, true)

    // 眼睛
    ctx.beginPath()
    ctx.arc(X(0), baseY, 7, 0, Math.PI * 2)
    ctx.fillStyle = C.amber
    ctx.fill()
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(X(0), baseY, 12, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#f8fafc'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('眼睛（原点）', X(0) + 18, baseY + 4)

    // 图例说明
    ctx.fillStyle = 'rgba(148, 163, 184, 0.75)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('顶视图（俯视 XZ 平面）', 14, 20)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.fillText('虚线：从眼睛射出的四条射线（穿过画布正方形四角）', 14, 38)
    ctx.fillText('物体边长 L = 深度 d 时，投影恒为同一个正方形', 14, 56)

    // 深度读数
    const cur = dRef.current
    ctx.fillStyle = C.amber
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.fillText(`深度 d = ${cur.toFixed(2)} → 边长 L = ${cur.toFixed(2)}`, X(0) + 12, Z(cur) + 18)

    // ---- 前视图插画（右下角）：画布上永远看到同一个正方形 ----
    const fw = 150
    const fh = 120
    const fx = w - fw - 16
    const fy = h - fh - 16
    ctx.fillStyle = 'rgba(11, 11, 24, 0.85)'
    ctx.fillRect(fx, fy, fw, fh)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.strokeRect(fx, fy, fw, fh)
    const s0 = 52
    const qx = fx + fw / 2
    const qy = fy + fh / 2 - 8
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 2
    ctx.strokeRect(qx - s0 / 2, qy - s0 / 2, s0, s0)
    ctx.fillStyle = 'rgba(34, 211, 238, 0.9)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('画布上的图像', qx, qy + s0 / 2 + 18)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
    ctx.font = '10px sans-serif'
    ctx.fillText('永远一样大', qx, qy + s0 / 2 + 32)

    // 底部公式
    ctx.fillStyle = 'rgba(148, 163, 184, 0.65)'
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('(x/z, y/z)：深度不同但共线的点 → 同一个像点', w / 2, h - 8)
  }

  // 指针拖拽调节深度
  return (
    <div className="relative h-full w-full">
      <Canvas2D
        active={active}
        className="h-full w-full"
        draw={draw}
        interactive
        onPointerState={(p) => {
          if (!p.down || !p.moved) return
          const frac = clamp(p.x / 1400, 0, 1)
          setD(lerp(D_MIN, D_MAX, frac))
        }}
      />
      <div className="absolute bottom-2 left-3 right-24 flex items-center gap-3 rounded-xl border border-white/10 bg-ink-950/70 px-3 py-2 backdrop-blur sm:right-3 sm:left-1/2 sm:max-w-md sm:-translate-x-1/2">
        <span className="whitespace-nowrap text-[11px] text-slate-400">拖拽调节深度</span>
        <input
          type="range"
          min={D_MIN}
          max={D_MAX}
          step={0.05}
          value={d}
          onChange={(e) => setD(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-amber"
          aria-label="深度"
        />
        <span className="font-mono text-[11px] text-brand-amber">d={d.toFixed(2)}</span>
      </div>
    </div>
  )
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  X: (x: number) => number,
  Z: (z: number) => number,
  d: number,
  color: string,
  t: number,
  active = false,
) {
  const half = d * W // 边长为 d 的正方形在顶视图中的半宽
  const y = Z(d)
  const pulse = 1 + (active ? 0.06 * Math.sin(t * 4) : 0)

  // 线段（正方形截面）
  ctx.strokeStyle = color
  ctx.lineWidth = active ? 2.5 : 1.8
  ctx.beginPath()
  ctx.moveTo(X(-half * pulse), y)
  ctx.lineTo(X(half * pulse), y)
  ctx.stroke()

  // 四角
  for (const s of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(X(s * half), y, active ? 4.5 : 3.5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  if (active) {
    ctx.fillStyle = color
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`边长 L = ${d.toFixed(1)}`, X(half) + 8, y - 6)
  }
}
