const gcd = (a:number,b:number):number => b ? gcd(b,a%b) : a

export function RationalForest() {
  const trees = []
  for(let q=2;q<=18;q++) for(let p=1;p<q;p++) if(gcd(p,q)===1) trees.push({x:p/q,q})
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#cbd6c9] px-5 pb-0 pt-8 sm:px-10 sm:pt-10">
      <div className="paper-grid absolute inset-0 opacity-50"/>
      <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div><span className="font-mono text-[10px] uppercase tracking-[.2em] text-moss/60">The rational forest</span><h3 className="mt-3 font-serif text-3xl">每棵树，都是一个分数。</h3></div>
        <div className="max-w-sm text-sm leading-6 text-ink/55">横坐标是最简分数 p/q，高度为 1/q。分母越小，树越高——数的“简洁程度”因此变得可见。</div>
      </div>
      <svg viewBox="0 0 1000 360" className="relative mt-2 w-full" aria-label="0到1之间的有理数森林">
        <path d="M0 310 Q170 270 340 310 T680 305 T1000 305 V360 H0Z" fill="#315c4a" opacity=".12"/>
        {trees.sort((a,b)=>b.q-a.q).map(({x,q},i)=>{const h=38+250/q*2; return <g key={i} transform={`translate(${x*940+30} ${315-h})`}><line y1={h*.22} y2={h} stroke="#315c4a" strokeWidth={Math.max(1,7-q*.25)}/><path d={`M0 0 L${-h*.15} ${h*.58} L${h*.15} ${h*.58}Z`} fill={q<6?'#315c4a':'#73917e'} opacity={q<6?.95:.65}/>{q<=5&&<text y={-8} textAnchor="middle" fontSize="12" fill="#17201d">{Math.round(x*q)}/{q}</text>}</g>})}
        <line x1="25" y1="315" x2="975" y2="315" stroke="#17201d"/><text x="25" y="338" fontSize="11">0</text><text x="970" y="338" fontSize="11">1</text>
      </svg>
    </div>
  )
}
