import { motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useCanvas } from '@/hooks/useCanvas'
import { palette } from '@/lib/palette'
import { makeViewport } from '@/lib/draw'

/** 背景：缓缓流动的 x·sin(1/x) 河谷线稿 */
function HeroCanvas() {
  const canvasRef = useCanvas((ctx, { width, height, t }) => {
    ctx.clearRect(0, 0, width, height)
    const vp = makeViewport(width, height, {
      scale: Math.min(width / 3.2, height / 2.2),
      cy: height * 0.55,
    })
    const phi = t * 0.9

    for (const side of [-1, 1] as const) {
      ctx.save()
      ctx.strokeStyle = palette.s1
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 1.5
      ctx.shadowColor = palette.s1
      ctx.shadowBlur = 12
      ctx.beginPath()
      let first = true
      for (let au = 1.5; au >= 0.008; au -= 0.003) {
        const tau = 1 / au
        const [x, y] = vp.toPx([side * au, Math.sin(tau + phi) * au])
        if (first) {
          ctx.moveTo(x, y)
          first = false
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.restore()
    }

    // 消失点微光
    const [cx, cy] = vp.toPx([0, 0])
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90)
    g.addColorStop(0, 'rgba(217, 89, 38, 0.35)')
    g.addColorStop(1, 'rgba(217, 89, 38, 0)')
    ctx.fillStyle = g
    ctx.fillRect(cx - 90, cy - 90, 180, 180)
  })
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}

export function Hero() {
  return (
    <header className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface" />
      <HeroCanvas />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-s1/30 bg-s1/10 px-4 py-1.5 text-sm text-ink-2"
        >
          <Sparkles className="size-4 text-s1" aria-hidden />
          一个公式，推导透视中的一切
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="font-(family-name:--font-serif-sc) text-5xl font-black leading-tight tracking-wide md:text-7xl"
        >
          透视与投影
          <br />
          <span className="bg-gradient-to-r from-s1 via-s1 to-s3 bg-clip-text text-transparent">
            的数学
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg"
        >
          函数 x·sin(1/x) 在原点无穷震荡 —— 但换个角度，它是三维空间里沿江而下时，
          两岸连绵的青山消失在天际的模样。这种似曾相识，可以被严格证明。
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10"
        >
          <a
            href="#formula"
            className="inline-flex items-center gap-2 rounded-full bg-s1 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-s1/25 transition-transform hover:scale-105"
          >
            从第一性原理出发
            <ChevronDown className="size-4" aria-hidden />
          </a>
        </motion.div>
      </div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 text-ink-3"
        aria-hidden
      >
        <ChevronDown className="size-5" />
      </motion.div>
    </header>
  )
}
