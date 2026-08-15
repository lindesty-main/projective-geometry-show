import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import { fitOrtho, orthoProject, vec3, type Vec2, type Vec3 } from "@/lib/math3d";
import { dot, drawGrid, label, line, polyline } from "./shared";

const TMAX = 26; // max depth sampled (z)
const PERIOD = 12000; // ms per full traversal of depth

/** Two 3-D sine curves at x = ±1: (x, sin t, t), and their canvas projections. */
function sampleCurves() {
  const N = 240;
  const a: Vec3[] = [];
  const b: Vec3[] = [];
  const pa: [number, number][] = [];
  const pb: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = 1 + ((TMAX - 1) * i) / N;
    const y = Math.sin(t);
    a.push(vec3(1, y, t));
    b.push(vec3(-1, y, t));
    pa.push([1 / t, y / t]);
    pb.push([-1 / t, y / t]);
  }
  return { a, b, pa, pb };
}

export function SinusoidProjection() {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const progressRef = useRef(0);
  const lastRef = useRef<number | null>(null);

  const ref = useCanvas((ctx, w, h, time) => {
    if (lastRef.current == null) lastRef.current = time;
    const dt = time - lastRef.current;
    lastRef.current = time;
    if (!pausedRef.current) progressRef.current = (progressRef.current + dt / PERIOD) % 1;

    // Smooth so the point lingers near the origin (large depth).
    const f = progressRef.current;
    const frac = f * f * (3 - 2 * f);
    const t = 1 + (TMAX - 1) * frac;
    const y = Math.sin(t);

    const splitY = h * 0.5;
    const { a, b, pa, pb } = sampleCurves();

    // ---- World view (top panel) -------------------------------------------
    const cam = { yaw: -0.62, pitch: -0.5 };
    const anchors: Vec3[] = [
      vec3(0, 0, 0),
      vec3(-1.15, -1.15, 1),
      vec3(1.15, 1.15, 1),
      vec3(-1, -1, TMAX),
      vec3(1, 1, TMAX),
    ];
    const fit = fitOrtho(anchors, cam.yaw, cam.pitch, w, splitY, 0.18);
    const wp = (p: Vec3): Vec2 =>
      orthoProject(p, cam.yaw, cam.pitch, fit.scale, fit.cx, fit.cy);

    drawGrid(ctx, w, splitY, 36);

    // Canvas plane at z = 1
    const plane: Vec3[] = [
      vec3(-1.15, -1.15, 1),
      vec3(1.15, -1.15, 1),
      vec3(1.15, 1.15, 1),
      vec3(-1.15, 1.15, 1),
    ];
    const planePts = plane.map(wp);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(planePts[0][0], planePts[0][1]);
    for (let i = 1; i < 4; i++) ctx.lineTo(planePts[i][0], planePts[i][1]);
    ctx.closePath();
    ctx.fillStyle = "rgba(129, 140, 248, 0.07)";
    ctx.fill();
    ctx.strokeStyle = palette.primarySoft;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    label(ctx, "画布 z = 1", planePts[2][0] + 6, planePts[2][1] + 6, palette.primary, "left", 11);

    // Eye
    const eye = vec3(0, 0, 0);
    const eyeP = wp(eye);
    dot(ctx, eyeP[0], eyeP[1], 4.5, palette.warn);
    label(ctx, "眼 O", eyeP[0] + 9, eyeP[1], palette.warn, "left", 11);

    // The two 3-D curves
    polyline(ctx, a.map(wp), palette.accent, 1.6);
    polyline(ctx, b.map(wp), palette.secondary, 1.6);
    label(ctx, "x = +1", wp(vec3(1, 1.3, TMAX))[0] + 6, wp(vec3(1, 1.3, TMAX))[1], palette.accent, "left", 11);
    label(ctx, "x = −1", wp(vec3(-1, -1.3, TMAX))[0] + 6, wp(vec3(-1, -1.3, TMAX))[1], palette.secondary, "left", 11);

    // Moving points + rays through the eye
    const p3dA = vec3(1, y, t);
    const p3dB = vec3(-1, y, t);
    for (const [p3d, col, colSoft] of [
      [p3dA, palette.accent, palette.accentSoft],
      [p3dB, palette.secondary, palette.secondarySoft],
    ] as const) {
      const pp = wp(p3d);
      line(ctx, eyeP[0], eyeP[1], pp[0], pp[1], colSoft, 1, [4, 4]);
      dot(ctx, pp[0], pp[1], 4, col);
      // intersection with z = 1 plane (the projected point)
      const proj3 = vec3(p3d[0] / p3d[2], p3d[1] / p3d[2], 1);
      const pq = wp(proj3);
      ringOnPlane(ctx, pq[0], pq[1], col);
    }

    // ---- Projection (bottom panel) ----------------------------------------
    const bottom = { x: 0, y: splitY, w, h: h - splitY };
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, splitY + 0.5);
    ctx.lineTo(w, splitY + 0.5);
    ctx.stroke();
    ctx.restore();

    const r = 1.35; // visible range ±r
    const scale2 = Math.min(bottom.w, bottom.h) / (2 * r) - 8;
    const cx2 = bottom.x + bottom.w / 2;
    const cy2 = bottom.y + bottom.h / 2;
    const m2 = (u: number, v: number): [number, number] => [cx2 + u * scale2, cy2 - v * scale2];

    drawGrid(ctx, w, bottom.h, 32);

    // axes
    line(ctx, bottom.x, cy2, bottom.x + bottom.w, cy2, palette.axis, 1);
    line(ctx, cx2, bottom.y, cx2, bottom.y + bottom.h, palette.axis, 1);
    label(ctx, "u", bottom.x + bottom.w - 12, cy2 + 14, palette.muted, "right", 11);
    label(ctx, "v", cx2 + 10, bottom.y + 12, palette.muted, "left", 11);
    label(ctx, "y = x·sin(1/x)", cx2 + 10, cy2 - 10, palette.text, "left", 12);

    // amplitude envelope y = ±x
    line(ctx, m2(-1, -1)[0], m2(-1, -1)[1], m2(0, 0)[0], m2(0, 0)[1], palette.gridStrong, 1, [5, 5]);
    line(ctx, m2(1, 1)[0], m2(1, 1)[1], m2(0, 0)[0], m2(0, 0)[1], palette.gridStrong, 1, [5, 5]);
    line(ctx, m2(-1, 1)[0], m2(-1, 1)[1], m2(0, 0)[0], m2(0, 0)[1], palette.gridStrong, 1, [5, 5]);
    line(ctx, m2(1, -1)[0], m2(1, -1)[1], m2(0, 0)[0], m2(0, 0)[1], palette.gridStrong, 1, [5, 5]);

    // the projected curves (both branches)
    polyline(ctx, pa.map((p) => m2(p[0], p[1])), palette.accent, 1.7);
    polyline(ctx, pb.map((p) => m2(p[0], p[1])), palette.secondary, 1.7);

    // moving projected points
    const qa = m2(1 / t, y / t);
    const qb = m2(-1 / t, y / t);
    dot(ctx, qa[0], qa[1], 4, palette.accent);
    dot(ctx, qb[0], qb[1], 4, palette.secondary);

    // readout
    ctx.save();
    ctx.fillStyle = "rgba(9,9,11,0.75)";
    const rw = 150;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(bottom.x + bottom.w - rw - 12, bottom.y + 10, rw, 40, 8);
    } else {
      ctx.rect(bottom.x + bottom.w - rw - 12, bottom.y + 10, rw, 40);
    }
    ctx.fill();
    ctx.restore();
    label(ctx, `深度 z = ${t.toFixed(2)}`, bottom.x + bottom.w - rw, bottom.y + 24, palette.text, "left", 11);
    label(ctx, `u = ±${(1 / t).toFixed(3)}`, bottom.x + bottom.w - rw, bottom.y + 40, palette.muted, "left", 11);
  }, [], true);

  return (
    <div className="relative">
      <canvas ref={ref} className="block h-[400px] w-full sm:h-[520px]" />
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/80 text-zinc-300 backdrop-blur transition hover:bg-zinc-800"
        aria-label={paused ? "播放" : "暂停"}
      >
        {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
      </button>
    </div>
  );
}

function ringOnPlane(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
