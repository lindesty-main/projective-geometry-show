import { useMemo } from 'react'
import { Html, Line as DreiLine } from '@react-three/drei'
import * as THREE from 'three'

/** 在 z=1 画布上绘制带 u/v 坐标网格的平面 */
export function CanvasPlane({
  size = [3.8, 2.8],
  position = [0, 0, 1],
  label = '画布 z = 1',
}: {
  size?: [number, number]
  position?: [number, number, number]
  label?: string
}) {
  const texture = useMemo(() => {
    const W = 1024
    const H = 768
    const cv = document.createElement('canvas')
    cv.width = W
    cv.height = H
    const ctx = cv.getContext('2d')!
    ctx.clearRect(0, 0, W, H)

    // 网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.13)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 16; i++) {
      ctx.beginPath()
      ctx.moveTo((i / 16) * W, 0)
      ctx.lineTo((i / 16) * W, H)
      ctx.stroke()
    }
    for (let j = 0; j <= 12; j++) {
      ctx.beginPath()
      ctx.moveTo(0, (j / 12) * H)
      ctx.lineTo(W, (j / 12) * H)
      ctx.stroke()
    }

    // 坐标轴
    const cx = W / 2
    const cy = H / 2
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.55)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(W, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, H)
    ctx.stroke()

    // 刻度
    ctx.fillStyle = 'rgba(203, 213, 225, 0.6)'
    ctx.font = '26px sans-serif'
    ctx.textAlign = 'center'
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue
      ctx.fillText(String(i), cx + (i / 4) * (W / 2), cy + 26)
    }
    for (let j = 1; j <= 3; j++) {
      ctx.fillText(String(j / 4), cx + 40, cy - (j / 4) * (H / 2) + 8)
    }

    ctx.fillStyle = 'rgba(34, 211, 238, 0.85)'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('u', W - 40, cy + 56)
    ctx.fillText('v', cx + 44, 36)

    const tex = new THREE.CanvasTexture(cv)
    tex.anisotropy = 4
    tex.needsUpdate = true
    return tex
  }, [])

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Html center distanceFactor={9} style={{ pointerEvents: 'none', color: 'rgba(148,163,184,0.85)', fontSize: 11 }}>
        {label}
      </Html>
    </group>
  )
}

/** 眼睛（原点）标记 */
export function Eye({ label = '眼睛（原点）' }: { label?: string }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.05, 20, 20]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>
      <Html center distanceFactor={9} style={{ pointerEvents: 'none', color: '#fbbf24', fontSize: 11 }}>
        {label}
      </Html>
    </group>
  )
}

/** 三维空间中的线段（基于 drei Line2） */
export function Line({
  points,
  color = '#22d3ee',
  lineWidth = 1.6,
  dashed = false,
  opacity = 1,
  dashSize = 0.04,
  gapSize = 0.03,
}: {
  points: [number, number, number][] | number[]
  color?: string
  lineWidth?: number
  dashed?: boolean
  opacity?: number
  dashSize?: number
  gapSize?: number
}) {
  const flat = useMemo(() => {
    if (typeof points[0] === 'number') return points as number[]
    return (points as [number, number, number][]).flat()
  }, [points])
  return (
    <DreiLine
      points={flat}
      color={color}
      lineWidth={lineWidth}
      transparent={opacity < 1}
      opacity={opacity}
      dashed={dashed}
      dashSize={dashSize}
      gapSize={gapSize}
    />
  )
}

/** 发光的圆点 */
export function Dot({
  position,
  color = '#22d3ee',
  radius = 0.05,
}: {
  position: [number, number, number]
  color?: string
  radius?: number
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 20, 20]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}
