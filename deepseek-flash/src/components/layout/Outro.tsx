import { motion } from 'framer-motion'
import { ArrowUp, Heart, RotateCcw } from 'lucide-react'

/** 尾声：数学之美 */
export function Outro() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-violet/10 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="chip mb-8"
        >
          <Heart size={13} className="text-brand-rose" />
          尾声
        </motion.span>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-2xl font-medium leading-relaxed text-slate-100 sm:text-3xl"
        >
          「数学一点都不可怕，也没有那么高深——就在我们每天目之所及的地板、树林之中，都藏着三维空间映射在眼中二维空间的奥秘。
          <span className="bg-gradient-to-r from-brand-cyan to-brand-violet bg-clip-text text-transparent">
            生活中不缺少美，更不缺少数学之美。
          </span>
          」
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => document.getElementById('prologue')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            <RotateCcw size={15} />
            重新开始漫游
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-ghost">
            <ArrowUp size={15} />
            回到顶部
          </button>
        </motion.div>
      </div>
    </section>
  )
}
