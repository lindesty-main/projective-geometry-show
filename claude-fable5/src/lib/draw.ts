import { palette, FONT_SM } from './palette'
import type { Vec2 } from './projection'

/**
 * 画布视口：以 (cx, cy) 为原点、等比缩放、y 轴向上的数学坐标系。
 */
export type Viewport = {
  toPx: (p: Vec2) => Vec2
  scale: number
  cx: number
  cy: number
}

export function makeViewport(
  width: number,
  height: number,
  opts: { scale?: number; cx?: number; cy?: number } = {},
): Viewport {
  const scale = opts.scale ?? Math.min(width, height) * 0.4
  const cx = opts.cx ?? width / 2
  const cy = opts.cy ?? height / 2
  return {
    scale,
    cx,
    cy,
    toPx: (p: Vec2) => [cx + p[0] * scale, cy - p[1] * scale],
  }
}

export function clear(ctx: CanvasRenderingContext2D, width: number, height: number, color = palette.surface) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}

export function line(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  a: Vec2,
  b: Vec2,
  color: string,
  lineWidth = 2,
  dash: number[] = [],
) {
  const [ax, ay] = vp.toPx(a)
  const [bx, by] = vp.toPx(b)
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.setLineDash(dash)
  ctx.beginPath()
  ctx.moveTo(ax, ay)
  ctx.lineTo(bx, by)
  ctx.stroke()
  ctx.restore()
}

export function polyline(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  points: Vec2[],
  color: string,
  lineWidth = 2,
  opts: { close?: boolean; dash?: number[] } = {},
) {
  if (points.length < 2) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineJoin = 'round'
  ctx.setLineDash(opts.dash ?? [])
  ctx.beginPath()
  const [x0, y0] = vp.toPx(points[0])
  ctx.moveTo(x0, y0)
  for (let i = 1; i < points.length; i++) {
    const [x, y] = vp.toPx(points[i])
    ctx.lineTo(x, y)
  }
  if (opts.close) ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

export function dot(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  p: Vec2,
  color: string,
  r = 4,
  ring = true,
) {
  const [x, y] = vp.toPx(p)
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  if (ring) {
    // 2px surface ring：重叠标记之间的隔离环
    ctx.strokeStyle = palette.surface
    ctx.lineWidth = 2
    ctx.stroke()
  }
  ctx.restore()
}

export function label(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  p: Vec2,
  text: string,
  opts: { dx?: number; dy?: number; color?: string; align?: CanvasTextAlign; font?: string } = {},
) {
  const [x, y] = vp.toPx(p)
  ctx.save()
  ctx.font = opts.font ?? FONT_SM
  ctx.fillStyle = opts.color ?? palette.ink2
  ctx.textAlign = opts.align ?? 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + (opts.dx ?? 8), y + (opts.dy ?? 0))
  ctx.restore()
}

/** 数学坐标轴（画布中心系），保持低调 */
export function axes(ctx: CanvasRenderingContext2D, vp: Viewport, width: number, height: number) {
  ctx.save()
  ctx.strokeStyle = palette.axis
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, vp.cy)
  ctx.lineTo(width, vp.cy)
  ctx.moveTo(vp.cx, 0)
  ctx.lineTo(vp.cx, height)
  ctx.stroke()
  ctx.restore()
}
