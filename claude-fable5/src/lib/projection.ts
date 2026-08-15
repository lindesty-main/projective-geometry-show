/**
 * 透视投影的核心数学工具。
 *
 * 万能公式：眼睛在原点，画布在 z = 1，空间点 (x, y, z) 投影为 (x/z, y/z)。
 */

export type Vec3 = readonly [number, number, number]
export type Vec2 = readonly [number, number]

/** 透视投影：三维点 → 画布 (z=1) 上的二维点 */
export function project(p: Vec3): Vec2 {
  return [p[0] / p[2], p[1] / p[2]]
}

export function rotateX(theta: number) {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return (p: Vec3): Vec3 => [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]
}

export function rotateY(theta: number) {
  const c = Math.cos(theta)
  const s = Math.sin(theta)
  return (p: Vec3): Vec3 => [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]
}

export function translate(d: Vec3) {
  return (p: Vec3): Vec3 => [p[0] + d[0], p[1] + d[1], p[2] + d[2]]
}

export function scale(k: number) {
  return (p: Vec3): Vec3 => [p[0] * k, p[1] * k, p[2] * k]
}

export function compose(...fns: Array<(p: Vec3) => Vec3>) {
  return (p: Vec3): Vec3 => fns.reduce((acc, fn) => fn(acc), p)
}

/** 单位立方体的 8 个顶点 (±1, ±1, ±1) */
export const CUBE_VERTICES: Vec3[] = []
for (const x of [-1, 1]) {
  for (const y of [-1, 1]) {
    for (const z of [-1, 1]) {
      CUBE_VERTICES.push([x, y, z])
    }
  }
}

export type CubeEdge = { a: number; b: number; axis: 0 | 1 | 2 }

/** 立方体 12 条棱，按方向分为三组（axis = 沿哪个坐标轴） */
export const CUBE_EDGES: CubeEdge[] = (() => {
  const edges: CubeEdge[] = []
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const a = CUBE_VERTICES[i]
      const b = CUBE_VERTICES[j]
      const diff = [a[0] !== b[0], a[1] !== b[1], a[2] !== b[2]]
      const count = diff.filter(Boolean).length
      if (count === 1) {
        edges.push({ a: i, b: j, axis: diff.indexOf(true) as 0 | 1 | 2 })
      }
    }
  }
  return edges
})()

/** 方向向量 (a, b, c) 的消失点：c ≠ 0 时为 (a/c, b/c)，否则无（平行于画布） */
export function vanishingPoint(dir: Vec3, eps = 1e-4): Vec2 | null {
  if (Math.abs(dir[2]) < eps) return null
  return [dir[0] / dir[2], dir[1] / dir[2]]
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}
