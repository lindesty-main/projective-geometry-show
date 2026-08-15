/**
 * Minimal 3D linear algebra + the perspective-projection primitives that
 * are the *subject matter* of this site. Everything is expressed in the
 * camera convention used by the video:
 *
 *   - The eye is at the origin O = (0, 0, 0).
 *   - The canvas is the plane z = 1.
 *   - A point (x, y, z) projects to canvas coordinates (x/z, y/z).
 */

export type Vec3 = readonly [number, number, number];
export type Vec2 = readonly [number, number];

export const vec3 = (x: number, y: number, z: number): Vec3 => [x, y, z];
export const vec2 = (x: number, y: number): Vec2 => [x, y];

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const neg = (a: Vec3): Vec3 => [-a[0], -a[1], -a[2]];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const len = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export const norm = (a: Vec3): Vec3 => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

/** Rotate about the Y axis. */
export function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c * p[0] + s * p[2], p[1], -s * p[0] + c * p[2]];
}

/** Rotate about the X axis. */
export function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [p[0], c * p[1] - s * p[2], s * p[1] + c * p[2]];
}

/** Rotate about the Z axis. */
export function rotZ(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c * p[0] - s * p[1], s * p[0] + c * p[1], p[2]];
}

/** Compose the cube orientation: first yaw (about Y) then pitch (about X). */
export const orient = (p: Vec3, yaw: number, pitch: number): Vec3 =>
  rotX(rotY(p, yaw), pitch);

/**
 * THE first principle of perspective.
 * Project through the origin onto the plane z = 1.
 * Assumes z > 0; returns [x/z, y/z].
 */
export function project(p: Vec3): Vec2 {
  return [p[0] / p[2], p[1] / p[2]];
}

/**
 * Orthographic "world view" camera used only to *illustrate* the 3-D scene
 * (eye, canvas, objects) before projecting it. Rotates the scene by
 * yaw/pitch, then flattens the first two coordinates.
 */
export function orthoProject(
  p: Vec3,
  yaw: number,
  pitch: number,
  scale: number,
  cx: number,
  cy: number,
): Vec2 {
  const q = orient(p, yaw, pitch);
  return [cx + q[0] * scale, cy - q[1] * scale];
}

/** Camera-space depth (for painter's-algorithm sorting in the world view). */
export function cameraDepth(p: Vec3, yaw: number, pitch: number): number {
  return orient(p, yaw, pitch)[2];
}

export interface Cube {
  center: Vec3;
  half: number;
  yaw: number;
  pitch: number;
}

/** The 8 vertices of an oriented cube. */
export function cubeVertices(c: Cube): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < 8; i++) {
    const x = (i & 1 ? 1 : -1) * c.half;
    const y = (i & 2 ? 1 : -1) * c.half;
    const z = (i & 4 ? 1 : -1) * c.half;
    out.push(add(c.center, orient(vec3(x, y, z), c.yaw, c.pitch)));
  }
  return out;
}

/** The 12 edges of a cube as vertex-index pairs. */
export const CUBE_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [2, 3], [4, 5], [6, 7], // along x
  [0, 2], [1, 3], [4, 6], [5, 7], // along y
  [0, 4], [1, 5], [2, 6], [3, 7], // along z
];

/** Direction of each oriented axis after yaw/pitch (unit vectors). */
export function axisDirections(yaw: number, pitch: number): { x: Vec3; y: Vec3; z: Vec3 } {
  return {
    x: orient(vec3(1, 0, 0), yaw, pitch),
    y: orient(vec3(0, 1, 0), yaw, pitch),
    z: orient(vec3(0, 0, 1), yaw, pitch),
  };
}

/**
 * Vanishing point of a direction vector D = (A, B, C):
 *   (A/C, B/C) when C !== 0, otherwise null (the direction is parallel to
 * the canvas and its lines never meet).
 */
export function vanishingPoint(d: Vec3): Vec2 | null {
  return Math.abs(d[2]) < 1e-6 ? null : [d[0] / d[2], d[1] / d[2]];
}

/** Fit an orthographic view to a set of world-space anchors. */
export function fitOrtho(
  anchors: Vec3[],
  yaw: number,
  pitch: number,
  w: number,
  h: number,
  margin = 0.12,
): { scale: number; cx: number; cy: number } {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const a of anchors) {
    const q = orient(a, yaw, pitch);
    minX = Math.min(minX, q[0]);
    maxX = Math.max(maxX, q[0]);
    minY = Math.min(minY, q[1]);
    maxY = Math.max(maxY, q[1]);
  }
  const spanX = Math.max(maxX - minX, 1e-3);
  const spanY = Math.max(maxY - minY, 1e-3);
  const scale = Math.min((w * (1 - margin)) / spanX, (h * (1 - margin)) / spanY);
  const cx = w / 2 - ((minX + maxX) / 2) * scale;
  const cy = h / 2 + ((minY + maxY) / 2) * scale;
  return { scale, cx, cy };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
