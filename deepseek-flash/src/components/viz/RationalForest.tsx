import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { mixColor } from '@/lib/colors'
import { C } from '@/lib/colors'
import { gcd } from '@/lib/math'
import { Eye } from '@/components/viz/helpers'
import { Play, Pause } from 'lucide-react'

const N_MAX = 30

/** 三维树：位置 (j−i, ·, j+i)，i+j ≤ N */
function Trees({ N }: { N: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const data = useMemo(() => {
    const entries: { x: number; z: number; n: number; color: THREE.Color }[] = []
    for (let n = 0; n <= N; n++) {
      for (let i = 0; i <= n; i++) {
        const j = n - i
        entries.push({
          x: j - i,
          z: j + i,
          n,
          color: new THREE.Color(mixColor(C.cyan, C.violet, n / N)),
        })
      }
    }
    return entries
  }, [N])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    data.forEach((d, i) => {
      m.makeTranslation(d.x, 0.5, d.z)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, d.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

  return (
    <instancedMesh key={N} ref={meshRef} args={[undefined, undefined, data.length]}>
      <cylinderGeometry args={[0.015, 0.024, 1, 5]} />
      <meshStandardMaterial roughness={0.85} metalness={0.1} />
    </instancedMesh>
  )
}

interface ForestProjectionProps {
  N: number
  active: boolean
}

/** 投影结果：u=(j−i)/(j+i)，v=1/(j+i) */
function ForestProjection({ N, active }: ForestProjectionProps) {
  const nRef = useRef(N)
  nRef.current = N

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h)
    const Nv = nRef.current
    const pad = 24
    const plotW = w - pad * 2
    const plotH = h - pad * 2
    const X = (u: number) => pad + ((u + 1) / 2) * plotW
    const Y = (v: number) => pad + (1 - v) * plotH

    // 边框与基线
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    ctx.strokeRect(pad, pad, plotW, plotH)
    ctx.strokeStyle = 'rgba(148,163,184,0.35)'
    ctx.beginPath()
    ctx.moveTo(pad, Y(0))
    ctx.lineTo(w - pad, Y(0))
    ctx.stroke()

    // 按 n 从大到小绘制（保证最简分数的最高的树最后画、在最上层）
    for (let n = Nv; n >= 1; n--) {
      const color = mixColor(C.cyan, C.violet, n / Nv)
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.75
      ctx.lineWidth = 1.6
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const j = n - i
        const u = (j - i) / n
        const v = 1 / n
        ctx.moveTo(X(u), Y(0))
        ctx.lineTo(X(u), Y(v))
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    // 分数标注（n ≤ 6 且为最简分数）
    if (Nv >= 2) {
      ctx.fillStyle = 'rgba(203, 213, 225, 0.85)'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      for (let n = 2; n <= Math.min(Nv, 6); n++) {
        for (let k = 1; k < n; k++) {
          if (gcd(k, n) !== 1) continue
          const u = k / n
          ctx.fillText(`${k}/${n}`, X(u), Y(1 / n) - 4)
        }
      }
    }

    // 轴标注
    ctx.fillStyle = 'rgba(148,163,184,0.55)'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('0', pad + 2, Y(0) + 14)
    ctx.textAlign = 'right'
    ctx.fillText('1', w - pad - 2, Y(0) + 14)
    ctx.fillStyle = 'rgba(34,211,238,0.7)'
    ctx.textAlign = 'left'
    ctx.fillText('u → 全体有理数', pad + 2, pad + 12)
  }

  return <Canvas2D active={active} className="h-full w-full" draw={draw} interactive={false} />
}

interface RationalForestProps {
  active?: boolean
}

/** 第七章：有理数森林 —— 无限网格的树投影出全体正有理数 */
export default function RationalForest({ active = true }: RationalForestProps) {
  const [N, setN] = useState(16)
  const [auto, setAuto] = useState(false)

  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => {
      setN((v) => (v >= 26 ? 2 : v + 1))
    }, 90)
    return () => window.clearInterval(id)
  }, [auto])

  return (
    <div className="flex h-full flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        {/* 3D 场景 */}
        <div className="relative h-[260px] lg:h-auto">
          <Canvas
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 2]}
            camera={{ position: [5.4, 4.4, 5.8], fov: 45, near: 0.05, far: 60 }}
            gl={{ antialias: true }}
            className="h-full w-full"
          >
            <color attach="background" args={['#0b0b18']} />
            <fog attach="fog" args={['#0b0b18', 10, 26]} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 8, 3]} intensity={0.9} />
            <Trees N={N} />
            <Grid
              position={[0, 0.01, 0]}
              args={[40, 40]}
              cellSize={1}
              cellThickness={0.6}
              cellColor="#1e293b"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#334155"
              fadeDistance={24}
              fadeStrength={1}
              infiniteGrid={false}
            />
            <Eye label="眼睛" />
            <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={20} target={[0, 0.4, 0]} />
          </Canvas>
          <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-white/10 bg-ink-950/70 px-2 py-1 text-[10px] text-slate-500">
            三维网格：基底 (1,1) 与 (1,−1)
          </div>
        </div>

        {/* 投影结果 */}
        <div className="relative h-[260px] border-t border-white/10 lg:h-auto lg:border-l lg:border-t-0">
          <ForestProjection N={N} active={active} />
          <div className="pointer-events-none absolute left-2 top-2 rounded-lg border border-white/10 bg-ink-950/70 px-2 py-1 text-[10px] text-slate-500">
            投影到画布：u=(j−i)/(j+i)，v=1/(j+i)
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5">
        <button
          onClick={() => setAuto((v) => !v)}
          className={`btn-ghost px-3 py-1.5 text-[11px] ${auto ? 'border-brand-violet/40 text-brand-violet' : ''}`}
        >
          {auto ? <Pause size={13} /> : <Play size={13} />}
          {auto ? '暂停生长' : '自动生长'}
        </button>
        <input
          type="range"
          min={2}
          max={N_MAX}
          value={N}
          onChange={(e) => {
            setAuto(false)
            setN(Number(e.target.value))
          }}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-violet"
          aria-label="网格规模"
        />
        <span className="font-mono text-[11px] text-brand-violet">i+j ≤ {N}</span>
      </div>
    </div>
  )
}
