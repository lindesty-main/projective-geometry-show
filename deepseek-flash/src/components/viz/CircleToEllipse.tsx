import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Canvas2D } from '@/components/ui/Canvas2D'
import { CanvasPlane, Dot, Eye, Line } from '@/components/viz/helpers'
import { TAU } from '@/lib/math'
import { C } from '@/lib/colors'
import { clsx } from 'clsx'
import { Pause, Play } from 'lucide-react'

const RING_POINTS = 160

// 模块级常量：圆环与椭圆的采样点（只计算一次）
const ringPts: [number, number, number][] = (() => {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= RING_POINTS; i++) {
    const th = (i / RING_POINTS) * TAU
    pts.push([Math.cos(th), 1, 2 + Math.sin(th)])
  }
  return pts
})()

const ellipsePts: [number, number, number][] = (() => {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= 300; i++) {
    const th = (i / 300) * TAU
    const z = 2 + Math.sin(th)
    pts.push([Math.cos(th) / z, 1 / z, 1.012])
  }
  return pts
})()

/** 3D：圆 + 眼锥 + 画布上的椭圆 */
function CircleScene({ onTick }: { onTick: (th: number, u: number, v: number) => void }) {
  const dotRef = useRef<THREE.Mesh>(null)
  const imgRef = useRef<THREE.Mesh>(null)
  const rayGeo = useMemo(() => new THREE.BufferGeometry(), [])
  const coneGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const arr: number[] = []
    for (let i = 0; i < RING_POINTS; i++) {
      const th = (i / RING_POINTS) * TAU
      arr.push(0, 0, 0, Math.cos(th), 1, 2 + Math.sin(th))
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
    return g
  }, [])
  const lastTick = useRef('')

  useFrame((state) => {
    const th = state.clock.elapsedTime * 0.7
    const x = Math.cos(th)
    const z = 2 + Math.sin(th)
    dotRef.current?.position.set(x, 1, z)
    imgRef.current?.position.set(x / z, 1 / z, 1.012)
    rayGeo.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 1, z)])
    const u = x / z
    const v = 1 / z
    const key = `${Math.round((th / Math.PI) * 180)}|${u.toFixed(2)}|${v.toFixed(2)}`
    if (key !== lastTick.current) {
      lastTick.current = key
      onTick(th, u, v)
    }
  })

  return (
    <>
      <Eye />
      <CanvasPlane size={[3.2, 2.4]} position={[0, 0, 1]} label="画布 z = 1" />

      {/* 圆锥（顶点=眼睛，底面=圆） */}
      <lineSegments geometry={coneGeo}>
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.1} />
      </lineSegments>

      {/* 圆与投影像 */}
      <Line points={ringPts} color={C.cyan} lineWidth={2.2} />
      <Line points={ellipsePts} color={C.violet} lineWidth={2} />

      {/* 椭圆中心标记（偏上） */}
      <group position={[0, 2 / 3, 1.018]}>
        <Dot position={[0, 0, 0]} color={C.rose} radius={0.035} />
        <Line
          points={[
            [-0.09, 0, 0],
            [0.09, 0, 0],
          ]}
          color={C.rose}
          opacity={0.7}
          lineWidth={1.2}
        />
        <Line
          points={[
            [0, -0.09, 0],
            [0, 0.09, 0],
          ]}
          color={C.rose}
          opacity={0.7}
          lineWidth={1.2}
        />
      </group>

      {/* 运动射线 */}
      <line>
        <primitive object={rayGeo} attach="geometry" />
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.5} />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshBasicMaterial color={C.cyan} />
      </mesh>
      <mesh ref={imgRef}>
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshBasicMaterial color={C.amber} />
      </mesh>

      <Html center position={[0, 1.15, 2.35]} distanceFactor={10} style={{ pointerEvents: 'none', fontSize: 11, color: '#22d3ee' }}>
        圆 (cosθ, 1, 2+sinθ)
      </Html>
    </>
  )
}

/** 2D：逐点对应 —— 圆上的点 ↔ 椭圆上的点 */
function PointMatch({ active, theta, auto }: { active: boolean; theta: number; auto: boolean }) {
  const thRef = useRef(theta)
  thRef.current = theta
  const autoRef = useRef(auto)
  autoRef.current = auto
  const tRef = useRef(0)

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    ctx.clearRect(0, 0, w, h)
    const th = autoRef.current ? (t * 0.6) % TAU : (thRef.current * Math.PI) / 180
    tRef.current = th

    // ---- 左：圆空间（x-z 平面）----
    const pw = w * 0.44
    const cxA = pw / 2
    const cyA = h * 0.52
    const R = Math.min(pw, h) * 0.3
    const zScale = R
    const Xa = (x: number) => cxA + x * zScale
    const Za = (z: number) => cyA - (z - 2) * zScale // 圆心 z=2

    // 轴
    ctx.strokeStyle = 'rgba(148,163,184,0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, cyA)
    ctx.lineTo(pw, cyA)
    ctx.moveTo(cxA, 12)
    ctx.lineTo(cxA, h - 12)
    ctx.stroke()
    ctx.fillStyle = 'rgba(148,163,184,0.6)'
    ctx.font = '11px sans-serif'
    ctx.fillText('x', pw - 10, cyA + 14)
    ctx.fillText('z', cxA + 8, 16)

    // 圆
    ctx.strokeStyle = C.cyan
    ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * TAU
      const x = Math.cos(a)
      const z = 2 + Math.sin(a)
      if (i === 0) ctx.moveTo(Xa(x), Za(z))
      else ctx.lineTo(Xa(x), Za(z))
    }
    ctx.stroke()

    // 半径线与动点
    const xp = Math.cos(th)
    const zp = 2 + Math.sin(th)
    ctx.strokeStyle = 'rgba(251,191,36,0.6)'
    ctx.lineWidth = 1.2
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(Xa(0), Za(2))
    ctx.lineTo(Xa(xp), Za(zp))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(Xa(xp), Za(zp), 4.5, 0, TAU)
    ctx.fillStyle = C.cyan
    ctx.fill()

    ctx.fillStyle = 'rgba(226,232,240,0.85)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('空间中的圆（x-z 截面）', 12, 16)

    // ---- 右：u-v 平面 ----
    const left = pw + 8
    const pw2 = w - left - 14
    const cxB = left + pw2 / 2
    const cyB = h * 0.52
    const S = Math.min(pw2, h) * 0.42
    const Xu = (u: number) => cxB + u * S
    const Yv = (v: number) => cyB - (v - 0.5) * S * 2.2

    // 轴
    ctx.strokeStyle = 'rgba(148,163,184,0.25)'
    ctx.beginPath()
    ctx.moveTo(left, cyB)
    ctx.lineTo(w - 6, cyB)
    ctx.moveTo(cxB, 12)
    ctx.lineTo(cxB, h - 12)
    ctx.stroke()
    ctx.fillStyle = 'rgba(148,163,184,0.6)'
    ctx.fillText('u', w - 12, cyB + 14)
    ctx.fillText('v', cxB + 6, 16)

    // 椭圆
    ctx.strokeStyle = C.violet
    ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const a = (i / 200) * TAU
      const z = 2 + Math.sin(a)
      const u = Math.cos(a) / z
      const v = 1 / z
      if (i === 0) ctx.moveTo(Xu(u), Yv(v))
      else ctx.lineTo(Xu(u), Yv(v))
    }
    ctx.stroke()

    // 中心标记（偏上）
    ctx.strokeStyle = 'rgba(251,113,133,0.7)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(Xu(-0.1), Yv(2 / 3))
    ctx.lineTo(Xu(0.1), Yv(2 / 3))
    ctx.moveTo(Xu(0), Yv(2 / 3 - 0.05))
    ctx.lineTo(Xu(0), Yv(2 / 3 + 0.05))
    ctx.stroke()
    ctx.fillStyle = 'rgba(251,113,133,0.8)'
    ctx.font = '10px sans-serif'
    ctx.fillText('中心 (0, 2/3)', Xu(0) + 8, Yv(2 / 3) - 6)

    // 动点
    const zu = 2 + Math.sin(th)
    const u = Math.cos(th) / zu
    const v = 1 / zu
    ctx.beginPath()
    ctx.arc(Xu(u), Yv(v), 4.5, 0, TAU)
    ctx.fillStyle = C.amber
    ctx.fill()

    // 读数
    ctx.fillStyle = 'rgba(226,232,240,0.85)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('画布上的投影像（u-v 平面）', left + 6, 16)
    ctx.fillStyle = 'rgba(251,191,36,0.9)'
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.fillText(
      `θ=${((th / Math.PI) * 180).toFixed(0)}°  →  u=${u.toFixed(3)}, v=${v.toFixed(3)}`,
      left + 6,
      h - 10,
    )

    // 方程
    ctx.fillStyle = 'rgba(148,163,184,0.7)'
    ctx.font = '11px "JetBrains Mono", monospace'
    ctx.textAlign = 'right'
    ctx.fillText('u² + 3v² − 4v + 1 = 0', w - 8, h - 10)
  }

  return <Canvas2D active={active} className="h-full w-full" draw={draw} interactive={false} />
}

interface CircleToEllipseProps {
  active?: boolean
}

/** 第九章：圆与椭圆 */
export default function CircleToEllipse({ active = true }: CircleToEllipseProps) {
  const [tab, setTab] = useState<'3d' | '2d'>('3d')
  const [readout, setReadout] = useState('θ=0.0° → u=0.500, v=0.500')
  const [theta, setTheta] = useState(0)
  const [auto, setAuto] = useState(true)

  const onTick = (th: number, u: number, v: number) => {
    setReadout(`θ=${((th / Math.PI) * 180).toFixed(0)}°  →  u=${u.toFixed(3)}, v=${v.toFixed(3)}`)
  }

  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => setTheta((v) => (v + 1.5) % 360), 40)
    return () => window.clearInterval(id)
  }, [auto])

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        {tab === '3d' ? (
          <Canvas
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 2]}
            camera={{ position: [3.4, 2.6, 3.8], fov: 48, near: 0.05, far: 30 }}
            gl={{ antialias: true }}
            className="h-full w-full"
          >
            <color attach="background" args={['#0b0b18']} />
            <CircleScene onTick={onTick} />
            <OrbitControls makeDefault enablePan={false} minDistance={2} maxDistance={10} target={[0, 0.5, 1.2]} />
          </Canvas>
        ) : (
          <PointMatch active={active} theta={theta} auto={auto} />
        )}

        {/* 读数浮层 */}
        <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-ink-950/80 px-3 py-1.5 font-mono text-[11px] text-brand-amber backdrop-blur">
          {readout}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-3 py-2.5">
        <div className="flex overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setTab('3d')}
            className={clsx(
              'px-3 py-1.5 text-[11px] transition',
              tab === '3d' ? 'bg-brand-cyan/15 text-brand-cyan' : 'bg-white/5 text-slate-400 hover:text-slate-200',
            )}
          >
            3D · 圆锥与画布
          </button>
          <button
            onClick={() => setTab('2d')}
            className={clsx(
              'px-3 py-1.5 text-[11px] transition',
              tab === '2d' ? 'bg-brand-violet/15 text-brand-violet' : 'bg-white/5 text-slate-400 hover:text-slate-200',
            )}
          >
            2D · 逐点对应
          </button>
        </div>
        {tab === '2d' && (
          <>
            <button
              onClick={() => setAuto((v) => !v)}
              className={`btn-ghost px-2.5 py-1.5 text-[11px] ${auto ? 'border-brand-violet/40 text-brand-violet' : ''}`}
            >
              {auto ? <Pause size={12} /> : <Play size={12} />}
              {auto ? '自动' : '手动'}
            </button>
            <input
              type="range"
              min={0}
              max={360}
              value={theta}
              onChange={(e) => {
                setAuto(false)
                setTheta(Number(e.target.value))
              }}
              className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-violet"
              aria-label="角度"
            />
            <span className="font-mono text-[11px] text-slate-500">{theta}°</span>
          </>
        )}
        <span className="ml-auto hidden text-[10px] text-slate-600 sm:inline">
          圆 → 标准椭圆；注意椭圆的中心总是比圆心"偏上"
        </span>
      </div>
    </div>
  )
}
