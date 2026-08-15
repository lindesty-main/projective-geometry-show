import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Box, TrainFront, Waves } from 'lucide-react'

type Mode = 'cube' | 'wave' | 'rail'

const modes = [
  { id: 'cube' as const, label: '立方体', icon: Box },
  { id: 'wave' as const, label: '波浪线', icon: Waves },
  { id: 'rail' as const, label: '铁轨', icon: TrainFront },
]

function CubeProjection({ depth }: { depth: number }) {
  const near = 138 / depth
  const far = 138 / (depth + 2.4)
  const c = { x: 270, y: 190 }
  const pts = [
    [c.x-near, c.y-near], [c.x+near, c.y-near], [c.x+near, c.y+near], [c.x-near, c.y+near],
    [c.x-far, c.y-far], [c.x+far, c.y-far], [c.x+far, c.y+far], [c.x-far, c.y+far],
  ]
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
  return <g>{edges.map(([a,b], i) => <motion.line key={i} animate={{x1:pts[a][0],y1:pts[a][1],x2:pts[b][0],y2:pts[b][1]}} stroke={i<4?'#de5b3f':'#f3f0e8'} strokeWidth={i<4?3:1.8}/>)}</g>
}

function WaveProjection({ depth }: { depth: number }) {
  const points = useMemo(() => {
    const list:string[] = []
    for(let i=-260;i<=260;i+=2){ const u=i/110; if(Math.abs(u)>.035){ const v=u*Math.sin((depth*.8)/u); list.push(`${270+i},${190-v*70}`) } }
    return list.join(' ')
  }, [depth])
  return <><polyline points={points} fill="none" stroke="#e8bf65" strokeWidth="2.4"/><line x1="270" y1="48" x2="270" y2="332" stroke="#f3f0e8" opacity=".18" strokeDasharray="3 6"/></>
}

function RailProjection({ depth }: { depth: number }) {
  const horizon = 75
  const sleepers = Array.from({length: 12},(_,i)=> horizon + 270/(i+1+depth*.12))
  return <g>
    <path d={`M92 355 L270 ${horizon} L448 355`} fill="none" stroke="#e8bf65" strokeWidth="3"/>
    {sleepers.map((y,i)=>{ const t=(y-horizon)/(355-horizon); return <line key={i} x1={270-178*t} y1={y} x2={270+178*t} y2={y} stroke="#f3f0e8" strokeWidth={i<2?3:1.5} opacity={.35+i*.045}/> })}
    <line x1="28" y1={horizon} x2="512" y2={horizon} stroke="#de5b3f" strokeDasharray="5 6" opacity=".7"/>
    <circle cx="270" cy={horizon} r="5" fill="#de5b3f"/>
  </g>
}

export function ProjectionLab() {
  const [mode, setMode] = useState<Mode>('cube')
  const [depth, setDepth] = useState(4)
  const descriptions = {
    cube: ['同一物体，深度 z 越大，投影尺寸越小。', `当前缩放率 1/${depth.toFixed(1)}`],
    wave: ['空间中的平行正弦线，被深度除法压成无限振荡。', 'v = u · sin(1/u)'],
    rail: ['等距枕木投影后不再等距，而是逼近地平线。', '高度 ∝ 1/n · 间距 ∝ 1/n²'],
  }
  return (
    <div className="overflow-hidden rounded-[2rem] bg-ink text-paper shadow-2xl shadow-ink/10">
      <div className="grid lg:grid-cols-[310px_1fr]">
        <div className="flex flex-col border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <span className="font-mono text-[10px] uppercase tracking-[.2em] text-white/40">Live projection console</span>
          <h3 className="mt-5 font-serif text-3xl">投影实验台</h3>
          <p className="mt-3 text-sm leading-6 text-white/50">切换空间模型，拖动深度。所有画面都由同一个公式实时生成。</p>
          <div className="mt-8 grid grid-cols-3 gap-2 lg:grid-cols-1">
            {modes.map(({id,label,icon:Icon}) => <button key={id} onClick={()=>setMode(id)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm transition lg:justify-start ${mode===id?'bg-paper text-ink':'bg-white/5 text-white/55 hover:bg-white/10 hover:text-white'}`}><Icon size={16}/><span>{label}</span></button>)}
          </div>
          <div className="mt-8 lg:mt-auto">
            <div className="flex justify-between font-mono text-xs text-white/45"><span>深度 z</span><span>{depth.toFixed(1)}</span></div>
            <input aria-label="深度 z" type="range" min="2" max="9" step=".1" value={depth} onChange={e=>setDepth(Number(e.target.value))} className="range-input mt-4 w-full"/>
          </div>
        </div>
        <div className="relative min-h-[440px] bg-[#20332c] p-4 sm:p-8">
          <div className="paper-grid absolute inset-0 opacity-[.12]"/>
          <svg viewBox="0 0 540 380" className="relative mx-auto h-[350px] w-full max-w-2xl" aria-label={`${mode}的投影模拟`}>
            <line x1="25" y1="190" x2="515" y2="190" stroke="#f3f0e8" opacity=".12"/><line x1="270" y1="30" x2="270" y2="350" stroke="#f3f0e8" opacity=".12"/>
            {mode === 'cube' && <CubeProjection depth={depth}/>}
            {mode === 'wave' && <WaveProjection depth={depth}/>}
            {mode === 'rail' && <RailProjection depth={depth}/>}
          </svg>
          <div className="relative flex flex-col justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
            <p className="max-w-md text-sm text-white/55">{descriptions[mode][0]}</p>
            <code className="text-sm text-sun">{descriptions[mode][1]}</code>
          </div>
        </div>
      </div>
    </div>
  )
}
