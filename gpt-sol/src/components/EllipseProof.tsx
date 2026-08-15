import { useState } from 'react'

export function EllipseProof() {
  const [tilt, setTilt] = useState(38)
  const ry = 118 * Math.cos((tilt * Math.PI) / 180)
  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-vermilion text-paper lg:grid-cols-2">
      <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
        <span className="font-mono text-[10px] uppercase tracking-[.2em] text-white/55">Final proposition</span>
        <h3 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">圆的透视投影，<br/>为什么是椭圆？</h3>
        <p className="mt-5 max-w-md leading-7 text-white/70">视点与圆周生成一个圆锥；画布是圆锥的平面截面。改变圆所在平面的倾角，就在正圆与椭圆之间连续过渡。</p>
        <div className="mt-8 max-w-sm">
          <div className="flex justify-between font-mono text-xs text-white/60"><span>平面倾角</span><span>{tilt}°</span></div>
          <input aria-label="圆平面的倾角" type="range" min="0" max="72" value={tilt} onChange={e=>setTilt(Number(e.target.value))} className="range-input mt-4 w-full"/>
        </div>
      </div>
      <div className="relative min-h-[420px] bg-[#c94b34]">
        <div className="paper-grid absolute inset-0 opacity-10"/>
        <svg viewBox="0 0 520 500" className="absolute inset-0 h-full w-full" aria-label="圆锥截面与椭圆投影">
          <path d="M260 55 L75 400 M260 55 L445 400" fill="none" stroke="#f3f0e8" strokeWidth="1.5" opacity=".35"/>
          <ellipse cx="260" cy="400" rx="185" ry="38" fill="#17201d" fillOpacity=".12" stroke="#f3f0e8" strokeOpacity=".35"/>
          <ellipse cx="260" cy="270" rx="118" ry={ry} fill="#e8bf65" fillOpacity=".35" stroke="#f3f0e8" strokeWidth="3" transform={`rotate(${-tilt*.16} 260 270)`}/>
          <line x1="110" y1="270" x2="410" y2="270" stroke="#f3f0e8" strokeDasharray="5 7" opacity=".35" transform={`rotate(${-tilt*.16} 260 270)`}/>
          <circle cx="260" cy="55" r="7" fill="#e8bf65"/><text x="275" y="58" fill="#f3f0e8" fontSize="11">视点 / 圆锥顶点</text>
          <text x="186" y="457" fill="#f3f0e8" fontSize="12" letterSpacing="2">CONIC SECTION</text>
        </svg>
      </div>
    </div>
  )
}
