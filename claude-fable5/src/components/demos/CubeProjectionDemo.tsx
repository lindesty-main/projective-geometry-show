import { useRef, useState } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { palette } from '@/lib/palette'
import { clear, makeViewport, dot } from '@/lib/draw'
import {
  CUBE_VERTICES,
  CUBE_EDGES,
  compose,
  rotateX,
  rotateY,
  scale as scale3,
  translate,
  project,
} from '@/lib/projection'
import { DemoPanel } from '@/components/ui/DemoPanel'
import { LabeledSlider } from '@/components/ui/LabeledSlider'

/**
 * 万能公式演示：三维立方体经 (x/z, y/z) 投影到画布。
 * 拖动旋转，滑杆调整深度（近大远小）。
 */
export function CubeProjectionDemo() {
  const [distance, setDistance] = useState(4)
  const angles = useRef({ yaw: 0.5, pitch: -0.3, auto: true })
  const dragging = useRef<{ x: number; y: number } | null>(null)

  const canvasRef = useCanvas((ctx, { width, height, t }) => {
    clear(ctx, width, height)
    const vp = makeViewport(width, height, { scale: Math.min(width, height) * 0.75 })

    const a = angles.current
    if (a.auto) a.yaw = 0.5 + Math.sin(t * 0.4) * 0.35

    const transform = compose(
      scale3(0.8),
      rotateY(a.yaw),
      rotateX(a.pitch),
      translate([0, 0, distance]),
    )
    const world = CUBE_VERTICES.map(transform)
    const pts = world.map(project)

    // 棱：按深度排序，远处的先画且更淡
    const sorted = [...CUBE_EDGES].sort(
      (e1, e2) =>
        (world[e2.a][2] + world[e2.b][2]) / 2 - (world[e1.a][2] + world[e1.b][2]) / 2,
    )
    for (const e of sorted) {
      const depth = (world[e.a][2] + world[e.b][2]) / 2
      const alpha = Math.max(0.35, Math.min(1, 1.6 - depth / distance))
      ctx.save()
      ctx.globalAlpha = alpha
      const [ax, ay] = vp.toPx(pts[e.a])
      const [bx, by] = vp.toPx(pts[e.b])
      ctx.strokeStyle = palette.s1
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()
      ctx.restore()
    }
    for (let i = 0; i < pts.length; i++) {
      dot(ctx, vp, pts[i], palette.s1, 3.5)
    }

    ctx.save()
    ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
    ctx.fillStyle = palette.ink3
    ctx.fillText('每个顶点 (x, y, z) 画在 (x/z, y/z)', 16, height - 16)
    ctx.restore()
  })

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragging.current = { x: e.clientX, y: e.clientY }
    angles.current.auto = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return
    const dx = e.clientX - dragging.current.x
    const dy = e.clientY - dragging.current.y
    dragging.current = { x: e.clientX, y: e.clientY }
    angles.current.yaw += dx * 0.008
    angles.current.pitch = Math.max(-1.2, Math.min(1.2, angles.current.pitch - dy * 0.008))
  }
  const onPointerUp = () => {
    dragging.current = null
  }

  return (
    <DemoPanel
      title="立方体的透视投影"
      hint="拖动画布旋转立方体"
      controls={
        <LabeledSlider
          label="深度 z"
          value={distance}
          min={2.4}
          max={9}
          step={0.1}
          format={(v) => v.toFixed(1)}
          onChange={setDistance}
        />
      }
      caption="三维立方体的 8 个顶点经过「同时除以 z」的运算后落在二维画布上，与我们肉眼所见一模一样。把深度滑杆拉大，立方体按 1/z 反比例缩小 —— 这就是近大远小。"
    >
      <canvas
        ref={canvasRef}
        className="block h-[380px] w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </DemoPanel>
  )
}
