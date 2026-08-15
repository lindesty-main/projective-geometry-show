import type { LucideIcon } from 'lucide-react'
import { Aperture, Cuboid, GitMerge, Trees, Waves } from 'lucide-react'

export type Chapter = {
  number: string
  kicker: string
  title: string
  summary: string
  formula: string
  icon: LucideIcon
}

export const chapters: Chapter[] = [
  {
    number: '01',
    kicker: '第一性原理',
    title: '把世界除以深度',
    summary: '眼睛、物体与画布三点共线。三维坐标同时除以深度 z，就得到二维视野。',
    formula: '(u, v) = (x/z, y/z)',
    icon: Aperture,
  },
  {
    number: '02',
    kicker: '熟悉的陌生感',
    title: '波浪如何变成山脉',
    summary: '两条平行的空间正弦曲线，投影后恰好成为在原点无限振荡的经典函数。',
    formula: 'v = u sin(1/u)',
    icon: Waves,
  },
  {
    number: '03',
    kicker: '方向的终点',
    title: '消失点不是魔法',
    summary: '每组空间平行线都对应唯一消失点；方向向量直接决定它在画布上的坐标。',
    formula: 'V∞ = (a/c, b/c)',
    icon: GitMerge,
  },
  {
    number: '04',
    kicker: '无穷的节奏',
    title: '铁轨并非指数收缩',
    summary: '枕木到地平线的距离按调和级数缩减，相邻间距则按平方倒数衰减。',
    formula: 'hₙ ∝ 1/n · Δhₙ ∝ 1/n²',
    icon: Cuboid,
  },
  {
    number: '05',
    kicker: '看见数论',
    title: '树林里的有理数',
    summary: '无限网格投影成有理数森林；越简单的整数比越靠前、越高，也越醒目。',
    formula: '(i, j) ↦ ((j−i)/(j+i), 1/(j+i))',
    icon: Trees,
  },
]
