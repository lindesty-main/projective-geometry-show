import { useRef, useState } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import {
  CUBE_EDGES,
  axisDirections,
  cameraDepth,
  clamp,
  cubeVertices,
  fitOrtho,
  orthoProject,
  project,
  vanishingPoint,
  vec3,
  type Cube,
  type Vec2,
  type Vec3,
} from "@/lib/math3d";
import { dot, drawGrid, label, line } from "./shared";

type Mode = "formula" | "vanishing";

const CUBE: Omit<Cube, "yaw" | "pitch"> = { center: vec3(0, 0, 3), half: 0.85 };
const CAM = { yaw: -0.55, pitch: -0.42 };

const PRESETS: Record<string, { yaw: number; pitch: number; label: string }> = {
  one: { yaw: 0, pitch: 0, label: "一点透视" },
  two: { yaw: 0.55, pitch: 0, label: "两点透视" },
  three: { yaw: 0.5, pitch: 0.38, label: "三点透视" },
};

export function ProjectionCube() {
  const [mode, setMode] = useState<Mode>("formula");
  const [yaw, setYaw] = useState(0.42);
  const [pitch, setPitch] = useState(0.28);
  const drag = useRef<{ x: number; y: number } | null>(null);

  const ref = useCanvas(
    (ctx, w, h) => {
      const splitX = w * 0.52;
      const cube: Cube = { ...CUBE, yaw, pitch };
      const verts = cubeVertices(cube);

      // ---- World view (left) ---------------------------------------------
      const anchors: Vec3[] = [
        vec3(0, 0, 0),
        vec3(-1.5, -1.5, 1),
        vec3(1.5, 1.5, 1),
        vec3(0, 0, 3),
        vec3(-1.7, -1.7, 3),
        vec3(1.7, 1.7, 3),
      ];
      const fit = fitOrtho(anchors, CAM.yaw, CAM.pitch, splitX, h, 0.16);
      const wp = (p: Vec3): Vec2 =>
        orthoProject(p, CAM.yaw, CAM.pitch, fit.scale, fit.cx, fit.cy);

      drawGrid(ctx, splitX, h, 36);

      // canvas plane at z = 1
      const plane: Vec3[] = [
        vec3(-1.5, -1.5, 1),
        vec3(1.5, -1.5, 1),
        vec3(1.5, 1.5, 1),
        vec3(-1.5, 1.5, 1),
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

      if (mode === "formula") {
        // rays from eye through each vertex to the canvas plane
        for (const v of verts) {
          const proj3 = vec3(v[0] / v[2], v[1] / v[2], 1);
          const pq = wp(proj3);
          const pv = wp(v);
          line(ctx, eyeP[0], eyeP[1], pv[0], pv[1], "rgba(255,255,255,0.10)", 1);
          dot(ctx, pq[0], pq[1], 3, palette.accent);
        }
      }

      // cube wireframe with painter's-algorithm sorting
      const edges = CUBE_EDGES
        .map(([i, j]) => ({
          a: verts[i],
          b: verts[j],
          depth: (cameraDepth(verts[i], CAM.yaw, CAM.pitch) + cameraDepth(verts[j], CAM.yaw, CAM.pitch)) / 2,
        }))
        .sort((p, q) => p.depth - q.depth);
      for (const e of edges) {
        const a = wp(e.a);
        const b = wp(e.b);
        line(ctx, a[0], a[1], b[0], b[1], "rgba(226, 232, 240, 0.65)", 1.4);
      }
      for (const v of verts) {
        const p = wp(v);
        dot(ctx, p[0], p[1], 2.6, palette.text);
      }

      // ---- Projection view (right) ----------------------------------------
      const panel = { x: splitX, w: w - splitX };
      const r = mode === "formula" ? 0.85 : 2.6;
      const scale2 = Math.min(panel.w, h) / (2 * r) - 6;
      const cx2 = panel.x + panel.w / 2;
      const cy2 = h / 2;
      const m2 = (u: number, v: number): [number, number] => [cx2 + u * scale2, cy2 - v * scale2];

      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(splitX + 0.5, 0);
      ctx.lineTo(splitX + 0.5, h);
      ctx.stroke();
      ctx.restore();

      drawGrid(ctx, panel.w, h, 32);
      line(ctx, panel.x, cy2, w, cy2, palette.axis, 1);
      line(ctx, cx2, 0, cx2, h, palette.axis, 1);
      label(ctx, "u", w - 12, cy2 + 14, palette.muted, "right", 11);
      label(ctx, "v", cx2 + 10, 12, palette.muted, "left", 11);

      const proj = verts.map(project);

      if (mode === "vanishing") {
        const dirs = axisDirections(yaw, pitch);
        const axisList: { key: "x" | "y" | "z"; d: Vec3; color: string }[] = [
          { key: "x", d: dirs.x, color: palette.secondary },
          { key: "y", d: dirs.y, color: palette.accent },
          { key: "z", d: dirs.z, color: palette.warn },
        ];
        // clip to the right panel
        ctx.save();
        ctx.beginPath();
        ctx.rect(panel.x, 0, panel.w, h);
        ctx.clip();

        for (const { key, d, color } of axisList) {
          const vp = vanishingPoint(d);
          // the 4 cube edges parallel to this axis
          const edgeIdx =
            key === "x" ? [0, 1, 2, 3] : key === "y" ? [4, 5, 6, 7] : [8, 9, 10, 11];
          for (const k of edgeIdx) {
            const [i, j] = CUBE_EDGES[k];
            const p1 = m2(proj[i][0], proj[i][1]);
            const p2 = m2(proj[j][0], proj[j][1]);
            const dx = p2[0] - p1[0];
            const dy = p2[1] - p1[1];
            const len = Math.hypot(dx, dy) || 1;
            const L = Math.hypot(panel.w, h);
            const ux = dx / len;
            const uy = dy / len;
            const midx = (p1[0] + p2[0]) / 2;
            const midy = (p1[1] + p2[1]) / 2;
            line(
              ctx,
              midx - ux * L,
              midy - uy * L,
              midx + ux * L,
              midy + uy * L,
              color + "55",
              1,
              [5, 4],
            );
          }
          if (vp) {
            const q = m2(vp[0], vp[1]);
            dot(ctx, q[0], q[1], 5, color);
            label(ctx, `VP·${key}`, q[0] + 8, q[1] - 8, color, "left", 11);
          }
        }
        ctx.restore();
      }

      // projected cube wireframe
      for (const [i, j] of CUBE_EDGES) {
        const a = m2(proj[i][0], proj[i][1]);
        const b = m2(proj[j][0], proj[j][1]);
        line(ctx, a[0], a[1], b[0], b[1], "rgba(226, 232, 240, 0.8)", 1.6);
      }
      if (mode === "formula") {
        proj.forEach((p, i) => {
          const q = m2(p[0], p[1]);
          dot(ctx, q[0], q[1], 3, palette.accent);
          if (i < 4) label(ctx, `P${i + 1}`, q[0] + 7, q[1] - 7, palette.muted, "left", 10);
        });
      }

      label(ctx, mode === "formula" ? "投影 (u,v) = (x/z, y/z)" : "消失点 (A/C, B/C)", panel.x + 12, 14, palette.text, "left", 12);
    },
    [mode, yaw, pitch],
    false,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {(
            [
              ["formula", "投影公式"],
              ["vanishing", "消失点"],
            ] as const
          ).map(([key, labelText]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors " +
                (mode === key ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-200")
              }
            >
              {labelText}
            </button>
          ))}
        </div>
        {mode === "vanishing" && (
          <div className="flex items-center gap-1.5">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setYaw(p.yaw);
                  setPitch(p.pitch);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={ref}
          className="block h-[420px] w-full cursor-grab touch-none sm:h-[500px] active:cursor-grabbing"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY };
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x;
            const dy = e.clientY - drag.current.y;
            drag.current = { x: e.clientX, y: e.clientY };
            setYaw((v) => clamp(v + dx * 0.007, -1.25, 1.25));
            setPitch((v) => clamp(v + dy * 0.007, -0.85, 0.85));
          }}
          onPointerUp={() => (drag.current = null)}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:gap-8">
        <MiniSlider label="左右旋转" value={yaw} min={-1.25} max={1.25} onChange={setYaw} fmt={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        <MiniSlider label="上下俯仰" value={pitch} min={-0.85} max={0.85} onChange={setPitch} fmt={(v) => `${Math.round((v * 180) / Math.PI)}°`} />
        <p className="flex items-center text-xs text-zinc-500">拖动画布也可旋转立方体</p>
      </div>
    </div>
  );
}

function MiniSlider({
  label: labelText,
  value,
  min,
  max,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="w-16 shrink-0 text-xs text-zinc-400">{labelText}</span>
      <input
        type="range"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-indigo-400"
        value={value}
        min={min}
        max={max}
        step={0.01}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="w-10 shrink-0 font-mono text-xs tabular-nums text-zinc-300">{fmt(value)}</span>
    </div>
  );
}
