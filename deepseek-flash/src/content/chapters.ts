import { lazy, type ComponentType } from 'react'

export interface Quote {
  /** 字幕原文金句（短引句，附来源） */
  text: string
  /** 出处（视频内位置） */
  from?: string
}

export interface FormulaItem {
  tex: string
  label?: string
  note?: string
}

export type VizId =
  | 'oscillating'
  | 'projection'
  | 'sineCurves'
  | 'nonInvertible'
  | 'vanishing'
  | 'railroad'
  | 'harmonic'
  | 'forest'
  | 'lattice'
  | 'circleEllipse'

export interface Chapter {
  id: string
  /** 罗马序号，如 "壹" */
  numeral: string
  title: string
  subtitle: string
  /** 章节导语 */
  intro: string
  quotes: Quote[]
  points: string[]
  formulas: FormulaItem[]
  viz: VizId
  vizTitle: string
  /** 可视化下方的小提示 */
  hint?: string
  accent: 'cyan' | 'violet' | 'amber' | 'rose' | 'emerald'
}

export const ACCENT_COLORS: Record<Chapter['accent'], { text: string; border: string; bg: string; dot: string; hex: string }> = {
  cyan: { text: 'text-brand-cyan', border: 'border-brand-cyan/30', bg: 'bg-brand-cyan/10', dot: 'bg-brand-cyan', hex: '#22d3ee' },
  violet: { text: 'text-brand-violet', border: 'border-brand-violet/30', bg: 'bg-brand-violet/10', dot: 'bg-brand-violet', hex: '#a78bfa' },
  amber: { text: 'text-brand-amber', border: 'border-brand-amber/30', bg: 'bg-brand-amber/10', dot: 'bg-brand-amber', hex: '#fbbf24' },
  rose: { text: 'text-brand-rose', border: 'border-brand-rose/30', bg: 'bg-brand-rose/10', dot: 'bg-brand-rose', hex: '#fb7185' },
  emerald: { text: 'text-brand-emerald', border: 'border-brand-emerald/30', bg: 'bg-brand-emerald/10', dot: 'bg-brand-emerald', hex: '#34d399' },
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'prologue',
    numeral: '序',
    title: '一个不肯安分的函数',
    subtitle: 'x·sin(1/x) 在原点附近的无穷震荡',
    intro:
      '一切从一个微积分课本里的"怪函数"开始：它在原点附近震荡得越来越快、振幅越来越小。但换个角度——把它看成三维空间中的景象，你会发现自己正沿江而下，两岸青山消失在远方。绘画里，这个现象叫透视。',
    quotes: [
      { text: '震荡得越来越快，振幅越来越小，直到钻进原点。' },
      { text: '你有没有感觉自己像是沿江而下，两岸连绵的青山消失在天际呢？' },
      { text: '这种感觉是精确且严谨的——它在绘画里叫做透视。' },
    ],
    points: [
      'x·sin(1/x) 在 x→0 处震荡无限加速、振幅线性收缩',
      '视觉上的"青山消失在天际"其实是一条严格的数学投影曲线',
      '本期将用一条公式推导出透视世界中的一切',
    ],
    formulas: [
      { tex: 'f(x) = x\\sin\\frac{1}{x}', label: '开场函数' },
      { tex: '\\lim_{x\\to 0} x\\sin\\frac{1}{x} = 0', label: '但处处不可导的怪点' },
    ],
    viz: 'oscillating',
    vizTitle: '把镜头推进原点',
    hint: '试试用滑块手动缩放，或开启自动巡航。',
    accent: 'cyan',
  },
  {
    id: 'first-principle',
    numeral: '壹',
    title: '第一性原理：投影公式',
    subtitle: '眼睛是原点，画布是 z=1',
    intro:
      '假设你的眼睛是原点，面前距离 1 的地方有一张画布 z=1。三维空间中任意一点 P(x,y,z) 发出的光，穿过画布留下的点 (u,v)——因为向量共线，缩放比例只看 z 坐标，于是得到了整个透视世界的第一性原理。',
    quotes: [
      { text: '任何一点 (x,y,z) 发出的光线射入你的眼睛，都会穿过画布，留下一个点 (u,v)。' },
      { text: '画布上的点所在的向量永远和物体的向量共线。' },
      { text: '这就是透视最最基础的万能公式，是整个透视的第一性原理。' },
    ],
    points: [
      '比例 = 1 : z，三个坐标同时除以深度 z',
      '立方体的 8 个顶点投影后，正是你看到的那个立方体',
      '后续所有结论都从这一个公式出发',
    ],
    formulas: [
      { tex: 'u = \\frac{x}{z},\\quad v = \\frac{y}{z}', label: '中心投影公式' },
    ],
    viz: 'projection',
    vizTitle: '三维空间 → 二维画布',
    hint: '拖动青色小球，观察它在画布 z=1 上的投影点同步移动。',
    accent: 'cyan',
  },
  {
    id: 'mountains',
    numeral: '贰',
    title: '山的秘密',
    subtitle: '两条正弦曲线，投影出开场的函数',
    intro:
      '既然它看起来像两排山脉，那我们就在三维空间里真的造出山来：两条正弦曲线分别躺在 x=1 与 x=-1 的平面上。把它们投影到画布，你会惊讶地发现——得到的图像 exactly 就是 x·sin(1/x)。',
    quotes: [
      { text: '微积分课本上这个经典却又处处不光滑的函数，竟然真的就是透视空间里两条平行波浪线在我们眼中的模样。' },
      { text: '我们严格地证明了这种视觉观感上的熟悉，其实就是严格的数学投影对应。' },
    ],
    points: [
      '曲线参数方程：(1, sin t, t) 与 (-1, sin t, t)',
      '投影后 u = ±1/t，v = sin t / t，联立得 v = u·sin(1/u)',
      '"沿江而下"的既视感，背后是精确的射影几何',
    ],
    formulas: [
      { tex: '(1,\\,\\sin t,\\,t),\\qquad (-1,\\,\\sin t,\\,t)', label: '两条三维曲线' },
      { tex: 'v = u\\,\\sin\\frac{1}{u}', label: '投影后的曲线' },
    ],
    viz: 'sineCurves',
    vizTitle: '两条波浪线 → 一条函数曲线',
    hint: '开启「乘船视角」，让镜头沿河道顺流而下，两侧青山就是这两条正弦曲线。',
    accent: 'violet',
  },
  {
    id: 'non-invertible',
    numeral: '叁',
    title: '近大远小与不可逆性',
    subtitle: '为什么同一幅画面，可以是不同的房间',
    intro:
      '因为 x、y 都要除以深度 z，所以同样的物体离得越远看起来越小。更深刻的是：这个对应不可逆——许多不同位置的点会投影到同一位置。于是就有了经典的 Ames Room 视错觉。',
    quotes: [
      { text: '与原点连线在同一条直线上的所有点，都会被投影压到画布上的同一个地方。' },
      { text: '在你眼中是一个正方形的图案，反向射出四条射线——四个顶点可以在这四条射线上任意跑动。' },
      { text: 'Ames Room：看起来是一个正常的房间，但其实左侧要深得多。' },
    ],
    points: [
      '近大远小：图像大小 ∝ 1/深度 z',
      '投影不是一一对应：整条视线上的点共享一个像点',
      '固定画面，沿四条射线滑动物体，图像永远不变',
    ],
    formulas: [
      { tex: '大小 \\propto \\frac{1}{z}', label: '近大远小' },
      { tex: 'L_1/z_1 = L_2/z_2 \\;\\Rightarrow\\; 投影相同', label: '不可逆性' },
    ],
    viz: 'nonInvertible',
    vizTitle: '让正方形在射线上滑动',
    hint: '拖动滑块改变深度 d，画面上的图像始终是同一个正方形。',
    accent: 'amber',
  },
  {
    id: 'vanishing',
    numeral: '肆',
    title: '直线与消失点',
    subtitle: '为什么平行线有时平行，有时汇聚',
    intro:
      '三维空间中的直线可以用 P₀ + t·D 表示。当直线平行于画布（方向向量的 z 分量 c=0）时，平行线投影后依然平行，等分点也被保留；当 c≠0 时，一切方向相同的平行线都会奔向同一个点——消失点 (a/c, b/c)。',
    quotes: [
      { text: '所有方向向量平行的平行线，在 t 趋向无穷时，最终都会奔向同一个点 (a/c, b/c)。' },
      { text: '每一组空间中平行的直线，都对应于同一个消失点；反过来也是同理。' },
    ],
    points: [
      'c=0：平行于画布 → 平行线依然平行、等分点保留',
      'c≠0：投影后依然是直线，且收敛到消失点',
      '消失点与空间方向一一对应',
    ],
    formulas: [
      { tex: 'P(t) = P_0 + t\\,D,\\quad D=(a,b,c)', label: '直线参数方程' },
      { tex: '\\text{消失点}=\\left(\\frac{a}{c},\\,\\frac{b}{c}\\right)', label: '收敛点' },
    ],
    viz: 'vanishing',
    vizTitle: '转动长方体：一点 / 两点 / 三点透视',
    hint: '拖动两个角度滑块旋转长方体，再切到「画家视角」看画布上的结果。',
    accent: 'rose',
  },
  {
    id: 'railroad',
    numeral: '伍',
    title: '铁轨上的枕木',
    subtitle: '一道来自 Honsberger 的经典几何题',
    intro:
      '一位画家画下铁轨与两根相邻的枕木——它们平行于地平线。请问：下一根枕木严格来说该画在哪里？这个问题来自 Ross Honsberger 的《More Mathematical Morsels》，有两种漂亮的解法。',
    quotes: [
      { text: '所有一格格铁轨和枕木所形成的长方形的对角线全部平行，因此共用一个消失点。' },
      { text: 'BE 和 CD 的中点一定三点共线——而 CD 平行于画布，所以它的中点投影后还是中点。' },
      { text: '枕木到地平线的距离以调和级数收缩，间距则以平方倒数收缩。' },
    ],
    points: [
      '解法一：构造"对角线的消失点"，它在铁轨的消失点与地平线上',
      '解法二：利用投影保中点性（中点三点共线）',
      '距离按 1/n 收缩（调和级数），间距按 1/n² 收缩',
    ],
    formulas: [
      { tex: 'y_n \\propto \\frac{1}{n}', label: '枕木距地平线' },
      { tex: 'y_n - y_{n+1} \\propto \\frac{1}{n^2}', label: '相邻间距' },
    ],
    viz: 'railroad',
    vizTitle: '动手画出下一根枕木',
    hint: '分别用「对角线法」与「中点法」作画，再连续铺枕木观察收缩规律。',
    accent: 'amber',
  },
  {
    id: 'harmonic',
    numeral: '陆',
    title: '收缩的节奏',
    subtitle: '调和级数 与 平方倒数',
    intro:
      '把枕木的纵坐标写出来：第 n 根枕木在画布上离地平线的距离是 1/n，而相邻两根的间距是 1/n − 1/(n+1) ≈ 1/n²。古人不借助坐标系，用纯几何（相似三角形）也能推出同样的结论。',
    quotes: [
      { text: '这都是没有坐标系时代的落后做法——直接用投影公式，答案立刻呼之欲出。' },
      { text: '相邻两项做差，就可以得到枕木的间距是以平方的倒数衰减的。' },
    ],
    points: [
      '设铁轨 x=±w、枕木 y=1、等距分布在 z=n',
      '投影后纵坐标 v = 1/n：调和级数收缩',
      '相邻间距 v_n − v_{n+1} = 1/(n(n+1))：平方倒数收缩',
    ],
    formulas: [
      { tex: 'v_n = \\frac{1}{n}', label: '纵坐标' },
      { tex: 'v_n - v_{n+1} = \\frac{1}{n(n+1)} \\approx \\frac{1}{n^2}', label: '间距' },
    ],
    viz: 'harmonic',
    vizTitle: '两条衰减曲线',
    hint: '拖动滑块增加枕木数量，对比两种收缩速度。',
    accent: 'emerald',
  },
  {
    id: 'forest',
    numeral: '柒',
    title: '有理数森林',
    subtitle: '你正站在全体正有理数面前',
    intro:
      '站在一片树林之前，树干组成高低远近错落的图案——你可能没有想过，此刻你正在以最直观的方式凝视全体正有理数：在每个最简分数 p/q 的位置，长出一棵高度 1/p 的树。',
    quotes: [
      { text: '此时此刻，你正在以最直观的方式凝视全体的正有理数。' },
      { text: '一排排远离的树木，正好就在画布上构成间隔为 1/n、高度也是 1/n 的线段。' },
      { text: '如果一个分数不是最简分数，它的线段不会超过最简分数的那棵树，因此会被挡住。' },
    ],
    points: [
      '网格基底 (1,1) 与 (1,-1)：树顶在 (j−i, 1, j+i)',
      '投影后：u = (j−i)/(j+i)，v = 1/(j+i)',
      'i+j = n 的一排树 → 间距 2/n、高度 1/n 的线段',
      '非最简分数被遮挡——一切都丝丝入扣',
    ],
    formulas: [
      { tex: 'u = \\frac{j-i}{j+i},\\qquad v = \\frac{1}{j+i}', label: '树顶投影' },
    ],
    viz: 'forest',
    vizTitle: '无限网格 → 有理数图案',
    hint: '左右联动的两幅图：左边是三维的树，右边是投影后的有理数森林。',
    accent: 'violet',
  },
  {
    id: 'lattice',
    numeral: '捌',
    title: '无限晶格',
    subtitle: '一个点阵，看见平面上所有的有理点',
    intro:
      '在三维空间的所有整点上放同样大小的小球，投影到画布上：整点 (x,y,z) 变成 (x/z, y/z)，半径按 1/z 收缩。这就是整个二维平面上所有的有理点——而且半径越大，说明这个有理数越接近简单的整数比。',
    quotes: [
      { text: '这就是整个二维平面上所有的有理点。' },
      { text: '半径越大意味着越接近于简单的整数之比——而比较奇怪的有理数就会显得比较小。' },
      { text: '望向一片无限的晶格，就能一下子理解平面上所有的有理点，是不是很神奇呢？' },
    ],
    points: [
      '整点 (x,y,z) → 画布上的 (x/z, y/z)',
      '半径 r/z：越近（z 越小）的球越大、越"简单"',
      '最简分数对应的球总是挡在最前面',
    ],
    formulas: [
      { tex: '(x,y,z) \\mapsto \\left(\\frac{x}{z},\\frac{y}{z}\\right),\\qquad r \\mapsto \\frac{r}{z}', label: '晶格投影' },
    ],
    viz: 'lattice',
    vizTitle: '三维点阵 → 有理点平面',
    hint: '试试「正视画布」——你会直接看到一张有理点组成的星图。',
    accent: 'emerald',
  },
  {
    id: 'circle-ellipse',
    numeral: '玖',
    title: '圆与椭圆',
    subtitle: '圆投影之后，真的是标准椭圆吗？',
    intro:
      '一个经典"吵架问题"：圆投影之后是不是标准椭圆？既可以直接代入投影公式配方证明，也可以利用丹德林双球与"压缩"的几何直观：压缩 y 坐标能让圆与椭圆互换角色。',
    quotes: [
      { text: '投影之后的这个坐标满足 x² + 3y² − 4y + 1 = 0，配方后正是一个标准的椭圆方程。' },
      { text: '我们压缩和拉伸所有点的 y 坐标……原来的椭圆刚好变成了圆，而圆则变成了椭圆。' },
      { text: '圆在投影之后，它的中心并不是画面当中投影椭圆的正中心，而总是会偏上一些。' },
    ],
    points: [
      '代入参数方程 (cos t, 1, sin t + 2) 直接配方可证',
      '椭圆是圆锥曲线：斜切圆锥，截出标准椭圆（丹德林双球）',
      '压缩论证：圆与椭圆在某个坐标系里互换角色，一举证明',
    ],
    formulas: [
      { tex: 'u^2 + 3v^2 - 4v + 1 = 0', label: '投影像满足的方程' },
      { tex: '\\frac{u^2}{1/3} + \\frac{(v-2/3)^2}{1/9} = 1', label: '配方：标准椭圆' },
    ],
    viz: 'circleEllipse',
    vizTitle: '圆上的点 → 椭圆上的点',
    hint: '逐点观察圆上的运动与投影像的对应，注意椭圆的中心并不在原点。',
    accent: 'rose',
  },
]

export const VIZ_LABELS: Record<VizId, string> = {
  oscillating: '震荡函数',
  projection: '投影公式演示',
  sineCurves: '双正弦曲线',
  nonInvertible: '不可逆性',
  vanishing: '消失点',
  railroad: '枕木作图',
  harmonic: '衰减节奏',
  forest: '有理数森林',
  lattice: '无限晶格',
  circleEllipse: '圆与椭圆',
}

/** 懒挂载可视化组件（进入视口后才创建 WebGL 上下文） */
function lazyViz(loader: () => Promise<{ default: ComponentType<{ active: boolean }> }>) {
  return lazy(loader) as ComponentType<{ active: boolean }>
}

export const VIZ_COMPONENTS: Record<VizId, ComponentType<{ active: boolean }>> = {
  oscillating: lazyViz(() => import('@/components/viz/OscillatingFunction')),
  projection: lazyViz(() => import('@/components/viz/ProjectionExplorer')),
  sineCurves: lazyViz(() => import('@/components/viz/SineCurves3D')),
  nonInvertible: lazyViz(() => import('@/components/viz/NonInvertible')),
  vanishing: lazyViz(() => import('@/components/viz/VanishingPoints')),
  railroad: lazyViz(() => import('@/components/viz/RailroadProblem')),
  harmonic: lazyViz(() => import('@/components/viz/HarmonicDecay')),
  forest: lazyViz(() => import('@/components/viz/RationalForest')),
  lattice: lazyViz(() => import('@/components/viz/CrystalLattice')),
  circleEllipse: lazyViz(() => import('@/components/viz/CircleToEllipse')),
}
