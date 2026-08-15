/**
 * 通用数学工具
 */

export const TAU = Math.PI * 2

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** 平滑缓动 s(0)=0, s(1)=1 */
export function smoothstep(t: number): number {
  const x = clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

/** 循环进度 p ∈ [0,1)，带 2s 停顿的缓动循环 */
export function loopPulse(t: number, period: number, hold = 0.25): number {
  const cycle = period * (1 + hold)
  const p = (t % cycle) / cycle
  const active = p / (1 + hold)
  return smoothstep(active)
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

/** 中心投影：把三维点投影到 z=1 画布 */
export function project(p: Vec3): { u: number; v: number } {
  return { u: p.x / p.z, v: p.y / p.z }
}

/** 计算消失点：方向向量 (a,b,c) 的消失点 (a/c, b/c)；c≈0 时返回 null */
export function vanishingPoint(d: Vec3, eps = 1e-4): { u: number; v: number } | null {
  if (Math.abs(d.z) < eps) return null
  return { u: d.x / d.z, v: d.y / d.z }
}

/** 一维数组到 [x,y,z] 的排列（给 three.js） */
export function toVec3(pts: Vec3[]): number[] {
  const out = new Array<number>(pts.length * 3)
  for (let i = 0; i < pts.length; i++) {
    out[i * 3] = pts[i].x
    out[i * 3 + 1] = pts[i].y
    out[i * 3 + 2] = pts[i].z
  }
  return out
}

/** 在三维空间采样曲线 f(t)，t 从 t0 到 t1，n 个点 */
export function sampleCurve(
  f: (t: number) => Vec3,
  t0: number,
  t1: number,
  n: number,
): Vec3[] {
  const pts: Vec3[] = []
  for (let i = 0; i < n; i++) {
    const t = t0 + ((t1 - t0) * i) / (n - 1)
    pts.push(f(t))
  }
  return pts
}

/** 两个方向向量旋转（先绕 Y 再绕 X），用于 1/2/3 点透视演示 */
export function rotateBasis(e: Vec3, thetaY: number, thetaX: number): Vec3 {
  const cy = Math.cos(thetaY)
  const sy = Math.sin(thetaY)
  const cx = Math.cos(thetaX)
  const sx = Math.sin(thetaX)
  // Ry
  const x1 = e.x * cy + e.z * sy
  const z1 = -e.x * sy + e.z * cy
  const y1 = e.y
  // Rx
  const y2 = y1 * cx - z1 * sx
  const z2 = y1 * sx + z1 * cx
  return { x: x1, y: y2, z: z2 }
}

/** 0~1 之间的最简分数（用于有理数森林标注） */
export function simplestFractions(maxDen: number): { num: number; den: number }[] {
  const out: { num: number; den: number }[] = []
  for (let den = 2; den <= maxDen; den++) {
    for (let num = 1; num < den; num++) {
      if (gcd(num, den) === 1) out.push({ num, den })
    }
  }
  return out
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function fmt(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return '—'
  const abs = Math.abs(v)
  if (abs !== 0 && (abs >= 1e5 || abs < 1e-3)) return v.toExponential(digits)
  return v.toFixed(digits)
}
