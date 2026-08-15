/**
 * 画布(canvas)绘制用的颜色令牌。
 * 与 index.css 中的 @theme 保持一致；深色曲面 #1a1a19 上验证通过
 * （CVD ΔE ≥ 9.4，正常视觉 ΔE ≥ 26.5，对比度 ≥ 3:1）。
 */
export const palette = {
  surface: '#1a1a19',
  surfaceDeep: '#111110',
  ink: '#ffffff',
  ink2: '#c3c2b7',
  ink3: '#8a8980',
  grid: 'rgba(195, 194, 183, 0.12)',
  axis: 'rgba(195, 194, 183, 0.35)',
  s1: '#3987e5',
  s2: '#d95926',
  s3: '#199e70',
  s1Soft: 'rgba(57, 135, 229, 0.18)',
  s2Soft: 'rgba(217, 89, 38, 0.18)',
  s3Soft: 'rgba(25, 158, 112, 0.18)',
} as const

export const FONT = '12px ui-sans-serif, system-ui, sans-serif'
export const FONT_SM = '11px ui-sans-serif, system-ui, sans-serif'
