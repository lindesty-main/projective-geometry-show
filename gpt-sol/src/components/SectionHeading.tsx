type Props = {
  index: string
  eyebrow: string
  title: string
  body?: string
  light?: boolean
}

export function SectionHeading({ index, eyebrow, title, body, light = false }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[190px_1fr]">
      <div className={`flex items-start gap-3 font-mono text-xs uppercase tracking-[.2em] ${light ? 'text-white/55' : 'text-moss/70'}`}>
        <span>{index}</span><span className={`mt-1.5 h-px w-12 ${light ? 'bg-white/25' : 'bg-moss/30'}`} />{eyebrow}
      </div>
      <div className="max-w-3xl">
        <h2 className={`font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl ${light ? 'text-paper' : 'text-ink'}`}>{title}</h2>
        {body && <p className={`mt-5 max-w-2xl text-base leading-7 sm:text-lg ${light ? 'text-white/60' : 'text-ink/60'}`}>{body}</p>}
      </div>
    </div>
  )
}
