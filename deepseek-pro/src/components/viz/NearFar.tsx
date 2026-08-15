import { useState } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import { fitOrtho, orthoProject, vec3, type Vec2, type Vec3 } from "@/lib/math3d";
import { dot, drawGrid, label, line, polyline } from "./shared";

const DEPTHS = [2, 3, 4, 6, 9];
const CAM = { yaw: -0.5, pitch: -0.32 };

function squareAt(z: number): Vec3[] {
  return [
    vec3(-0.5, -0.5, z),
    vec3(0.5, -0.5, z),
    vec3(0.5, 0.5, z),
    vec3(-0.5, 0.5, z),
  ];
}

export function NearFar() {
  const [u, setU] = useState(0.1);

  const ref = useCanvas(
    (ctx, w, h) => {
      const splitX = w * 0.52;
      const anchors: Vec3[] = [
        vec3(0, 0, 0),
        vec3(-1.5, -1.5, 1),
        vec3(1.5, 1.5, 1),
        vec3(-0.6, -0.6, 9),
        vec3(0.6, 0.6, 9),
      ];
      const fit = fitOrtho(anchors, CAM.yaw, CAM.pitch, splitX, h, 0.16);
      const wp = (p: Vec3): Vec2 =>
        orthoProject(p, CAM.yaw, CAM.pitch, fit.scale, fit.cx, fit.cy);

      drawGrid(ctx, splitX, h, 36);

      // canvas plane
      const plane = squareAt(1).map((p) => vec3(p[0] * 1.5, p[1] * 1.5, p[2]));
      const pp = plane.map(wp);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pp[0][0], pp[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(pp[i][0], pp[i][1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(129, 140, 248, 0.06)";
      ctx.fill();
      ctx.strokeStyle = palette.primarySoft;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
      label(ctx, "画布 z=1", pp[2][0] + 6, pp[2][1] + 6, palette.primary, "left", 11);

      const eyeP = wp(vec3(0, 0, 0));
      dot(ctx, eyeP[0], eyeP[1], 4.5, palette.warn);
      label(ctx, "眼 O", eyeP[0] + 9, eyeP[1], palette.warn, "left", 11);

      // the five equal squares in 3-D (all the SAME size here)
      DEPTHS.forEach((z, idx) => {
        const pts = squareAt(z).map(wp);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.fillStyle = `rgba(52, 211, 153, ${0.05 + idx * 0.02})`;
        ctx.fill();
        ctx.strokeStyle = "rgba(52, 211, 153, 0.55)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });

      // the ray through canvas point (u, 0) -> line { λ·(u, 0, 1) }
      const far = vec3(u * 9.6, 0, 9.6);
      line(ctx, eyeP[0], eyeP[1], wp(far)[0], wp(far)[1], palette.accentSoft, 1.4, [6, 5]);
      for (const z of DEPTHS) {
        const p = wp(vec3(u * z, 0, z));
        dot(ctx, p[0], p[1], 3, palette.accent);
      }
      const hit = wp(vec3(u, 0, 1));
      ring(ctx, hit[0], hit[1], palette.accent, 6);
      label(ctx, `(u,0)`, hit[0] + 10, hit[1] - 10, palette.accent, "left", 11);

      // ---- projection view -------------------------------------------------
      const panel = { x: splitX, w: w - splitX };
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(splitX + 0.5, 0);
      ctx.lineTo(splitX + 0.5, h);
      ctx.stroke();
      ctx.restore();

      const r = 0.42;
      const scale2 = Math.min(panel.w, h) / (2 * r) - 6;
      const cx2 = panel.x + panel.w / 2;
      const cy2 = h / 2;
      const m2 = (px: number, py: number): [number, number] => [cx2 + px * scale2, cy2 - py * scale2];

      drawGrid(ctx, panel.w, h, 32);
      line(ctx, panel.x, cy2, w, cy2, palette.axis, 1);
      line(ctx, cx2, 0, cx2, h, palette.axis, 1);
      label(ctx, "画布平面 (u, v)", panel.x + 12, 14, palette.text, "left", 12);

      // nested squares: side 1/z
      DEPTHS.forEach((z) => {
        const s = 1 / z / 2;
        const pts: [number, number][] = [
          m2(-s, -s),
          m2(s, -s),
          m2(s, s),
          m2(-s, s),
        ];
        polyline(ctx, [...pts, pts[0]], "rgba(52, 211, 153, 0.7)", 1.3);
        label(ctx, `1/${z}`, m2(s, -s)[0] + 5, m2(s, -s)[1], palette.muted, "left", 10);
      });

      // the single canvas point they ALL collapse to
      const q = m2(u, 0);
      dot(ctx, q[0], q[1], 4, palette.accent);
      line(ctx, q[0], m2(0, -0.34)[1], q[0], m2(0, 0.34)[1], palette.accentSoft, 1, [4, 4]);
      label(ctx, `同一点 ← 整条射线`, q[0] + 10, q[1] - 12, palette.accent, "left", 11);
    },
    [u],
    false,
  );

  return (
    <div>
      <div className="relative">
        <canvas ref={ref} className="block h-[360px] w-full sm:h-[440px]" />
      </div>
      <div className="flex items-center gap-4 border-t border-white/[0.06] px-5 py-4">
        <span className="w-24 shrink-0 text-xs text-zinc-400">射线偏移 u</span>
        <input
          type="range"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-pink-400"
          value={u}
          min={0}
          max={0.22}
          step={0.005}
          onChange={(e) => setU(parseFloat(e.target.value))}
        />
        <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-zinc-300">
          {u.toFixed(3)}
        </span>
      </div>
    </div>
  );
}

function ring(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r: number) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
