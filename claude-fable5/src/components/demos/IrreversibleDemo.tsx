import { useCanvas } from '@/hooks/useCanvas'
import { palette, FONT_SM } from '@/lib/palette'
import { clear, makeViewport, polyline, dot, line } from '@/lib/draw'
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

/** 画布 z=1 上正方形的四个角 */
const CORNERS: Vec3[] = [
  [-0.35, -0.35, 1],
  [-0.35, 0.35, 1],
  [0.35, 0.35, 1],
  [0.35, -0.35, 1],
]

/** 上帝视角的观察变换：把整个场景旋转后再投影到我们的屏幕上 */
const godView = compose(rotateY(0.85), rotateX(-0.38), translate([0.1, 0.55, 4.2]))

function seen(p: Vec3): Vec2 {
  return project(godView(p))
}

/**
 * 投影不可逆演示：四个顶点沿视线射线任意滑动，
 * 眼中看到的永远是同一个正方形。
 */
export function IrreversibleDemo() {
  const canvasRef = useCanvas((ctx, { width, height, t }) => {
    clear(ctx, width, height)
    const half = width / 2

    // ---- 左半：你眼中所见（永远不变的正方形） ----
    const vpL = makeViewport(half, height, {
      scale: Math.min(half, height) * 0.5,
      cx: half / 2,
      cy: height / 2,
    })
    const square2D = CORNERS.map(project)
    polyline(ctx, vpL, square2D, palette.s1, 2, { close: true })
    for (const p of square2D) dot(ctx, vpL, p, palette.s1, 4)
    ctx.save()
    ctx.font = FONT_SM
    ctx.fillStyle = palette.ink3
    ctx.fillText('你眼中所见：永远是同一个正方形', 16, 24)
    ctx.restore()

    // 分隔线
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.moveTo(half, 0)
    ctx.lineTo(half, height)
    ctx.stroke()
    ctx.restore()

    // ---- 右半：上帝视角（射线上滑动的四个顶点） ----
    const vpR = makeViewport(half, height, {
      scale: Math.min(half, height) * 0.42,
      cx: half + half / 2,
      cy: height / 2,
    })

    // 眼睛
    const eye = seen([0, 0, 0])
    dot(ctx, vpR, eye, palette.ink, 4.5)
    ctx.save()
    ctx.font = FONT_SM
    ctx.fillStyle = palette.ink2
    const eyePx = vpR.toPx(eye)
    ctx.fillText('眼睛', eyePx[0] - 30, eyePx[1] + 4)
    ctx.restore()

    // 画布平面（z = 1 处的边框）与画布上的正方形
    const frame: Vec3[] = [
      [-0.75, -0.6, 1],
      [-0.75, 0.6, 1],
      [0.75, 0.6, 1],
      [0.75, -0.6, 1],
    ]
    polyline(ctx, vpR, frame.map(seen), palette.axis, 1, { close: true })
    polyline(ctx, vpR, CORNERS.map(seen), palette.s1, 2, { close: true })

    // 四条射线 + 沿射线滑动的顶点
    const moving: Vec3[] = CORNERS.map((c, k) => {
      const tk = 2.3 + 1.5 * Math.sin(t * 0.9 + k * 1.9)
      return [c[0] * tk, c[1] * tk, c[2] * tk]
    })
    for (let k = 0; k < 4; k++) {
      const far: Vec3 = [CORNERS[k][0] * 4.4, CORNERS[k][1] * 4.4, CORNERS[k][2] * 4.4]
      line(ctx, vpR, seen([0, 0, 0]), seen(far), 'rgba(195,194,183,0.25)', 1, [3, 5])
    }
    polyline(ctx, vpR, moving.map(seen), palette.s2, 2, { close: true })
    for (const m of moving) dot(ctx, vpR, seen(m), palette.s2, 4)

    ctx.save()
    ctx.font = FONT_SM
    ctx.fillStyle = palette.ink3
    ctx.fillText('上帝视角：顶点在射线上任意滑动', half + 16, 24)
    ctx.restore()
  })

  return (
    <DemoPanel
      title="投影是不可逆的"
      caption={
        <>
          与原点连线在同一条直线上的所有点，都会被压到画布上的同一个位置。右侧空间中的四个顶点（橙）
          在射线上任意滑动，但它们投影到画布后（蓝）始终是同一个正方形 ——
          经典视错觉「艾姆斯房间 (Ames Room)」正是利用了这一点。
        </>
      }
    >
      <canvas ref={canvasRef} className="block h-[380px] w-full" />
    </DemoPanel>
  )
}
