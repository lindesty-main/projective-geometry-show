import { useEffect, useRef } from "react";

export type CanvasDraw = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) => void;

/**
 * A reusable canvas that handles device-pixel-ratio scaling, responsive
 * resizing (ResizeObserver) and an optional requestAnimationFrame loop.
 *
 * @param draw   render callback (already in CSS pixel coordinates)
 * @param deps   values the draw closure depends on (re-subscribe on change)
 * @param animate whether to keep re-rendering every frame
 */
export function useCanvas(
  draw: CanvasDraw,
  deps: readonly unknown[] = [],
  animate = false,
) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // Keep the latest draw closure without restarting the rAF loop on every dep change.
  const drawRef = useRef(draw);
  drawRef.current = draw;

  const animateRef = useRef(animate);
  animateRef.current = animate;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = (t: number) => {
      if (disposed) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, t);
      if (animateRef.current) raf = requestAnimationFrame(render);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (clientWidth === 0 || clientHeight === 0) return;
      canvas.width = Math.round(clientWidth * dpr);
      canvas.height = Math.round(clientHeight * dpr);
      // Re-render static canvases so they stay crisp after a resize.
      if (!animateRef.current) requestAnimationFrame(() => render(performance.now()));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (animateRef.current) {
      raf = requestAnimationFrame(render);
    } else {
      render(performance.now());
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, deps);

  return ref;
}
