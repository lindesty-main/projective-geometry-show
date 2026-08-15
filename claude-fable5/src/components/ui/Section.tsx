import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type SectionProps = {
  id: string
  index: number
  eyebrow: string
  title: string
  subtitle?: string
  children: ReactNode
}

/** 章节外壳：编号 + 标题 + 滚动进入动画 */
export function Section({ id, index, eyebrow, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 md:py-28">
      <motion.header
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-10"
      >
        <p className="mb-3 flex items-center gap-3 font-mono text-sm tracking-widest text-s1">
          <span className="inline-block h-px w-10 bg-s1/60" />
          {String(index).padStart(2, '0')} · {eyebrow}
        </p>
        <h2 className="font-(family-name:--font-serif-sc) text-3xl font-bold leading-snug md:text-4xl">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-3">{subtitle}</p>}
      </motion.header>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}

/** 正文段落 */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[15px] leading-relaxed text-ink-2 md:text-base">{children}</div>
}

/** 强调块（结论、金句） */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-s1/25 bg-s1/8 px-5 py-4 text-[15px] leading-relaxed text-ink-2">
      {children}
    </div>
  )
}
