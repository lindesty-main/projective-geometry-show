import { motion } from 'framer-motion'
import { CHAPTERS, ACCENT_COLORS } from '@/content/chapters'
import { clsx } from 'clsx'

interface SidebarProps {
  activeId: string
}

/** 桌面端左侧章节导航（带进度指示） */
export function Sidebar({ activeId }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-60 flex-col border-r border-white/5 bg-ink-950/40 px-3 py-6 backdrop-blur-sm xl:flex">
      <p className="mb-4 px-2 text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
        章节导航
      </p>
      <nav className="flex flex-col gap-0.5 overflow-y-auto">
        {CHAPTERS.map((c) => {
          const active = c.id === activeId
          const accent = ACCENT_COLORS[c.accent]
          return (
            <button
              key={c.id}
              onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })}
              className={clsx(
                'group relative flex items-center gap-3 rounded-lg px-2 py-2 text-left transition',
                active ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]',
              )}
            >
              <span
                className={clsx(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[11px] transition',
                  active ? `${accent.bg} ${accent.text}` : 'bg-white/5 text-slate-500 group-hover:text-slate-300',
                )}
              >
                {c.numeral}
              </span>
              <span className="min-w-0">
                <span
                  className={clsx(
                    'block truncate text-[13px] transition',
                    active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200',
                  )}
                >
                  {c.title}
                </span>
                <span className="block truncate text-[10px] text-slate-600">{c.subtitle}</span>
              </span>
              {active && (
                <motion.span
                  layoutId="sidebar-dot"
                  className={clsx('absolute -left-3 h-4 w-[3px] rounded-full', accent.dot)}
                />
              )}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto px-2 pt-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-[11px] leading-relaxed text-slate-500">
            内容改编自科普视频《透视与投影》
            <br />
            <span className="text-slate-600">作者：曼氏 · 清华姚班 AI 博士</span>
          </p>
        </div>
      </div>
    </aside>
  )
}
