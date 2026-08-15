import { useMemo, useRef, useState } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { palette } from "@/lib/theme";
import { dot, drawGrid, label, line } from "./shared";

type Mode = "trees" | "circles";

const ML = 46;
const MR = 46;
const MT = 24;

function gcd(a: number, b: number): number {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return Math.abs(a);
}

export function FordCircles() {
  const [mode, setMode] = useState<Mode>("trees");
  const [qmax, setQmax] = useState(24);
  const [hover, setHover] = useState<{ p: number; q: number } | null>(null);

  const fractions = useMemo(() => {
    const out: { p: number; q: number }[] = [];
    for (let q = 1; q <= qmax; q++) {
      for (let p = 0; p <= q; p++) {
        if (gcd(p, q) === 1) out.push({ p, q });
      }
    }
    return out;
  }, [qmax]);

  const canvasBox = useRef<HTMLCanvasElement | null>(null);

  const ref = useCanvas(
    (ctx, w, h) => {
      const baseline = h * 0.56;
      const scale = Math.min(h * 0.5, baseline) / 1.12;
      const xOf = (f: number) => ML + f * (w - ML - MR);

      drawGrid(ctx, w, h, 32);

      // number line [0, 1]
      line(ctx, xOf(0), baseline, xOf(1), baseline, palette.axis, 1.2);
      for (const [f, s] of [
        [0, "0"],
        [0.5, "1/2"],
        [1, "1"],
      ] as const) {
        dot(ctx, xOf(f), baseline, 2.5, palette.text);
        label(ctx, s, xOf(f), baseline + 16, palette.muted, "center", 11);
      }
      label(ctx, "位置 = p/q", xOf(0.5), baseline + 32, palette.muted, "center", 10);

      if (mode === "trees") {
        // a "tree" of half-height 1/q at every reduced fraction p/q
        for (const { p, q } of fractions) {
          const x = xOf(p / q);
          const half = scale / q;
          const bright = q <= 2;
          const color = bright ? palette.accent : `rgba(52, 211, 153, ${0.25 + (1 - q / qmax) * 0.5})`;
          line(ctx, x, baseline - half, x, baseline + half, color, bright ? 2 : 1);
        }
        label(ctx, "树高 ∝ 1/q（分母越小，树越高）", xOf(0.5), MT + 4, palette.muted, "center", 11);
      } else {
        // tangent circles of radius ∝ 1/q (lattice spheres projected)
        for (const { p, q } of fractions) {
          const x = xOf(p / q);
          const r = scale / (2 * q);
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, baseline - r, r, 0, Math.PI * 2);
          ctx.fillStyle = q <= 2 ? "rgba(244, 114, 182, 0.28)" : "rgba(34, 211, 238, 0.16)";
          ctx.fill();
          ctx.strokeStyle = q <= 2 ? palette.accent : "rgba(34, 211, 238, 0.5)";
          ctx.lineWidth = q <= 2 ? 1.5 : 0.75;
          ctx.stroke();
          ctx.restore();
        }
        label(ctx, "半径 ∝ 1/q（球半径按 1/z 缩减）", xOf(0.5), MT + 4, palette.muted, "center", 11);
      }

      // hover highlight
      if (hover) {
        const x = xOf(hover.p / hover.q);
        const half = scale / hover.q;
        line(ctx, x, baseline - half, x, baseline + half, palette.warn, 2);
        dot(ctx, x, baseline, 3.5, palette.warn);
      }
    },
    [mode, qmax, fractions, hover],
    false,
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {(
            [
              ["trees", "树林 · 线段"],
              ["circles", "晶格 · 圆"],
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
        {hover && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-xs text-amber-300">
            {hover.p}/{hover.q} · 高度 1/{hover.q}
          </span>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={(el) => {
            ref.current = el;
            canvasBox.current = el;
          }}
          className="block h-[360px] w-full sm:h-[440px]"
          onMouseMove={(e) => {
            const el = canvasBox.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const fx = (e.clientX - rect.left - ML) / (rect.width - ML - MR);
            let best = null as { p: number; q: number; d: number } | null;
            for (const f of fractions) {
              const d = Math.abs(fx - f.p / f.q);
              if (!best || d < best.d) best = { ...f, d };
            }
            if (best && best.d < 0.02) setHover({ p: best.p, q: best.q });
            else setHover(null);
          }}
          onMouseLeave={() => setHover(null)}
        />
      </div>

      <div className="flex items-center gap-4 border-t border-white/[0.06] px-5 py-4">
        <span className="w-28 shrink-0 text-xs text-zinc-400">最大分母 q ≤ {qmax}</span>
        <input
          type="range"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-400"
          value={qmax}
          min={2}
          max={48}
          step={1}
          onChange={(e) => setQmax(parseInt(e.target.value, 10))}
        />
      </div>
    </div>
  );
}
