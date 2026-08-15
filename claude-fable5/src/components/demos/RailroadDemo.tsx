import { useState } from 'react'
import clsx from 'clsx'
import { useCanvas } from '@/hooks/useCanvas'
import { palette, FONT_SM } from '@/lib/palette'
import { clear, makeViewport, line, dot, label } from '@/lib/draw'
import { DemoPanel } from '@/components/ui/DemoPanel'
import { LabeledSlider } from '@/components/ui/LabeledSlider'

/**
 * 铁轨与枕木：两条铁轨 x = ±w、地面 y = −1，枕木位于 z = 1, 2, 3, …
 * 投影后枕木的纵坐标为 −1/n（调和级数），间距按 1/n² 衰减。
 */
export function RailroadDemo() {
  const [w, setW] = useState(0.7)
  const [count, setCount] = useState(24)
  const [showDiagonals, setShowDiagonals] = useState(false)

  const canvasRef = useCanvas((ctx, { width, height }) => {
    clear(ctx, width, height)
    const scale = height * 0.72
    const vp = makeViewport(width, height, {
      scale,
      cx: width * (showDiagonals ? 0.36 : 0.5),
      cy: height * 0.2,
    })

    // 地面
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    const horizonY = vp.toPx([0, 0])[1]
    ctx.fillRect(0, horizonY, width, height - horizonY)
    ctx.restore()

    // 地平线（v = 0）
    line(ctx, vp, [-3, 0], [3, 0], palette.axis, 1, [4, 6])
    label(ctx, vp, [-0.001, 0], '地平线 v = 0', {
      dx: -vp.cx + 14,
      dy: -10,
      color: palette.ink3,
      font: FONT_SM,
    })

    // 铁轨：从近处延伸向消失点 (0, 0)
    const tNear = 0.72
    for (const side of [-1, 1] as const) {
      line(ctx, vp, [(side * w) / tNear, -1 / tNear], [0, 0], palette.s1, 2.5)
    }

    // 枕木 z = n → v = −1/n，端点 u = ±w/n
    for (let n = 1; n <= count; n++) {
      const v = -1 / n
      line(ctx, vp, [-w / n, v], [w / n, v], palette.s2, n <= 2 ? 2.5 : 2)
      if (n <= 4) {
        label(ctx, vp, [w / n, v], `v = −1/${n}`, { dx: 10, color: palette.ink2, font: FONT_SM })
      }
    }

    // 主消失点
    dot(ctx, vp, [0, 0], palette.s1, 5)
    label(ctx, vp, [0, 0], '铁轨的消失点', { dx: 8, dy: -12, color: palette.ink2 })

    if (showDiagonals) {
      // 对角线方向 (2w, 0, 1) → 消失点 (2w, 0)
      const dvp: [number, number] = [2 * w, 0]
      for (let n = 1; n <= Math.min(count, 12); n++) {
        ctx.save()
        ctx.globalAlpha = 0.55
        line(ctx, vp, [-w / n, -1 / n], dvp, palette.s3, 1, [4, 4])
        ctx.restore()
      }
      dot(ctx, vp, dvp, palette.s3, 5)
      label(ctx, vp, dvp, '对角线的消失点 (2w, 0)', { dy: -14, color: palette.ink2 })
    }
  })

  return (
    <DemoPanel
      title="枕木间距的衰减规律"
      hint="拖动滑杆调整轨距与枕木数量"
      controls={
        <>
          <LabeledSlider label="轨距 w" value={w} min={0.4} max={1.2} step={0.02} onChange={setW} />
          <LabeledSlider
            label="枕木数"
            value={count}
            min={4}
            max={60}
            step={1}
            format={(v) => String(v)}
            onChange={setCount}
          />
          <button
            type="button"
            aria-pressed={showDiagonals}
            onClick={() => setShowDiagonals((s) => !s)}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              showDiagonals
                ? 'border-s3/50 bg-s3/15 text-ink'
                : 'border-white/10 text-ink-3 hover:text-ink-2',
            )}
          >
            对角线作图法
          </button>
        </>
      }
      caption={
        <>
          所有枕木格子的对角线在空间中互相平行，因此共享同一个消失点（绿）——
          画家用它就能严格定出下一根枕木的位置。而坐标计算一步到位：第 n 根枕木投影后的纵坐标是
          −1/n，到地平线的距离按调和级数 1/n 收缩；相邻两根做差，间距按 1/n² 平方倒数衰减 ——
          不是很多人直觉中的等比级数。
        </>
      }
    >
      <canvas ref={canvasRef} className="block h-[420px] w-full" />
    </DemoPanel>
  )
}
