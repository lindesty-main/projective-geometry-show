/** 全局配色（与 tailwind 主题保持一致） */
export const C = {
  cyan: '#22d3ee',
  violet: '#a78bfa',
  amber: '#fbbf24',
  rose: '#fb7185',
  emerald: '#34d399',
  slate: '#94a3b8',
  white: '#f8fafc',
  ink: '#0b0b18',
} as const

/** 按比例在两端颜色间插值 */
export function mixColor(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA)
  const b = hexToRgb(hexB)
  const c = a.map((v, i) => Math.round(lerpNum(v, b[i], t)))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
