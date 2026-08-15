import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { CanvasPlane } from '@/components/viz/helpers'
import { mixColor } from '@/lib/colors'
import { C } from '@/lib/colors'
import { clsx } from 'clsx'

const SPHERE_R = 0.5

interface LatticeData {
  x: number
  y: number
  z: number
  color: THREE.Color
}

function buildLattice(L: number): LatticeData[] {
  const out: LatticeData[] = []
  for (let z = 1; z <= L; z++) {
    const t = L === 1 ? 0 : (z - 1) / (L - 1)
    const color = new THREE.Color(mixColor(C.amber, C.violet, t))
    for (let x = -L; x <= L; x++) {
      for (let y = -L; y <= L; y++) {
        out.push({ x, y, z, color })
      }
    }
  }
  return out
}

/** 三维整点阵小球 */
function LatticeSpheres({ L }: { L: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => buildLattice(L), [L])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    data.forEach((d, i) => {
      m.makeScale(SPHERE_R, SPHERE_R, SPHERE_R).setPosition(d.x, d.y, d.z)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, d.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

  return (
    <instancedMesh key={L} ref={ref} args={[undefined, undefined, data.length]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial roughness={0.35} metalness={0.15} />
    </instancedMesh>
  )
}

/** 画布上的投影圆片：位置 (x/z, y/z)，半径 0.5/z */
function ProjectedDiscs({ L }: { L: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const data = useMemo(() => buildLattice(L), [L])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    data.forEach((d, i) => {
      const r = SPHERE_R / d.z
      m.makeScale(r, r, 1).setPosition(d.x / d.z, d.y / d.z, 1.004)
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, d.color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

  return (
    <instancedMesh key={L} ref={ref} args={[undefined, undefined, data.length]}>
      <cylinderGeometry args={[1, 1, 0.006, 18]} />
      <meshBasicMaterial transparent opacity={0.85} />
    </instancedMesh>
  )
}

function PainterCam({ painter }: { painter: boolean }) {
  const { camera } = useThree()
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null
  const anim = useRef(0)
  const orbitPos = useRef(new THREE.Vector3(5.2, 4.0, 5.6))
  const orbitLook = useRef(new THREE.Vector3(0, 0, 0.8))

  useEffect(() => {
    if (!painter) orbitPos.current.copy(camera.position)
    anim.current = 1
    if (controls) controls.enabled = false
  }, [painter, camera, controls])

  useFrame((_, delta) => {
    if (anim.current <= 0) return
    anim.current -= delta / 1.1
    if (anim.current <= 0) {
      anim.current = 0
      if (controls) controls.enabled = true
      return
    }
    const k = 1 - Math.pow(1 - 0.1, 60 * delta)
    const toPos = painter ? new THREE.Vector3(0, 0.05, 5.8) : orbitPos.current
    const toLook = painter ? new THREE.Vector3(0, 0, 1.0) : orbitLook.current
    camera.position.lerp(toPos, k)
    camera.lookAt(toLook)
    if (controls) {
      controls.target.lerp(toLook, k)
      controls.update()
    }
  })

  return null
}

interface CrystalLatticeProps {
  active?: boolean
}

/** 第八章：无限晶格 —— 三维整点阵投影出平面上的所有有理点 */
export default function CrystalLattice({ active = true }: CrystalLatticeProps) {
  const [L, setL] = useState(3)
  const [painter, setPainter] = useState(false)
  const count = (2 * L + 1) * (2 * L + 1) * L

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [5.2, 4.0, 5.6], fov: 50, near: 0.05, far: 40 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <color attach="background" args={['#0b0b18']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 3]} intensity={1} />
        {!painter && <LatticeSpheres L={L} />}
        <ProjectedDiscs L={L} />
        <CanvasPlane size={[4.4, 3.2]} position={[0, 0, 1]} label="画布 z = 1" />
        <PainterCam painter={painter} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enabled={!painter}
          minDistance={3}
          maxDistance={14}
          target={[0, 0, 0.8]}
        />
      </Canvas>

      <div className="pointer-events-none absolute right-3 top-3 flex flex-col items-end gap-1.5">
        <span className="rounded-lg border border-white/10 bg-ink-950/80 px-2.5 py-1 text-[10px] text-slate-400 backdrop-blur">
          {count} 个整点 · 半径 r/|z|
        </span>
        <span className="rounded-lg border border-white/10 bg-ink-950/80 px-2.5 py-1 text-[10px] text-slate-500 backdrop-blur">
          <span className="text-brand-amber">■</span> 近 · 简单有理数
          <span className="ml-2 text-brand-violet">■</span> 远 · 复杂有理数
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-ink-950/80 px-3 py-2 backdrop-blur">
        <button
          onClick={() => setPainter((v) => !v)}
          className={clsx(
            'rounded-lg border px-3 py-1.5 text-[11px] transition',
            painter
              ? 'border-brand-emerald/50 bg-brand-emerald/10 text-brand-emerald'
              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
          )}
        >
          {painter ? '返回 3D 视角' : '🔭 正视画布：看有理点星图'}
        </button>
        <label className="flex items-center gap-2 text-[11px] text-slate-400">
          点阵范围
          <input
            type="range"
            min={1}
            max={4}
            value={L}
            onChange={(e) => setL(Number(e.target.value))}
            className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-emerald"
            aria-label="点阵范围"
          />
          <span className="font-mono text-brand-emerald">L={L}</span>
        </label>
        <span className="ml-auto hidden text-[10px] text-slate-600 md:inline">
          (x,y,z) → (x/z, y/z) · 越大越简单的球
        </span>
      </div>
    </div>
  )
}
