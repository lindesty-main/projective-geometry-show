import { motion } from 'framer-motion'

const rays = [52, 94, 148, 207, 260]

export function HeroScene() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-ink/10 bg-[#dfe5d9] sm:h-[520px]">
      <div className="paper-grid absolute inset-0 opacity-55" />
      <div className="absolute left-6 top-6 z-10 rounded-full border border-ink/10 bg-paper/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.18em] backdrop-blur">Perspective chamber · 001</div>
      <svg viewBox="0 0 600 520" className="absolute inset-0 h-full w-full" aria-label="眼睛、画布和空间物体的透视投影示意图">
        <defs>
          <linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f9f5e9"/><stop offset="1" stopColor="#e8dfc9"/></linearGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
        </defs>
        <ellipse cx="412" cy="425" rx="135" ry="25" fill="#315c4a" opacity=".13" filter="url(#soft)" />
        <path d="M86 260 L515 120 M86 260 L515 400" stroke="#315c4a" opacity=".12" strokeDasharray="5 7"/>
        <path d="M86 260 L515 185 M86 260 L515 335" stroke="#de5b3f" opacity=".3" strokeDasharray="4 7"/>
        <g transform="translate(245 0)">
          <path d="M0 80 L32 69 L32 445 L0 455 Z" fill="url(#canvas)" stroke="#17201d" strokeWidth="1.2"/>
          <line x1="8" y1="90" x2="8" y2="442" stroke="#315c4a" opacity=".15"/>
          {rays.map((y, i) => <circle key={y} cx={13 + i * 2} cy={y} r="3.5" fill="#de5b3f" />)}
          <text x="0" y="480" fill="#17201d" fontSize="11" letterSpacing="2">画布 z = 1</text>
        </g>
        <g transform="translate(86 260)">
          <circle r="17" fill="#17201d" />
          <circle r="6" fill="#e8bf65" />
          <path d="M-30 -23 Q0 -47 30 -23 M-30 23 Q0 47 30 23" fill="none" stroke="#17201d" strokeWidth="2"/>
          <text x="-20" y="68" fill="#17201d" fontSize="11" letterSpacing="2">视点 O</text>
        </g>
        <motion.g initial={{ x: 15, opacity: .5 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1.2 }}>
          <path d="M424 178 L514 154 L514 331 L424 360 Z" fill="#315c4a" opacity=".16"/>
          <path d="M424 178 L375 143 L467 120 L514 154 Z" fill="#e8bf65" opacity=".72"/>
          <path d="M375 143 L375 314 L424 360 L424 178 Z" fill="#de5b3f" opacity=".75"/>
          <g fill="none" stroke="#17201d" strokeWidth="2">
            <path d="M375 143 L467 120 L514 154 L424 178 Z M375 143 V314 L424 360 V178 M424 360 L514 331 V154 M375 314 L467 285 L514 331 M467 120 V285"/>
          </g>
          <text x="445" y="393" fill="#17201d" fontSize="11" letterSpacing="2">物体 P(x,y,z)</text>
        </motion.g>
        <g fontFamily="monospace" fontSize="12" fill="#315c4a">
          <text x="150" y="202">光线 OP</text>
          <text x="168" y="333">u = x/z</text>
          <text x="168" y="352">v = y/z</text>
        </g>
      </svg>
      <div className="absolute bottom-5 right-5 rounded-2xl border border-white/60 bg-paper/80 p-4 shadow-sm backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-moss/60">Universal rule</p>
        <p className="mt-1 font-serif text-2xl italic">P(x,y,z) → p(x/z,y/z)</p>
      </div>
    </div>
  )
}
