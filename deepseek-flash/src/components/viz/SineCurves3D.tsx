import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { CanvasPlane, Eye, Line } from '@/components/viz/helpers'
import { sampleCurve, TAU, type Vec3 } from '@/lib/math'
import { C } from '@/lib/colors'
import { clsx } from 'clsx'

const T = TAU * 1.4 // 曲线参数范围 [-T, T]
const SAMPLES = 480

/** 两条三维正弦曲线及其投影 */
function Curves() {
  // 曲线 +：x=1, y=sin t, z=t
  const curvePlus = useMemo(() => sampleCurve((t) => ({ x: 1, y: Math.sin(t), z: t }), -T, T, SAMPLES), [])
  // 曲线 −：x=-1, y=sin t, z=t
  const curveMinus = useMemo(() => sampleCurve((t) => ({ x: -1, y: Math.sin(t), z: t }), -T, T, SAMPLES), [])
  // 投影曲线（两条曲线投影到同一条平面曲线 v = u·sin(1/u)）
  const proj = useMemo(() => {
    const pts: Vec3[] = []
    for (let i = 0; i < SAMPLES; i++) {
      const t = -T + ((2 * T) * i) / (SAMPLES - 1)
      if (Math.abs(t) < 0.2) continue
      const u = 1 / t
      if (Math.abs(u) > 2.4) continue // 限制在画布范围内
      const v = Math.sin(t) / t
      pts.push({ x: u, y: v, z: 1.01 })
    }
    return pts
  }, [])

  return (
    <>
      <Line points={curvePlus.map((p) => [p.x, p.y, p.z] as [number, number, number])} color={C.cyan} lineWidth={1.8} />
      <Line points={curveMinus.map((p) => [p.x, p.y, p.z] as [number, number, number])} color={C.violet} lineWidth={1.8} />
      <Line points={proj.map((p) => [p.x, p.y, p.z] as [number, number, number])} color={C.white} lineWidth={1.6} opacity={0.9} />
    </>
  )
}

/** 沿曲线运动的小球 + 其投影 */
function Runner({ boat }: { boat: boolean }) {
  const dotA = useRef<THREE.Mesh>(null)
  const dotB = useRef<THREE.Mesh>(null)
  const img = useRef<THREE.Mesh>(null)
  const rayGeoA = useMemo(() => new THREE.BufferGeometry(), [])
  const rayGeoB = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame(() => {
    const t = ((performance.now() / 1000) * (boat ? 0.9 : 1.1)) % (2 * T) - T
    const ta = t

    if (dotA.current) dotA.current.position.set(1, Math.sin(ta), ta)
    if (dotB.current) dotB.current.position.set(-1, Math.sin(ta), ta)
    const smoothT = Math.abs(ta) < 0.22 ? 0.22 * Math.sign(ta) : ta
    if (img.current) img.current.position.set(1 / smoothT, Math.sin(ta) / smoothT, 1.012)

    const pa = new THREE.Vector3(1, Math.sin(ta), ta)
    const pb = new THREE.Vector3(-1, Math.sin(ta), ta)
    const qa = new THREE.Vector3(1 / smoothT, Math.sin(ta) / smoothT, 1.012)
    rayGeoA.setFromPoints([pa, qa])
    rayGeoB.setFromPoints([pb, qa])
  })

  return (
    <>
      <line>
        <primitive object={rayGeoA} attach="geometry" />
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.35} />
      </line>
      <line>
        <primitive object={rayGeoB} attach="geometry" />
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.35} />
      </line>
      <mesh ref={dotA}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial color={C.cyan} />
      </mesh>
      <mesh ref={dotB}>
        <sphereGeometry args={[0.07, 20, 20]} />
        <meshBasicMaterial color={C.violet} />
      </mesh>
      <mesh ref={img}>
        <sphereGeometry args={[0.06, 20, 20]} />
        <meshBasicMaterial color={C.amber} />
      </mesh>
    </>
  )
}

/** 乘船视角：镜头沿河道顺流而下 */
function BoatCamera({ boat }: { boat: boolean }) {
  const { camera } = useThree()
  const saved = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null)
  const tRef = useRef(0)

  useFrame((state) => {
    if (!boat) {
      if (saved.current && tRef.current > 0) {
        tRef.current -= 1
        const k = 0.08
        camera.position.lerp(saved.current.pos, k)
      }
      return
    }
    if (!saved.current) {
      saved.current = {
        pos: camera.position.clone(),
        target: new THREE.Vector3(0, 0, 0),
      }
    }
    tRef.current = 30
    const z = ((state.clock.elapsedTime * 0.55) % (2 * T + 3)) - T - 1.5
    const y = 0.5 + 0.38 * Math.sin(z * 0.8)
    camera.position.set(0, y, z)
    camera.lookAt(0, 0, z + 1.7)
  })

  return null
}

/** 第二章：两条正弦曲线投影出 x·sin(1/x) */
export default function SineCurves3D({ active }: { active: boolean }) {
  const [boat, setBoat] = useState(false)

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [4.6, 2.6, 6.4], fov: 48, near: 0.05, far: 60 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <color attach="background" args={['#0b0b18']} />
        <fog attach="fog" args={['#0b0b18', 12, 26]} />
        <Curves />
        <Runner boat={boat} />
        <Eye label="眼睛" />
        <CanvasPlane size={[4.4, 3.0]} position={[0, 0, 1]} label="画布 z=1：v = u·sin(1/u)" />
        <BoatCamera boat={boat} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={2.2}
          maxDistance={16}
          enabled={!boat}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* 模式切换 */}
      <div className="absolute left-3 top-3 flex gap-2">
        <button
          onClick={() => setBoat(false)}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-[11px] backdrop-blur transition',
            !boat ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan' : 'border-white/10 bg-ink-950/70 text-slate-400 hover:text-slate-200',
          )}
        >
          环绕观察
        </button>
        <button
          onClick={() => setBoat(true)}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-[11px] backdrop-blur transition',
            boat ? 'border-brand-violet/50 bg-brand-violet/10 text-brand-violet' : 'border-white/10 bg-ink-950/70 text-slate-400 hover:text-slate-200',
          )}
        >
          🚣 乘船视角
        </button>
      </div>

      {boat && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-ink-950/80 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur">
          沿江而下：<span className="text-brand-cyan">青色</span>与
          <span className="text-brand-violet">紫色</span>两条"山脉"在你两侧连绵起伏
        </div>
      )}
    </div>
  )
}
