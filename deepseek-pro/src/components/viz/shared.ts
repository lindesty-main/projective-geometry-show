import { palette } from "@/lib/theme";

export type Ctx = CanvasRenderingContext2D;

/** Subtle background grid. */
export function drawGrid(ctx: Ctx, w: number, h: number, step = 40) {
  ctx.save();
  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0.5; x <= w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = 0.5; y <= h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
  ctx.restore();
}

export function line(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 1,
  dash: number[] = [],
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

export function polyline(ctx: Ctx, pts: ReadonlyArray<readonly [number, number]>, color: string, width = 1.5) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
  ctx.restore();
}

export function dot(ctx: Ctx, x: number, y: number, r: number, fill: string, stroke = "rgba(0,0,0,0.4)") {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

export function ring(ctx: Ctx, x: number, y: number, r: number, fill: string, glow = 0) {
  ctx.save();
  if (glow > 0) {
    ctx.shadowColor = fill;
    ctx.shadowBlur = glow;
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

export function label(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  color: string = palette.muted,
  align: CanvasTextAlign = "left",
  size = 11,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${size}px ui-sans-serif, system-ui, "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Paint the panel background so the two halves of a diagram read as separate. */
export function fillPanel(ctx: Ctx, x: number, y: number, w: number, h: number, fill = palette.panel) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}
