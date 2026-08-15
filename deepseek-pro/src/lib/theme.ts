/**
 * Shared design tokens used by the canvas visualizations.
 * Kept in one place so every diagram shares a consistent palette.
 */
export const palette = {
  bg: "#09090b",
  panel: "#0d0d12",
  grid: "rgba(255, 255, 255, 0.055)",
  gridStrong: "rgba(255, 255, 255, 0.1)",
  axis: "rgba(255, 255, 255, 0.28)",
  text: "#e4e4e7",
  muted: "#8b8b95",
  primary: "#818cf8", // indigo-400
  primarySoft: "rgba(129, 140, 248, 0.35)",
  secondary: "#22d3ee", // cyan-400
  secondarySoft: "rgba(34, 211, 238, 0.3)",
  accent: "#f472b6", // pink-400
  accentSoft: "rgba(244, 114, 182, 0.3)",
  warn: "#fbbf24", // amber-400
  emerald: "#34d399",
} as const;

export type ColorKey = keyof typeof palette;
