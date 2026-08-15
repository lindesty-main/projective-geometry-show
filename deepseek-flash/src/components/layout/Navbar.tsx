import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, Menu, X } from 'lucide-react'
import { CHAPTERS } from '@/content/chapters'
import { clsx } from 'clsx'

interface NavbarProps {
  activeId: string
}

export function Navbar({ activeId }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2.5"
          aria-label="回到顶部"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 text-brand-cyan ring-1 ring-white/10 transition group-hover:scale-105">
            <Compass size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-white">
            透视与投影
            <span className="ml-2 hidden text-[10px] font-normal uppercase tracking-[0.2em] text-slate-500 sm:inline">
              交互式数学漫游
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {CHAPTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => go(c.id)}
              className={clsx(
                'rounded-lg px-2.5 py-1.5 text-[13px] transition',
                c.id === activeId
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
              )}
            >
              {c.numeral}·{c.title.slice(0, 6)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 lg:hidden"
          aria-label="打开菜单"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1 px-4 py-3">
              {CHAPTERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => go(c.id)}
                  className={clsx(
                    'rounded-lg px-3 py-2 text-left text-[13px] transition',
                    c.id === activeId ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5',
                  )}
                >
                  <span className="mr-1.5 text-brand-cyan">{c.numeral}</span>
                  {c.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
