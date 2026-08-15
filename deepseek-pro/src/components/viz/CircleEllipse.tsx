import { useState } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import { fitOrtho, orthoProject, vec3, type Vec2, type Vec3 } from "@/lib/math3d";
import { dot, drawGrid, label, line, polyline } from "./shared";

const CAM = { yaw: -0.55, pitch: -0.42 };
const D = 3; // circle center depth
const R = 0.9; // circle radius

function sampleCircle(theta: number, cy: number): Vec3[] {
  const N = 100;
  const pts: Vec3[] = [];
  for (let i = 0; i <= N; i++) {
    const phi = (i / N) * Math.PI * 2;
    const x = R * Math.cos(phi);
    const y = cy + R * Math.sin(phi) * Math.cos(theta);
    const z = D - R * Math.sin(phi) * Math.sin(theta);
    pts.push(vec3(x, y, z));
  }
  return pts;
}

export function CircleEllipse() {
  const [theta, setTheta] = useState(0.72);
  const [cy, setCy] = useState(0.35);

  const ref = useCanvas(
    (ctx, w, h) => {
      const splitX = w * 0.52;
      const circle3d = sampleCircle(theta, cy);
      const proj = circle3d.map((p) => [p[0] / p[2], p[1] / p[2]] as const);

      // ---- World view (left) ----------------------------------------------
      const anchors: Vec3[] = [
        vec3(0, 0, 0),
        vec3(-1.6, -1.6, 1),
        vec3(1.6, 1.6, 1),
        vec3(-1.3, cy - 1.3, D - 1.3),
        vec3(1.3, cy + 1.3, D + 1.3),
      ];
      const fit = fitOrtho(anchors, CAM.yaw, CAM.pitch, splitX, h, 0.14);
      const wp = (p: Vec3): Vec2 =>
        orthoProject(p, CAM.yaw, CAM.pitch, fit.scale, fit.cx, fit.cy);

      drawGrid(ctx, splitX, h, 36);

      // canvas plane
      const plane: Vec3[] = [
        vec3(-1.6, -1.6, 1),
        vec3(1.6, -1.6, 1),
        vec3(1.6, 1.6, 1),
        vec3(-1.6, 1.6, 1),
      ];
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

      // rays through a few circle points
      for (let i = 0; i < 8; i++) {
        const p = circle3d[(i * circle3d.length) / 8 | 0];
        const pv = wp(p);
        line(ctx, eyeP[0], eyeP[1], pv[0], pv[1], "rgba(255,255,255,0.08)", 1);
      }

      // the tilted 3-D circle
      polyline(ctx, circle3d.map(wp), palette.secondary, 1.8);

      // the projected ellipse drawn ON the canvas plane (z = 1)
      const onPlane = circle3d.map((p) => wp(vec3(p[0] / p[2], p[1] / p[2], 1)));
      polyline(ctx, onPlane, palette.accent, 2);
      label(ctx, "投影 → 椭圆", onPlane[0][0] + 8, onPlane[0][1] + 8, palette.accent, "left", 11);

      // ---- Projection view (right) ----------------------------------------
      const panel = { x: splitX, w: w - splitX };
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(splitX + 0.5, 0);
      ctx.lineTo(splitX + 0.5, h);
      ctx.stroke();
      ctx.restore();

      // auto-fit the projected ellipse
      let umin = Infinity, umax = -Infinity, vmin = Infinity, vmax = -Infinity;
      for (const [u, v] of proj) {
        umin = Math.min(umin, u);
        umax = Math.max(umax, u);
        vmin = Math.min(vmin, v);
        vmax = Math.max(vmax, v);
      }
      // include reference circle (parallel case) for context
      const refR = R / D;
      umin = Math.min(umin, -refR);
      umax = Math.max(umax, refR);
      vmin = Math.min(vmin, cy / D - refR);
      vmax = Math.max(vmax, cy / D + refR);

      const span = Math.max(umax - umin, vmax - vmin, 0.4);
      const pad = 0.22;
      const scale2 = Math.min(panel.w, h) / (span + pad * 2);
      const cx2 = panel.x + panel.w / 2 - ((umin + umax) / 2) * scale2;
      const cy2 = h / 2 + ((vmin + vmax) / 2) * scale2;
      const m2 = (u: number, v: number): [number, number] => [cx2 + u * scale2, cy2 - v * scale2];

      drawGrid(ctx, panel.w, h, 32);

      // reference circle (θ = 0, parallel to canvas)
      ctx.save();
      ctx.beginPath();
      ctx.arc(m2(0, cy / D)[0], m2(0, cy / D)[1], refR * scale2, 0, Math.PI * 2);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = palette.gridStrong;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
      label(ctx, "若平行于画布 → 正圆", m2(refR, cy / D - refR)[0], m2(refR, cy / D - refR)[1], palette.muted, "left", 10);

      // the projected ellipse
      polyline(ctx, proj.map((p) => m2(p[0], p[1])), palette.accent, 2);

      // centers: projected 3-D center vs. ellipse center
      const projCenter = m2(0, cy / D);
      const eCx = (umin + umax) / 2;
      const eCy = (vmin + vmax) / 2;
      const ellipseCenter = m2(eCx, eCy);
      dot(ctx, projCenter[0], projCenter[1], 3.5, palette.secondary);
      dot(ctx, ellipseCenter[0], ellipseCenter[1], 3.5, palette.accent);
      line(ctx, projCenter[0], projCenter[1], ellipseCenter[0], ellipseCenter[1], palette.warn, 1, [4, 3]);
      label(ctx, "圆心的投影", projCenter[0] + 8, projCenter[1] + 8, palette.secondary, "left", 10);
      label(ctx, "椭圆中心（偏上）", ellipseCenter[0] + 8, ellipseCenter[1] - 8, palette.accent, "left", 10);

      label(ctx, "画布平面 (u, v)", panel.x + 12, 14, palette.text, "left", 12);
    },
    [theta, cy],
    false,
  );

  return (
    <div>
      <div className="relative">
        <canvas ref={ref} className="block h-[380px] w-full sm:h-[460px]" />
      </div>
      <div className="flex flex-col gap-4 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:gap-8">
        <div className="flex flex-1 items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-zinc-400">倾斜角 θ</span>
          <input
            type="range"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
            value={theta}
            min={0}
            max={1.1}
            step={0.01}
            onChange={(e) => setTheta(parseFloat(e.target.value))}
          />
          <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-zinc-300">
            {Math.round((theta * 180) / Math.PI)}°
          </span>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-zinc-400">圆心偏移 y</span>
          <input
            type="range"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
            value={cy}
            min={0}
            max={0.8}
            step={0.01}
            onChange={(e) => setCy(parseFloat(e.target.value))}
          />
          <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-zinc-300">
            {cy.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
