import { useEffect, useRef } from 'react'

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  frame: { width: number; height: number; t: number },
) => void

/**
 * 画布渲染 hook：
 * - 自动处理 devicePixelRatio 与容器尺寸变化
 * - 仅当画布可见时运行 rAF 循环（IntersectionObserver）
 * - draw 函数存于 ref，状态变化无需重新订阅
 */
export function useCanvas(draw: DrawFn) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let visible = false
    let width = 0
    let height = 0
    const start = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const loop = (now: number) => {
      if (!visible) return
      drawRef.current(ctx, { width, height, t: (now - start) / 1000 })
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!visible) {
        // 不可见时也画一帧，避免出现空白
        drawRef.current(ctx, { width, height, t: (performance.now() - start) / 1000 })
      }
    })
    ro.observe(canvas)

    const io = new IntersectionObserver(
      (entries) => {
        const nowVisible = entries[0]?.isIntersecting ?? false
        if (nowVisible && !visible) {
          visible = true
          raf = requestAnimationFrame(loop)
        } else if (!nowVisible) {
          visible = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '80px' },
    )
    io.observe(canvas)

    resize()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return canvasRef
}
