/**
 * Structured extraction of the video transcript:
 * themes, chapter structure, key formulas and take-aways.
 * Rendered by the section components; the interactive diagrams are
 * co-located with each chapter.
 */

export interface ChapterMeta {
  id: string;
  index: string;
  kicker: string;
  title: string;
  /** Short label shown in the sticky navigation. */
  nav: string;
}

export const chapters: ChapterMeta[] = [
  {
    id: "intro",
    index: "00",
    kicker: "引子",
    title: "一个钻入原点的函数",
    nav: "引子",
  },
  {
    id: "first-principle",
    index: "01",
    kicker: "第一性原理",
    title: "投影的万能公式",
    nav: "投影公式",
  },
  {
    id: "near-far",
    index: "02",
    kicker: "尺度与信息",
    title: "近大远小与不可逆",
    nav: "近大远小",
  },
  {
    id: "vanishing",
    index: "03",
    kicker: "消失点",
    title: "一点、两点与三点透视",
    nav: "消失点",
  },
  {
    id: "railroad",
    index: "04",
    kicker: "铁轨与棋盘格",
    title: "调和级数藏在枕木里",
    nav: "铁轨",
  },
  {
    id: "rational-trees",
    index: "05",
    kicker: "有理数",
    title: "凝视一片树林，就是凝视全体有理数",
    nav: "有理数",
  },
  {
    id: "circle-ellipse",
    index: "06",
    kicker: "圆锥曲线",
    title: "圆投影之后，真的是椭圆",
    nav: "圆与椭圆",
  },
];

/** Key formulas used across the site (rendered with KaTeX). */
export const formulas = {
  projection: String.raw`(u,\,v) = \left(\frac{x}{z},\ \frac{y}{z}\right)`,
  line: String.raw`P(t) = P_0 + t\,D, \qquad D = (A,B,C)`,
  vanishingPoint: String.raw`V_D = \left(\frac{A}{C},\ \frac{B}{C}\right) \quad (C \neq 0)`,
  harmonic: String.raw`y_n \propto -\frac{1}{n}, \qquad \Delta y_n \propto \frac{1}{n^2}`,
  rational: String.raw`\left(\frac{p}{q}\right) \mapsto \text{height } \frac{1}{q}`,
  circleEllipse: String.raw`x^2 + 3y^2 - 4y + 1 = 0`,
} as const;
