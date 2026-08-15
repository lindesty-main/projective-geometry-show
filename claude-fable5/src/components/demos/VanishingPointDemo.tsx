import { useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { useCanvas } from '@/hooks/useCanvas'
import { palette } from '@/lib/palette'
import { clear, makeViewport, dot, label, line } from '@/lib/draw'
import {
  CUBE_VERTICES,
  CUBE_EDGES,
  compose,
  rotateX,
  rotateY,
  scale as scale3,
  translate,
  project,
  vanishingPoint,
  type Vec3,
} from '@/lib/projection'
import { DemoPanel } from '@/components/ui/DemoPanel'

const MODES = [
  { value: 'one', label: '单点透视', yaw: 0, pitch: 0 },
  { value: 'two', label: '两点透视', yaw: 0.55, pitch: 0 },
  { value: 'three', label: '三点透视', yaw: 0.55, pitch: 0.62 },
] as const

const AXIS_COLORS = [palette.s1, palette.s2, palette.s3] as const
const AXIS_NAMES = ['水平棱', '竖直棱', '深度棱'] as const
const BASIS: Vec3[] = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
]

/**
 * 消失点演示：旋转长方体，观察三组平行棱各自汇聚（或保持平行）。
 */
export function VanishingPointDemo() {
  const [mode, setMode] = useState<string>('one')
  const current = useRef({ yaw: 0, pitch: 0 })

  const canvasRef = useCanvas((ctx, { width, height }) => {
    clear(ctx, width, height)
    const vp = makeViewport(width, height, { scale: Math.min(width, height) * 0.62 })

    const target = MODES.find((m) => m.value === mode) ?? MODES[0]
    // 平滑过渡到目标角度
    const c = current.current
    c.yaw += (target.yaw - c.yaw) * 0.08
    c.pitch += (target.pitch - c.pitch) * 0.08

    const rotate = compose(rotateY(c.yaw), rotateX(c.pitch))
    const place = compose(scale3(0.55), rotate, translate([0, 0, 3.2]))
    const world = CUBE_VERTICES.map(place)
    const pts = world.map(project)

    // 三组方向的消失点
    const vps = BASIS.map((b) => vanishingPoint(rotate(b), 0.02))

    // 延长线：每条棱向所属消失点延伸（虚线、低透明度）
    for (const e of CUBE_EDGES) {
      const v = vps[e.axis]
      if (!v) continue
      const color = AXIS_COLORS[e.axis]
      ctx.save()
      ctx.globalAlpha = 0.3
      line(ctx, vp, pts[e.a], v, color, 1, [3, 5])
      line(ctx, vp, pts[e.b], v, color, 1, [3, 5])
      ctx.restore()
    }

    // 长方体棱（按方向分三色）
    for (const e of CUBE_EDGES) {
      line(ctx, vp, pts[e.a], pts[e.b], AXIS_COLORS[e.axis], 2)
    }

    // 消失点标记
    vps.forEach((v, i) => {
      if (!v) return
      dot(ctx, vp, v, AXIS_COLORS[i], 5)
      const inside = Math.abs(v[0]) * vp.scale < width / 2 - 60 && Math.abs(v[1]) * vp.scale < height / 2 - 20
      if (inside) {
        label(ctx, vp, v, `${AXIS_NAMES[i]}的消失点 (a/c, b/c)`, { dy: -14, color: palette.ink2 })
      }
    })
  })

  return (
    <DemoPanel
      title="一点、两点与三点透视"
      hint="切换透视类型"
      controls={
        <div className="flex flex-wrap items-center gap-6">
          <Tabs.Root value={mode} onValueChange={setMode}>
            <Tabs.List className="flex gap-1 rounded-lg border border-white/10 bg-surface/60 p-1">
              {MODES.map((m) => (
                <Tabs.Trigger
                  key={m.value}
                  value={m.value}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-3 transition-colors hover:text-ink-2 data-[state=active]:bg-s1/20 data-[state=active]:text-ink"
                >
                  {m.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
          <ul className="flex flex-wrap gap-4 text-xs text-ink-3">
            {AXIS_NAMES.map((name, i) => (
              <li key={name} className="flex items-center gap-1.5">
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ background: AXIS_COLORS[i] }}
                />
                {name}
              </li>
            ))}
          </ul>
        </div>
      }
      caption={
        <>
          长方体有三组互相平行的棱。方向向量 (a, b, c) 中 c = 0（平行于画布）的那组棱在画面上保持平行；
          c ≠ 0 的每一组都汇聚到各自的消失点 (a/c, b/c)。与画布平行的棱有两组时是单点透视，
          一组时是两点透视，零组时便出现第三个消失点 —— 三点透视。
        </>
      }
    >
      <canvas ref={canvasRef} className="block h-[440px] w-full" />
    </DemoPanel>
  )
}
