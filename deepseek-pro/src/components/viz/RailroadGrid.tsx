import { useState } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import { dot, drawGrid, label, line } from "./shared";

const W = 1; // rails at x = ±W

export function RailroadGrid() {
  const [n, setN] = useState(12);
  const [focus, setFocus] = useState(4);

  const ref = useCanvas(
    (ctx, w, h) => {
      const splitX = w * 0.46;

      // ---- Top-down schematic (left) --------------------------------------
      const left = { x: 0, y: 0, w: splitX, h };
      const xRange = 3.2; // [-1.6, 1.6]
      const zRange = n + 1.5; // [0, n+1.5]
      const sTop = Math.min(left.w / xRange, left.h / zRange);
      const cxl = left.x + left.w / 2;
      const cyl = left.y + 20;
      const tx = (x: number) => cxl + x * sTop;
      const tz = (z: number) => cyl + z * sTop;

      ctx.save();
      ctx.fillStyle = palette.panel;
      ctx.fillRect(left.x, left.y, left.w, left.h);
      ctx.restore();
      drawGrid(ctx, left.w, left.h, 30);

      // canvas plane (a vertical line at z = 1 in the top view)
      line(ctx, tx(-1.5), tz(1), tx(1.5), tz(1), palette.primarySoft, 1.4, [6, 5]);
      label(ctx, "画布 z=1", tx(-1.5), tz(1) - 8, palette.primary, "left", 10);

      // eye
      dot(ctx, tx(0), tz(0), 4, palette.warn);
      label(ctx, "眼 O", tx(0) + 8, tz(0), palette.warn, "left", 11);

      // rails
      line(ctx, tx(-W), tz(1), tx(-W), tz(n), "rgba(226,232,240,0.75)", 2);
      line(ctx, tx(W), tz(1), tx(W), tz(n), "rgba(226,232,240,0.75)", 2);
      label(ctx, "x=+W", tx(W) + 6, tz(n / 2), palette.muted, "left", 10);
      label(ctx, "x=−W", tx(-W) + 6, tz(n / 2), palette.muted, "left", 10);

      // ties (equally spaced)
      for (let k = 1; k <= n; k++) {
        const col = k === focus ? palette.accent : "rgba(226,232,240,0.4)";
        line(ctx, tx(-W), tz(k), tx(W), tz(k), col, k === focus ? 2 : 1);
      }
      label(ctx, "三维空间里等间距的枕木", cxl, left.h - 14, palette.muted, "center", 11);

      // ---- Perspective projection (right) ----------------------------------
      const panel = { x: splitX, w: w - splitX };
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(splitX + 0.5, 0);
      ctx.lineTo(splitX + 0.5, h);
      ctx.stroke();
      ctx.restore();

      const hy = h * 0.16; // horizon row
      const bottom = h - 24;
      const scaleP = Math.min(panel.w / 2.3, (bottom - hy) / 1.06);
      const cx2 = panel.x + panel.w / 2;
      const px = (u: number) => cx2 + u * scaleP;
      const py = (v: number) => hy + v * scaleP;

      drawGrid(ctx, panel.w, h, 30);

      // horizon + vanishing point
      line(ctx, panel.x, hy, w, hy, palette.axis, 1.2, [7, 5]);
      label(ctx, "地平线 v=0", panel.x + 10, hy - 9, palette.muted, "left", 11);
      dot(ctx, px(0), py(0), 4.5, palette.warn);
      label(ctx, "消失点", px(0) + 9, py(0) + 4, palette.warn, "left", 11);

      // rails converge to the vanishing point
      line(ctx, px(-W), py(1), px(0), py(0), "rgba(226,232,240,0.7)", 2);
      line(ctx, px(W), py(1), px(0), py(0), "rgba(226,232,240,0.7)", 2);

      // ties at v = 1/k (harmonic)
      for (let k = 1; k <= n; k++) {
        const v = 1 / k;
        const col = k === focus ? palette.accent : "rgba(226,232,240,0.5)";
        line(ctx, px(-W / k), py(v), px(W / k), py(v), col, k === focus ? 2.5 : 1.2);
        if (k <= 5) label(ctx, `1/${k}`, px(-W / k) - 6, py(v), palette.muted, "right", 9);
      }

      // highlight the spacing between tie `focus` and `focus+1`
      const v1 = 1 / focus;
      const v2 = 1 / (focus + 1);
      const bracketX = cx2 + panel.w * 0.38;
      line(ctx, bracketX, py(v2), bracketX, py(v1), palette.accent, 1.6);
      line(ctx, bracketX - 5, py(v1), bracketX + 5, py(v1), palette.accent, 1.6);
      line(ctx, bracketX - 5, py(v2), bracketX + 5, py(v2), palette.accent, 1.6);
      label(
        ctx,
        `间距 = 1/${focus} − 1/${focus + 1} = 1/${focus * (focus + 1)}`,
        bracketX + 10,
        (py(v1) + py(v2)) / 2,
        palette.accent,
        "left",
        10,
      );

      label(ctx, "到地平线距离 ∝ 1/n（调和）", panel.x + 10, h - 12, palette.text, "left", 11);
    },
    [n, focus],
    false,
  );

  return (
    <div>
      <div className="relative">
        <canvas ref={ref} className="block h-[380px] w-full sm:h-[460px]" />
      </div>
      <div className="flex flex-col gap-4 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:gap-8">
        <Range
          label="枕木数量 n"
          value={n}
          min={4}
          max={24}
          step={1}
          onChange={setN}
          fmt={(v) => String(v)}
        />
        <Range
          label="观察枕木"
          value={focus}
          min={1}
          max={Math.max(1, n - 1)}
          step={1}
          onChange={setFocus}
          fmt={(v) => String(v)}
        />
      </div>
    </div>
  );
}

function Range({
  label: labelText,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  fmt: (v: number) => string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-zinc-400">{labelText}</span>
      <input
        type="range"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-400"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-zinc-300">{fmt(value)}</span>
    </div>
  );
}
