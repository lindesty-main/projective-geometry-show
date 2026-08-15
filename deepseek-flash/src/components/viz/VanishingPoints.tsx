import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { CanvasPlane, Dot, Line } from '@/components/viz/helpers'
import { rotateBasis, type Vec3 } from '@/lib/math'
import { C } from '@/lib/colors'
import { clsx } from 'clsx'

const HALF = 0.45
const CENTER: Vec3 = { x: 0, y: 0, z: 1.35 }
const EPS = 0.02

interface RigProps {
  thetaY: number
  thetaX: number
  painter: boolean
}

function useBox(ty: number, tx: number) {
  return useMemo(() => {
    const e1 = rotateBasis({ x: 1, y: 0, z: 0 }, ty, tx)
    const e2 = rotateBasis({ x: 0, y: 1, z: 0 }, ty, tx)
    const e3 = rotateBasis({ x: 0, y: 0, z: 1 }, ty, tx)
    const dirs = [e1, e2, e3]

    const corners: Vec3[] = []
    for (const s1 of [-1, 1])
      for (const s2 of [-1, 1])
        for (const s3 of [-1, 1])
          corners.push({
            x: CENTER.x + s1 * HALF * e1.x + s2 * HALF * e2.x + s3 * HALF * e3.x,
            y: CENTER.y + s1 * HALF * e1.y + s2 * HALF * e2.y + s3 * HALF * e3.y,
            z: CENTER.z + s1 * HALF * e1.z + s2 * HALF * e2.z + s3 * HALF * e3.z,
          })

    // 12 条棱：每两个仅在一个方向上不同的角
    const edges: [number, number][] = []
    for (let a = 0; a < 8; a++) {
      for (let b = a + 1; b < 8; b++) {
        let diff = 0
        for (let k = 0; k < 3; k++) if (Math.floor(a / Math.pow(2, k)) % 2 !== Math.floor(b / Math.pow(2, k)) % 2) diff++
        if (diff === 1) edges.push([a, b])
      }
    }

    const vps = dirs.map((d) => {
      if (Math.abs(d.z) < EPS) return null
      return { u: d.x / d.z, v: d.y / d.z }
    })

    const projected = corners.map((p) => ({ u: p.x / p.z, v: p.y / p.z }))

    return { dirs, corners, edges, vps, projected }
  }, [ty, tx])
}

function BoxScene({ thetaY, thetaX, painter }: RigProps) {
  const { corners, edges, vps, projected } = useBox(thetaY, thetaX)
  const parallelCount = vps.filter((v) => v === null).length

  return (
    <>
      {/* 3D 长方体 */}
      <group visible={!painter}>
        {edges.map(([a, b], i) => (
          <Line
            key={`b3-${i}`}
            points={[[corners[a].x, corners[a].y, corners[a].z], [corners[b].x, corners[b].y, corners[b].z]]}
            color={C.violet}
            opacity={0.4}
            lineWidth={1.3}
          />
        ))}
        {/* 顶点 */}
        {corners.map((c, i) => (
          <Dot key={`c3-${i}`} position={[c.x, c.y, c.z]} color={C.violet} radius={0.03} />
        ))}
      </group>

      {/* 画布上的投影图像 */}
      {edges.map(([a, b], i) => (
        <Line
          key={`b2-${i}`}
          points={[
            [projected[a].u, projected[a].v, 1.012],
            [projected[b].u, projected[b].v, 1.012],
          ]}
          color={C.cyan}
          lineWidth={2.2}
        />
      ))}
      {projected.map((p, i) => (
        <Dot key={`c2-${i}`} position={[p.u, p.v, 1.01]} color={C.cyan} radius={0.04} />
      ))}

      {/* 沿棱方向延长到消失点的辅助线 */}
      {edges.map(([a, b], i) => {
        const p1 = [projected[a].u, projected[a].v, 1.012] as [number, number, number]
        const p2 = [projected[b].u, projected[b].v, 1.012] as [number, number, number]
        const dx = p2[0] - p1[0]
        const dy = p2[1] - p1[1]
        return (
          <Line
            key={`ext-${i}`}
            points={[
              [p1[0] - dx * 0.9, p1[1] - dy * 0.9, 1.01],
              [p2[0] + dx * 0.9, p2[1] + dy * 0.9, 1.01],
            ]}
            color={C.violet}
            opacity={0.22}
            lineWidth={1}
            dashed
            dashSize={0.045}
            gapSize={0.04}
          />
        )
      })}

      {/* 消失点 */}
      {vps.map((vp, i) =>
        vp === null ? null : (
          <group key={`vp-${i}`}>
            <Dot position={[vp.u, vp.v, 1.02]} color={C.amber} radius={0.09} />
            <Dot position={[vp.u, vp.v, 1.02]} color={C.amber} radius={0.16} />
            <Html center distanceFactor={10} style={{ pointerEvents: 'none', fontSize: 11, color: '#fbbf24', opacity: 0.9 }}>
              消失点 {parallelCount === 0 ? i + 1 : ''}
            </Html>
          </group>
        ),
      )}
    </>
  )
}

/** 相机在环绕 / 画家视角之间平滑切换 */
function CameraRig({ painter, orbitEnabled }: { painter: boolean; orbitEnabled: boolean }) {
  const { camera } = useThree()
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null
  const anim = useRef(0)
  const orbitPos = useRef(new THREE.Vector3(3.4, 2.5, 3.8))
  const orbitLook = useRef(new THREE.Vector3(0, 0, 1.3))

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
    const toPos = painter ? new THREE.Vector3(0, 0.05, 5.2) : orbitPos.current
    const toLook = painter ? new THREE.Vector3(0, 0, 1.0) : orbitLook.current
    camera.position.lerp(toPos, k)
    camera.lookAt(toLook)
    if (controls) {
      controls.target.lerp(toLook, k)
      controls.update()
    }
  })

  return <OrbitControls makeDefault enablePan={false} enabled={orbitEnabled} minDistance={2} maxDistance={12} />
}

/** 第四章：一点 / 两点 / 三点透视 */
export default function VanishingPoints({ active }: { active: boolean }) {
  const [tyDeg, setTyDeg] = useState(28)
  const [txDeg, setTxDeg] = useState(0)
  const [painter, setPainter] = useState(false)

  const ty = (tyDeg * Math.PI) / 180
  const tx = (txDeg * Math.PI) / 180

  const { vps } = useBox(ty, tx)
  const parallelCount = vps.filter((v) => v === null).length
  const vpCount = 3 - parallelCount
  const modeLabel = vpCount === 1 ? '一点透视' : vpCount === 2 ? '两点透视' : '三点透视'
  const modeColor = vpCount === 1 ? 'text-brand-cyan' : vpCount === 2 ? 'text-brand-violet' : 'text-brand-amber'

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [3.4, 2.5, 3.8], fov: 55, near: 0.05, far: 40 }}
        gl={{ antialias: true }}
        className="h-full w-full"
      >
        <color attach="background" args={['#0b0b18']} />
        <ambientLight intensity={0.8} />
        <BoxScene thetaY={ty} thetaX={tx} painter={painter} />
        <CanvasPlane size={[3.8, 2.8]} position={[0, 0, 1]} label="画布 z = 1" />
        <CameraRig painter={painter} orbitEnabled={!painter} />
      </Canvas>

      {/* 模式徽章 */}
      <div className="absolute left-3 top-3 flex flex-col gap-1.5">
        <span className={clsx('rounded-lg border border-white/10 bg-ink-950/80 px-3 py-1.5 text-[12px] font-medium backdrop-blur', modeColor)}>
          {modeLabel}
          <span className="ml-2 text-[10px] font-normal text-slate-500">
            {vpCount} 个消失点
          </span>
        </span>
        <button
          onClick={() => setPainter((v) => !v)}
          className={clsx(
            'w-fit rounded-lg border px-3 py-1.5 text-[11px] backdrop-blur transition',
            painter
              ? 'border-brand-amber/50 bg-brand-amber/10 text-brand-amber'
              : 'border-white/10 bg-ink-950/70 text-slate-400 hover:text-slate-200',
          )}
        >
          {painter ? '返回 3D 视角' : '🎨 画家视角（正对画布）'}
        </button>
      </div>

      {/* 角度滑块 */}
      <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-white/10 bg-ink-950/80 px-3 py-2 backdrop-blur">
        <label className="flex items-center gap-2 text-[11px] text-slate-400">
          水平旋转
          <input
            type="range"
            min={0}
            max={65}
            value={tyDeg}
            onChange={(e) => setTyDeg(Number(e.target.value))}
            className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-violet sm:w-32"
          />
          <span className="font-mono text-brand-violet">{tyDeg}°</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-slate-400">
          竖直旋转
          <input
            type="range"
            min={0}
            max={65}
            value={txDeg}
            onChange={(e) => setTxDeg(Number(e.target.value))}
            className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-white/10 accent-brand-amber sm:w-32"
          />
          <span className="font-mono text-brand-amber">{txDeg}°</span>
        </label>
        <span className="ml-auto hidden text-[10px] text-slate-600 md:inline">
          拖动旋转视角 · 滚轮缩放
        </span>
      </div>
    </div>
  )
}
