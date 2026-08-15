export function Formula({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-4 py-2 font-mono text-sm tracking-tight ${dark ? 'border-white/15 bg-white/5 text-paper' : 'border-ink/10 bg-white/45 text-moss'}`}>
      {children}
    </div>
  )
}
