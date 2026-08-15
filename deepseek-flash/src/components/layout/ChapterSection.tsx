import { Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Hand, MessageSquareQuote, Sigma } from 'lucide-react'
import type { Chapter } from '@/content/chapters'
import { ACCENT_COLORS, VIZ_COMPONENTS } from '@/content/chapters'
import { MathFormula } from '@/components/ui/MathFormula'
import { useInView } from '@/hooks/useInView'
import { clsx } from 'clsx'

interface ChapterSectionProps {
  chapter: Chapter
  index: number
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

export function ChapterSection({ chapter, index }: ChapterSectionProps) {
  const accent = ACCENT_COLORS[chapter.accent]
  const Viz = VIZ_COMPONENTS[chapter.viz]
  const reverse = index % 2 === 1

  // 靠近视口时再挂载可视化（避免一次性创建所有 WebGL 上下文）
  const [vizRef, vizInView] = useInView<HTMLDivElement>({ rootMargin: '800px 0px' })
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ once: false, rootMargin: '-15% 0px -15% 0px' })

  const viz = useMemo(
    () => (
      <div ref={vizRef} className="viz-frame">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
          <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
            <Hand size={14} className={accent.text} />
            {chapter.vizTitle}
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-slate-600">Interactive</span>
        </div>
        <div className="relative h-[440px] w-full">
          {vizInView && (
            <Suspense
              fallback={
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
                </div>
              }
            >
              <Viz active={sectionInView} />
            </Suspense>
          )}
        </div>
        {chapter.hint && (
          <div className="border-t border-white/10 px-4 py-2.5 text-xs text-slate-500">{chapter.hint}</div>
        )}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chapter, vizInView, sectionInView],
  )

  return (
    <section
      id={chapter.id}
      ref={sectionRef}
      className="relative scroll-mt-20 py-20 sm:py-24"
      data-chapter={chapter.id}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10% 0px' }}
          variants={reveal}
          custom={0}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-3">
            <span
              className={clsx(
                'grid h-11 w-11 place-items-center rounded-xl font-display text-lg font-bold ring-1 ring-white/10',
                accent.bg,
                accent.text,
              )}
            >
              {chapter.numeral}
            </span>
            <span className={clsx('h-px w-16', accent.bg)} />
            <span className="text-[11px] uppercase tracking-[0.3em] text-slate-600">
              Chapter {index === 0 ? '0' : String(index).padStart(2, '0')}
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{chapter.title}</h2>
          <p className={clsx('mt-1.5 font-display text-lg font-medium', accent.text)}>{chapter.subtitle}</p>
        </motion.header>

        <div className={clsx('grid items-start gap-8 lg:grid-cols-2', reverse && 'lg:[&>*:first-child]:order-2')}>
          {/* 文案侧 */}
          <div className="flex flex-col gap-4">
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10% 0px' }}
              variants={reveal}
              custom={1}
              className="text-[15px] leading-7 text-slate-300"
            >
              {chapter.intro}
            </motion.p>

            {chapter.quotes.length > 0 && (
              <div className="space-y-2">
                {chapter.quotes.map((q, i) => (
                  <motion.figure
                    key={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-10% 0px' }}
                    variants={reveal}
                    custom={2 + i}
                    className="relative rounded-xl border-l-2 bg-white/[0.03] px-4 py-3"
                    style={{ borderColor: accent.hex }}
                  >
                    <MessageSquareQuote
                      size={13}
                      className={clsx('absolute right-3 top-3 opacity-30', accent.text)}
                    />
                    <blockquote className="text-[13.5px] leading-6 text-slate-400">
                      <span className={clsx('mr-1.5', accent.text)}>「</span>
                      {q.text}
                      <span className={clsx('ml-1.5', accent.text)}>」</span>
                    </blockquote>
                    {q.from && <figcaption className="mt-1.5 text-[10px] text-slate-600">—— {q.from}</figcaption>}
                  </motion.figure>
                ))}
              </div>
            )}

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10% 0px' }}
              variants={reveal}
              custom={6}
              className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              {chapter.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-6 text-slate-300">
                  <CheckCircle2 size={14} className={clsx('mt-1 shrink-0', accent.text)} />
                  {p}
                </li>
              ))}
            </motion.ul>

            {chapter.formulas.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-10% 0px' }}
                variants={reveal}
                custom={7}
                className="space-y-2"
              >
                {chapter.formulas.map((f, i) => (
                  <div key={i} className="flex flex-col gap-1 rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-600">
                      <Sigma size={11} className={accent.text} />
                      {f.label ?? '公式'}
                    </span>
                    <MathFormula tex={f.tex} block />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* 可视化侧 */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={reveal}
            custom={2}
            className="min-w-0"
          >
            {viz}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
