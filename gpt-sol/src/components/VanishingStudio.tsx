import { useState } from 'react'

export function VanishingStudio() {
  const [points, setPoints] = useState(1)
  const vps = points === 1 ? [[310,115]] : points === 2 ? [[80,120],[540,120]] : [[80,120],[540,120],[310,25]]
  const corners = [[210,180],[410,180],[410,330],[210,330]]
  return (
    <div className="grid gap-8 rounded-[2rem] border border-ink/10 bg-white/45 p-5 sm:p-8 lg:grid-cols-[.75fr_1.25fr]">
      <div className="flex flex-col justify-center">
        <span className="font-mono text-xs uppercase tracking-[.18em] text-vermilion">Direction → destination</span>
        <h3 className="mt-4 font-serif text-3xl sm:text-4xl">一组方向，<br/>一个消失点。</h3>
        <p className="mt-4 max-w-md leading-7 text-ink/60">当方向向量 d=(a,b,c) 的深度分量 c≠0，直线延伸至无穷，投影会收敛到 (a/c,b/c)。</p>
        <div className="mt-8 flex gap-2">
          {[1,2,3].map(n=><button key={n} onClick={()=>setPoints(n)} className={`rounded-full border px-4 py-2 text-sm transition ${points===n?'border-ink bg-ink text-paper':'border-ink/15 hover:border-ink/40'}`}>{n} 点透视</button>)}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
        <svg viewBox="0 0 620 380" className="h-full min-h-[360px] w-full" aria-label={`${points}点透视示意图`}>
          <defs><pattern id="g" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#315c4a" strokeOpacity=".08"/></pattern></defs>
          <rect width="620" height="380" fill="url(#g)"/><line x1="20" y1="120" x2="600" y2="120" stroke="#de5b3f" strokeDasharray="5 7" opacity=".5"/>
          {vps.map(([x,y],i)=><g key={i}>{corners.map(([cx,cy],j)=><line key={j} x1={cx} y1={cy} x2={x} y2={y} stroke="#315c4a" opacity=".24"/>)}<circle cx={x} cy={y} r="6" fill="#de5b3f"/><text x={x+10} y={y-10} fontSize="10" fill="#de5b3f">V{i+1}</text></g>)}
          <rect x="210" y="180" width="200" height="150" fill="#e8bf65" fillOpacity=".32" stroke="#17201d" strokeWidth="2"/>
          {points>1&&<path d="M210 180 L130 218 L130 345 L210 330 M410 180 L483 220 L483 344 L410 330 M130 218 L310 255 L483 220" fill="#315c4a" fillOpacity=".08" stroke="#17201d" strokeWidth="1.5"/>}
        </svg>
      </div>
    </div>
  )
}
