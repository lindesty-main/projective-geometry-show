const LINKS = [
  { href: '#formula', label: '万能公式' },
  { href: '#sin', label: '山河函数' },
  { href: '#irreversible', label: '不可逆' },
  { href: '#vanishing', label: '消失点' },
  { href: '#railroad', label: '铁轨' },
  { href: '#orchard', label: '有理数树林' },
  { href: '#ellipse', label: '圆与椭圆' },
]

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <a href="#top" className="font-(family-name:--font-serif-sc) text-sm font-bold tracking-widest">
          透视与投影<span className="text-s1">的数学</span>
        </a>
        <ul className="hidden items-center gap-5 text-[13px] text-ink-3 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
