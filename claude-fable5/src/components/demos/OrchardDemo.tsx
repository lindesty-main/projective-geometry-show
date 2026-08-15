import { useRef, useState } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { palette, FONT_SM } from '@/lib/palette'
import { clear } from '@/lib/draw'
import { gcd } from '@/lib/projection'
import { DemoPanel } from '@/components/ui/DemoPanel'
import { SegmentedTabs } from '@/components/ui/SegmentedTabs'
import { LabeledSlider } from '@/components/ui/LabeledSlider'

/** 静态图形较重，缓存到离屏画布，参数变化时才重绘 */
function useCachedScene(render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, key: string) {
  const cache = useRef<{ key: string; canvas: HTMLCanvasElement } | null>(null)
  return (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const fullKey = `${key}:${Math.round(width)}x${Math.round(height)}`
    if (!cache.current || cache.current.key !== fullKey) {
      const off = document.createElement('canvas')
      off.width = Math.max(1, Math.round(width * dpr))
      off.height = Math.max(1, Math.round(height * dpr))
      const octx = off.getContext('2d')!
      octx.setTransform(dpr, 0, 0, dpr, 0, 0)
      render(octx, width, height)
      cache.current = { key: fullKey, canvas: off }
    }
    ctx.drawImage(cache.current.canvas, 0, 0, width, height)
  }
}

/** 树林：每个最简分数 q/p 处，一根高度 1/p 的线段（上下各一） */
function Trees({ maxP }: { maxP: number }) {
  const draw = useCachedScene(
    (ctx, width, height) => {
      clear(ctx, width, height)
      const cx = width / 2
      const cy = height / 2
      const sx = (width * 0.47) / 1.05
      const sy = height * 0.44

      // 地平线
      ctx.strokeStyle = palette.axis
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(width, cy)
      ctx.stroke()
      ctx.setLineDash([])

      for (let p = 1; p <= maxP; p++) {
        for (let q = -p; q <= p; q++) {
          if (gcd(Math.abs(q), p) !== 1) continue
          const x = cx + (q / p) * sx
          const half = (1 / p) * sy
          ctx.strokeStyle = palette.s1
          ctx.globalAlpha = p <= 3 ? 1 : Math.max(0.45, 1.1 - p / maxP)
          ctx.lineWidth = p <= 3 ? 2 : 1.2
          ctx.beginPath()
          ctx.moveTo(x, cy - half)
          ctx.lineTo(x, cy + half)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      ctx.font = FONT_SM
      ctx.fillStyle = palette.ink2
      ctx.textAlign = 'center'
      for (const [q, p] of [
        [0, 1],
        [1, 2],
        [-1, 2],
        [1, 3],
        [2, 3],
        [1, 1],
        [-1, 1],
      ]) {
        const x = cx + (q / p) * sx
        const y = cy + (1 / p) * sy + 14
        ctx.fillText(p === 1 ? String(q) : `${q}/${p}`, x, y)
      }
      ctx.textAlign = 'left'
      ctx.fillStyle = palette.ink3
      ctx.fillText('每根「树」位于最简分数 q/p，高度 1/p', 16, 24)
    },
    `trees:${maxP}`,
  )
  const canvasRef = useCanvas((ctx, { width, height }) => draw(ctx, width, height))
  return <canvas ref={canvasRef} className="block h-[400px] w-full" />
}

/** 晶格与圆：整点 (x, y, z) 上的小球投影为圆心 (x/z, y/z)、半径 r/z 的圆 */
function Lattice({ depth, radius }: { depth: number; radius: number }) {
  const draw = useCachedScene(
    (ctx, width, height) => {
      clear(ctx, width, height)
      const cx = width / 2
      const cy = height / 2
      const s = height / 1.9
      const maxU = width / 2 / s + 0.1
      const maxV = height / 2 / s + 0.1

      // 由远及近绘制，近处的球自然遮挡远处的
      for (let z = depth; z >= 1; z--) {
        const r = (radius / z) * s
        for (let x = -Math.ceil(maxU * z); x <= Math.ceil(maxU * z); x++) {
          for (let y = -Math.ceil(maxV * z); y <= Math.ceil(maxV * z); y++) {
            if (gcd(gcd(Math.abs(x), Math.abs(y)), z) !== 1) continue
            const px = cx + (x / z) * s
            const py = cy - (y / z) * s
            ctx.beginPath()
            ctx.arc(px, py, r, 0, Math.PI * 2)
            ctx.fillStyle = palette.surface
            ctx.fill()
            ctx.strokeStyle = palette.s1
            ctx.globalAlpha = Math.max(0.4, 1.15 - z / depth)
            ctx.lineWidth = z <= 2 ? 2 : 1.2
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      ctx.font = FONT_SM
      ctx.fillStyle = palette.ink3
      ctx.fillText('半径越大 = 深度 z 越小 = 分数越「简单」', 16, 24)
    },
    `lattice:${depth}:${radius.toFixed(2)}`,
  )
  const canvasRef = useCanvas((ctx, { width, height }) => draw(ctx, width, height))
  return <canvas ref={canvasRef} className="block h-[400px] w-full" />
}

export function OrchardDemo() {
  const [tab, setTab] = useState('trees')
  const [maxP, setMaxP] = useState(36)
  const [depth, setDepth] = useState(12)
  const [radius, setRadius] = useState(0.36)

  return (
    <DemoPanel
      title="凝视全体正有理数"
      hint="切换视角并调整密度"
      controls={
        tab === 'trees' ? (
          <LabeledSlider
            label="分母上限"
            value={maxP}
            min={8}
            max={80}
            step={1}
            format={(v) => String(v)}
            onChange={setMaxP}
          />
        ) : (
          <>
            <LabeledSlider
              label="晶格深度"
              value={depth}
              min={4}
              max={18}
              step={1}
              format={(v) => String(v)}
              onChange={setDepth}
            />
            <LabeledSlider label="球半径" value={radius} min={0.15} max={0.48} step={0.01} onChange={setRadius} />
          </>
        )
      }
      caption={
        <>
          在网格点 (j−i, j+i) 处种下高度为 1 的树，投影后树顶落在 ((j−i)/(j+i), 1/(j+i)) ——
          恰好是「在每个最简分数 q/p 处长出高度 1/p 的线段」。非最简分数的树会被最简的那棵完全挡住，
          一切丝丝入扣。切到晶格视角：三维整点上的同尺寸小球投影后半径缩小 z 倍，
          你可以直接从圆的大小读出一个有理数有多「简洁」。
        </>
      }
    >
      <div className="relative">
        <SegmentedTabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'trees', label: '树林（有理数标尺）', content: <Trees maxP={maxP} /> },
            { value: 'lattice', label: '晶格与圆', content: <Lattice depth={depth} radius={radius} /> },
          ]}
        />
      </div>
    </DemoPanel>
  )
}
