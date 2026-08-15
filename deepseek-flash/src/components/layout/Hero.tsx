import { motion } from 'framer-motion'
import { BookOpenText, Gauge, Layers, Sparkles } from 'lucide-react'
import { CHAPTERS } from '@/content/chapters'
import OscillatingFunction from '@/components/viz/OscillatingFunction'

const STATS = [
  { icon: Layers, value: '10', label: '个章节' },
  { icon: Gauge, value: '10+', label: '个可交互可视化' },
  { icon: BookOpenText, value: '1', label: '条第一性原理公式' },
]

/** 全屏首屏：背景为开场函数动画 */
export function Hero() {
  const start = () => {
    document.getElementById(CHAPTERS[0].id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* 背景：开场函数 */}
      <div className="pointer-events-none absolute inset-0">
        <OscillatingFunction active className="h-full w-full opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950" />
      </div>

      {/* 氛围光斑 */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 animate-spin-slow rounded-full bg-brand-cyan/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 animate-spin-slow rounded-full bg-brand-violet/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="chip mb-6 animate-pulse-soft"
        >
          <Sparkles size={13} className="text-brand-cyan" />
          由科普视频字幕改编的交互式数学可视化
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-5xl font-black leading-tight tracking-wide text-white sm:text-7xl"
        >
          透视与投影
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-base text-slate-300 sm:text-lg"
        >
          从一条公式 <span className="font-mono text-brand-cyan">(x/z, y/z)</span> 出发，
          推导出消失点、Ames Room、有理数森林与圆锥曲线——
          <span className="text-white"> 数学一点都不可怕，就在你每天目之所及之处。</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button onClick={start} className="btn-primary px-6 py-2.5 text-base">
            开始漫游
            <span className="text-sm">↓</span>
          </button>
          <span className="text-xs text-slate-500">
            内容整理自 曼氏《透视与投影》 · 约 16 分钟的一期视频
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-3"
        >
          {STATS.map((s) => (
            <div key={s.label} className="glass px-3 py-3 text-center">
              <s.icon size={16} className="mx-auto mb-1 text-brand-cyan" />
              <div className="font-display text-xl font-bold text-white">{s.value}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-600"
      >
        <div className="animate-bounce text-xs">向下滚动，进入数学的世界</div>
      </motion.div>
    </section>
  )
}
