import { useState } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { palette, FONT_SM } from '@/lib/palette'
import { clear, makeViewport, polyline, dot, label, axes } from '@/lib/draw'
import type { Vec2 } from '@/lib/projection'
import { DemoPanel } from '@/components/ui/DemoPanel'
import { SegmentedTabs } from '@/components/ui/SegmentedTabs'

function curve2D(): Vec2[] {
  const pts: Vec2[] = []
  for (let u = -1.55; u <= 1.55; u += 0.002) {
    if (Math.abs(u) < 1e-4) {
      pts.push([0, 0])
      continue
    }
    pts.push([u, u * Math.sin(1 / u)])
  }
  return pts
}

/** 2D：微积分课本上的经典函数 y = x·sin(1/x) */
function Plot2D() {
  const canvasRef = useCanvas((ctx, { width, height }) => {
    clear(ctx, width, height)
    const vp = makeViewport(width, height, { scale: Math.min(width / 3.4, height / 2.4) })
    axes(ctx, vp, width, height)

    // 包络线 y = ±x（虚线，低调）
    polyline(ctx, vp, [[-1.55, -1.55], [1.55, 1.55]], palette.ink3, 1, { dash: [5, 5] })
    polyline(ctx, vp, [[-1.55, 1.55], [1.55, -1.55]], palette.ink3, 1, { dash: [5, 5] })

    polyline(ctx, vp, curve2D(), palette.s1, 2)

    label(ctx, vp, [0.95, 1.15], 'y = x · sin(1/x)', { color: palette.ink2 })
    label(ctx, vp, [1.2, 1.45], 'y = x', { color: palette.ink3, font: FONT_SM })
    dot(ctx, vp, [0, 0], palette.s2, 4)
    label(ctx, vp, [0, 0], '在原点无穷震荡', { dx: 10, dy: 14, color: palette.ink3 })
  })
  return <canvas ref={canvasRef} className="block h-[400px] w-full" />
}

/** 3D：两条平行波浪线的透视 —— 沿江而下，青山消失在天际 */
function RiverView() {
  const canvasRef = useCanvas((ctx, { width, height, t }) => {
    clear(ctx, width, height)
    const vp = makeViewport(width, height, {
      scale: Math.min(width / 3.4, height / 2.4),
      cy: height * 0.52,
    })
    const phi = t * 1.6 // 波形随时间流动，如同顺流而下

    for (const side of [-1, 1] as const) {
      // 三维曲线 (±1, sin(τ), τ) 投影为 (±1/τ, sin(τ)/τ)，即 v = u·sin(1/u)
      const pts: Vec2[] = []
      for (let au = 1.55; au >= 0.008; au -= 0.0025) {
        const tau = 1 / au
        pts.push([side * au, Math.sin(tau + phi) * au])
      }
      pts.push([0, 0])

      // 山体填充：从山脊线到画面底部
      ctx.save()
      const px = pts.map((p) => vp.toPx(p))
      ctx.beginPath()
      ctx.moveTo(px[0][0], px[0][1])
      for (const [x, y] of px) ctx.lineTo(x, y)
      ctx.lineTo(vp.toPx([0, 0])[0], height)
      ctx.lineTo(px[0][0], height)
      ctx.closePath()
      ctx.fillStyle = 'rgba(57, 135, 229, 0.10)'
      ctx.fill()
      ctx.restore()

      polyline(ctx, vp, pts, palette.s1, 2)
    }

    // 地平线与消失点
    polyline(ctx, vp, [[-2.2, 0], [2.2, 0]], palette.axis, 1, { dash: [4, 6] })
    dot(ctx, vp, [0, 0], palette.s2, 4.5)
    label(ctx, vp, [0, 0], '消失点 (0, 0)', { dx: 10, dy: -12, color: palette.ink2 })
    label(ctx, vp, [-1.5, 1.3], '两岸青山 = 两条平行的正弦曲线', { color: palette.ink3 })
  })
  return <canvas ref={canvasRef} className="block h-[400px] w-full" />
}

export function SinScapeDemo() {
  const [tab, setTab] = useState('3d')
  return (
    <DemoPanel
      title="x·sin(1/x) 的真面目"
      hint="切换两种视角"
      caption={
        <>
          三维空间中两条平行的正弦曲线 (±1, sin τ, τ)，经透视投影后恰好就是 v = u·sin(1/u)。
          课本上「原点处无穷震荡、连续但不可导」的怪函数，竟是沿江而下时两岸青山的模样 ——
          视觉上的熟悉感是严格的数学投影对应。
        </>
      }
    >
      <div className="relative">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          items={[
            { value: '3d', label: '三维河谷（透视）', content: <RiverView /> },
            { value: '2d', label: '二维函数图像', content: <Plot2D /> },
          ]}
        />
      </div>
    </DemoPanel>
  )
}
