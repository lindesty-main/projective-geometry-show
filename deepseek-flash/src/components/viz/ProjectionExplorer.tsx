import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, DragControls } from '@react-three/drei'
import * as THREE from 'three'
import { CanvasPlane, Dot, Eye, Line } from '@/components/viz/helpers'
import { clamp, fmt, project, type Vec3 } from '@/lib/math'
import { C } from '@/lib/colors'

const CUBE_CENTER: Vec3 = { x: 0, y: 0, z: 0.62 }
const CUBE_HALF = 0.4

const CUBE_VERTICES: Vec3[] = (() => {
  const out: Vec3[] = []
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      for (const sz of [-1, 1])
        out.push({
          x: CUBE_CENTER.x + (sx * CUBE_HALF),
          y: CUBE_CENTER.y + (sy * CUBE_HALF),
          z: CUBE_CENTER.z + (sz * CUBE_HALF),
        })
  return out
})()

const CUBE_EDGES: [number, number][] = [
  [0, 1], [2, 3], [4, 5], [6, 7], // x 方向
  [0, 2], [1, 3], [4, 6], [5, 7], // y 方向
  [0, 4], [1, 5], [2, 6], [3, 7], // z 方向
]

/** 立方体的 3D 线框 + 在画布上的投影图像 */
function CubeDemo({ show }: { show: boolean }) {
  const proj = useMemo(() => CUBE_VERTICES.map((v) => project(v)), [])
  return (
    <group visible={show}>
      {CUBE_EDGES.map(([a, b], i) => (
        <Line
          key={`e3-${i}`}
          points={[
            [CUBE_VERTICES[a].x, CUBE_VERTICES[a].y, CUBE_VERTICES[a].z],
            [CUBE_VERTICES[b].x, CUBE_VERTICES[b].y, CUBE_VERTICES[b].z],
          ]}
          color={C.violet}
          opacity={0.45}
          lineWidth={1.2}
        />
      ))}
      {proj.map((p, i) => (
        <Dot key={`v${i}`} position={[p.u, p.v, 1.012]} color={C.cyan} radius={0.035} />
      ))}
      {CUBE_EDGES.map(([a, b], i) => (
        <Line
          key={`e2-${i}`}
          points={[
            [proj[a].u, proj[a].v, 1.012],
            [proj[b].u, proj[b].v, 1.012],
          ]}
          color={C.cyan}
          lineWidth={2}
        />
      ))}
    </group>
  )
}

interface SceneProps {
  p: Vec3
  setP: (p: Vec3) => void
  showCube: boolean
  onHover: (info: string) => void
}

function Scene({ p, setP, showCube, onHover }: SceneProps) {
  const q = project(p)
  const sphereRef = useRef<THREE.Mesh>(null)

  // 让软光晕跟随
  useFrame(() => {
    if (sphereRef.current) sphereRef.current.position.set(p.x, p.y, p.z)
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1} />

      <Eye />
      <CanvasPlane size={[3.8, 2.8]} position={[0, 0, 1]} label="画布 z = 1" />
      <CubeDemo show={showCube} />

      {/* 光线：物体 → 画布 → 眼睛 */}
      <Line points={[[p.x, p.y, p.z], [q.u, q.v, 1.002]]} color={C.cyan} lineWidth={1.2} opacity={0.7} />
      <Line
        points={[[q.u, q.v, 1.002], [0, 0, 0]]}
        color={C.amber}
        lineWidth={1.2}
        dashed
        dashSize={0.045}
        gapSize={0.035}
        opacity={0.75}
      />

      {/* 投影点 */}
      <Dot position={[q.u, q.v, 1.01]} color={C.amber} radius={0.05} />

      {/* 可拖拽的 P 点 */}
      <DragControls
        onDrag={(e) => {
          const o = (e as unknown as { object: THREE.Object3D }).object
          const nx = clamp(o.position.x, -2.6, 2.6)
          const ny = clamp(o.position.y, -2.2, 2.2)
          const nz = clamp(o.position.z, 0.18, 3.6)
          o.position.set(nx, ny, nz)
          const np = { x: nx, y: ny, z: nz }
          setP(np)
          const qq = project(np)
          onHover(
            `P = (${fmt(np.x)}, ${fmt(np.y)}, ${fmt(np.z)})\nQ = (${fmt(qq.u)}, ${fmt(qq.v)})`,
          )
        }}
      >
        <mesh position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshBasicMaterial color={C.cyan} />
        </mesh>
      </DragControls>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={C.cyan} transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* 说明性的方向箭头 */}
      <Line points={[[-2.7, 1.9, 0], [-2.2, 1.9, 0]]} color={C.slate} opacity={0.35} lineWidth={1} />
    </>
  )
}

/** 第一章：第一性原理 —— 三维点 → 画布上的投影 */
export default function ProjectionExplorer({ active }: { active: boolean }) {
  const [p, setP] = useState<Vec3>({ x: 0.95, y: 0.55, z: 1.9 })
  const [showCube, setShowCube] = useState(true)
  const [info, setInfo] = useState('')

  const q = project(p)
  const display = info || `P = (${fmt(p.x)}, ${fmt(p.y)}, ${fmt(p.z)})\nQ = (${fmt(q.u)}, ${fmt(q.v)})`

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [2.7, 1.9, 2.9], fov: 45, near: 0.05, far: 40 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <color attach="background" args={['#0b0b18']} />
        <Scene p={p} setP={setP} showCube={showCube} onHover={setInfo} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={1}
          maxDistance={10}
          target={[0, 0, 0.8]}
        />
      </Canvas>

      {/* 读数浮层 */}
      <div className="pointer-events-none absolute right-3 top-3 rounded-lg border border-white/10 bg-ink-950/80 px-3 py-2 font-mono text-[11px] leading-5 text-slate-200 backdrop-blur">
        {display.split('\n').map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>

      {/* 交互说明 */}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-ink-950/70 px-2.5 py-1.5 text-[11px] text-slate-400">
        <span className="text-brand-cyan">●</span> 拖动青色小球 · <span className="text-brand-amber">●</span>{' '}
        投影点 = (x/z, y/z)
      </div>

      <button
        onClick={() => setShowCube((v) => !v)}
        className="absolute bottom-3 right-3 rounded-lg border border-white/10 bg-ink-950/70 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur transition hover:bg-white/10"
      >
        {showCube ? '隐藏立方体' : '显示立方体'}
      </button>
    </div>
  )
}
