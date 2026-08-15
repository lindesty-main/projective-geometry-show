import { useEffect, useRef } from 'react'

export interface PointerState {
  x: number
  y: number
  inside: boolean
  down: boolean
  moved: boolean
}

export interface Canvas2DProps {
  /** 每帧绘制回调；ctx 已按 devicePixelRatio 缩放 */
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number, ptr: PointerState) => void
  /** 离屏时暂停时间推进与绘制 */
  active?: boolean
  /** 是否启用指针交互（pointermove/down/up） */
  interactive?: boolean
  className?: string
  style?: React.CSSProperties
  onPointerState?: (ptr: PointerState) => void
}

/**
 * 统一的 2D 画布引擎：处理 DPR、resize、rAF 循环、指针状态。
 * 组件只实现 draw()，所有坐标均为 CSS 像素。
 */
export function Canvas2D({ draw, active = true, interactive = true, className, style, onPointerState }: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  const activeRef = useRef(active)
  activeRef.current = active
  const onPtrRef = useRef(onPointerState)
  onPtrRef.current = onPointerState
  const ptrRef = useRef<PointerState>({ x: 0, y: 0, inside: false, down: false, moved: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    let t = 0
    let last = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // 尺寸变化立即重绘一帧
      drawRef.current(ctx, w, h, t, 0, ptrRef.current)
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!activeRef.current) return
      t += dt
      drawRef.current(ctx, w, h, t, dt, ptrRef.current)
    }

    resize()
    raf = requestAnimationFrame(frame)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      ptrRef.current.x = e.clientX - rect.left
      ptrRef.current.y = e.clientY - rect.top
    }
    const onDown = (e: PointerEvent) => {
      if (!interactive) return
      toLocal(e)
      ptrRef.current.down = true
      ptrRef.current.moved = false
      canvas.setPointerCapture?.(e.pointerId)
      onPtrRef.current?.(ptrRef.current)
    }
    const onMove = (e: PointerEvent) => {
      if (!interactive) return
      const prev = { ...ptrRef.current }
      toLocal(e)
      ptrRef.current.inside = true
      if (ptrRef.current.down && (Math.abs(ptrRef.current.x - prev.x) > 2 || Math.abs(ptrRef.current.y - prev.y) > 2)) {
        ptrRef.current.moved = true
      }
      onPtrRef.current?.(ptrRef.current)
    }
    const onUp = (e: PointerEvent) => {
      if (!interactive) return
      toLocal(e)
      ptrRef.current.down = false
      onPtrRef.current?.(ptrRef.current)
    }
    const onLeave = () => {
      ptrRef.current.inside = false
      ptrRef.current.down = false
      onPtrRef.current?.(ptrRef.current)
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [interactive])

  return <canvas ref={canvasRef} className={className} style={style} />
}
