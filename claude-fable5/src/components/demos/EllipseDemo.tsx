import { useState } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { palette, FONT_SM } from '@/lib/palette'
import { clear, makeViewport, polyline, dot, label, line } from '@/lib/draw'
import {
  compose,
  rotateX,
  rotateY,
  translate,
  project,
  type Vec3,
  type Vec2,
} from '@/lib/projection'
import { DemoPanel } from '@/components/ui/DemoPanel'
import { LabeledSlider } from '@/components/ui/LabeledSlider'

/** 上帝视角的观察变换 */
const godView = compose(rotateY(0.75), rotateX(-0.3), translate([0, 0.4, 4.6]))
const seen = (p: Vec3): Vec2 => project(godView(p))

/** 空间圆：(cos t, 1, sin t + d) */
function circlePoint(t: number, d: number): Vec3 {
  return [Math.cos(t), 1, Math.sin(t) + d]
}

/**
 * 圆的投影是标准椭圆 —— 且圆心的投影不在椭圆中心。
 * 投影满足 u² + (d²−1)(v − d/(d²−1))² = 1/(d²−1)。
 */
export function EllipseDemo() {
  const [d, setD] = useState(2)

  const canvasRef = useCanvas((ctx, { width, height }) => {
    clear(ctx, width, height)
    const half = width / 2

    // ---- 左半：上帝视角 ----
    const vpL = makeViewport(half, height, {
      scale: Math.min(half, height) * 0.5,
      cx: half / 2,
      cy: height / 2,
    })

    // 眼睛与画布框
    dot(ctx, vpL, seen([0, 0, 0]), palette.ink, 4.5)
    label(ctx, vpL, seen([0, 0, 0]), '眼睛', { dx: -32, color: palette.ink2, font: FONT_SM })
    const frame: Vec3[] = [
      [-0.85, -0.15, 1],
      [-0.85, 0.95, 1],
      [0.85, 0.95, 1],
      [0.85, -0.15, 1],
    ]
    polyline(ctx, vpL, frame.map(seen), palette.axis, 1, { close: true })

    // 空间中的圆（橙）
    const circle3: Vec2[] = []
    const proj3: Vec2[] = []
    for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.05) {
      const p = circlePoint(t, d)
      circle3.push(seen(p))
      const [u, v] = project(p)
      proj3.push(seen([u, v, 1]))
    }
    polyline(ctx, vpL, circle3, palette.s2, 2, { close: true })
    // 画布上的投影椭圆（蓝）
    polyline(ctx, vpL, proj3, palette.s1, 2, { close: true })

    // 几条投影光线
    for (let k = 0; k < 8; k++) {
      const p = circlePoint((k / 8) * Math.PI * 2, d)
      line(ctx, vpL, seen([0, 0, 0]), seen(p), 'rgba(195,194,183,0.18)', 1)
    }

    ctx.save()
    ctx.font = FONT_SM
    ctx.fillStyle = palette.ink3
    ctx.fillText('上帝视角：空间圆（橙）与它在画布上的像（蓝）', 16, 24)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.moveTo(half, 0)
    ctx.lineTo(half, height)
    ctx.stroke()
    ctx.restore()

    // ---- 右半：画布上的椭圆 ----
    const a = 1 / Math.sqrt(d * d - 1) // 半长轴（水平）
    const b = 1 / (d * d - 1) // 半短轴（竖直）
    const vCenter = d / (d * d - 1) // 椭圆中心
    const vProj = 1 / d // 圆心的投影

    const spanV = 2 * b
    const spanU = 2 * a
    const scale = Math.min((height * 0.52) / spanV, (half * 0.6) / spanU)
    const vpR = makeViewport(half, height, {
      scale,
      cx: half + half / 2,
      cy: height / 2 + vCenter * scale,
    })

    const ellipse: Vec2[] = []
    for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.03) {
      ellipse.push(project(circlePoint(t, d)))
    }
    ctx.save()
    const px = ellipse.map((p) => vpR.toPx(p))
    ctx.beginPath()
    ctx.moveTo(px[0][0], px[0][1])
    for (const [x, y] of px) ctx.lineTo(x, y)
    ctx.closePath()
    ctx.fillStyle = 'rgba(57, 135, 229, 0.10)'
    ctx.fill()
    ctx.restore()
    polyline(ctx, vpR, ellipse, palette.s1, 2, { close: true })

    // 椭圆中心与长短轴（虚线）
    line(ctx, vpR, [-a, vCenter], [a, vCenter], palette.axis, 1, [4, 4])
    line(ctx, vpR, [0, vCenter - b], [0, vCenter + b], palette.axis, 1, [4, 4])
    dot(ctx, vpR, [0, vCenter], palette.s2, 5)
    label(ctx, vpR, [0, vCenter], '椭圆的中心', { dx: 10, dy: -10, color: palette.ink2 })

    // 圆心 (0, 1, d) 的投影
    dot(ctx, vpR, [0, vProj], palette.s3, 5)
    label(ctx, vpR, [0, vProj], '圆心的投影（偏离中心）', { dx: 10, dy: 12, color: palette.ink2 })

    ctx.save()
    ctx.font = FONT_SM
    ctx.fillStyle = palette.ink3
    ctx.fillText('画布上：一个严格的标准椭圆', half + 16, 24)
    ctx.restore()
  })

  return (
    <DemoPanel
      title="圆的投影是标准椭圆"
      hint="拖动滑杆改变圆的深度"
      controls={
        <LabeledSlider
          label="圆心深度 d"
          value={d}
          min={1.7}
          max={4}
          step={0.05}
          onChange={setD}
        />
      }
      caption={
        <>
          空间圆 (cos t, 1, sin t + d) 投影后满足 u² + (d²−1)·(v − d/(d²−1))² = 1/(d²−1)，
          配方后正是标准椭圆方程。但注意：圆心的投影（绿）并不落在椭圆的中心（橙）——
          因为圆心不在「视线圆锥」的中轴上，投影总是偏向一侧。
        </>
      }
    >
      <canvas ref={canvasRef} className="block h-[400px] w-full" />
    </DemoPanel>
  )
}
