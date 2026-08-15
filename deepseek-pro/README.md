# 透视与投影 · Perspective & Projection

一个交互式数学科普网站，将一条中文数学科普视频（**曼氏《透视与投影的世界》**）的字幕内容
重构为现代 Web 应用：用可交互的 Canvas 可视化，把「透视 / 投影几何」中的每个结论做成可以亲手
拖拽、滑动、观察的演示。

> 从 `x·sin(1/x)` 出发，经过投影公式 `(x/z, y/z)`，一路推出消失点、铁轨的调和级数、
> 有理数的树林与「圆投影成椭圆」。

---

## 内容结构（字幕主题提取）

| 章节 | 主题 | 关键信息 | 交互演示 |
|------|------|----------|----------|
| 00 引子 | `x·sin(1/x)` 钻入原点 | 两条三维正弦波浪线投影后恰好拼出该函数 | 两条波浪线 → 函数图像（自动播放） |
| 01 第一性原理 | 投影万能公式 | 眼在原点、画布 `z=1`，`(u,v)=(x/z, y/z)` | 立方体 8 顶点投影、光线穿过画布 |
| 02 近大远小与不可逆 | `1/z` 缩放、投影不可逆 | 一条射线上的点压到同一点 → Ames 房间 | 五个等大正方形按 `1/z` 嵌套、射线扫掠 |
| 03 消失点 | 一点/两点/三点透视 | 直线 `P₀+tD`，消失点 `(A/C, B/C)` | 立方体三组棱的消失点、透视预设 |
| 04 铁轨与棋盘格 | 调和级数 | 到地平线距离 `1/n`、间距 `1/n²` | 等距枕木 → 调和收缩、间距标注 |
| 05 有理数 | 树林即全体有理数 | 最简分数 `p/q` → 高度 `1/q` | 有理数树林 / 晶格圆，悬停查看分数 |
| 06 圆锥曲线 | 圆投影成椭圆 | 丹德林双球法逆向、中心偏移 | 倾斜圆投影、正圆对比、中心偏移 |

---

## 技术栈

- **构建**：Vite 6 + React 18 + TypeScript（strict，`@/` 路径别名）
- **样式**：Tailwind CSS v4（`@tailwindcss/vite`，utility-first，几乎零手写 CSS）
- **UI 组件**：Radix UI（Slider / Tabs）+ `class-variance-authority` / `clsx` / `tailwind-merge`
- **动画**：Framer Motion（滚动入场、弹性过渡）
- **数学渲染**：KaTeX
- **图标**：lucide-react
- **可视化**：原生 Canvas 2D，配合自研 `useCanvas` hook 与 `lib/math3d`（投影公式即内容本身）

---

## 工程结构

```
deepseek-pro/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx            # 入口（引入 KaTeX CSS + 全局样式）
    ├── index.css           # Tailwind v4 主题 token 与少量全局样式
    ├── App.tsx             # 页面骨架：导航 + 章节 + 页脚
    ├── data/
    │   └── content.ts      # 字幕提取出的章节结构与核心公式
    ├── lib/
    │   ├── math3d.ts       # 向量/旋转/投影/消失点/正交相机（纯函数）
    │   ├── theme.ts        # Canvas 调色板 token
    │   └── utils.ts        # cn() 类名合并
    ├── hooks/
    │   └── useCanvas.ts    # 响应式 Canvas（DPR、ResizeObserver、rAF）
    ├── components/
    │   ├── Nav.tsx         # 吸顶导航 + 滚动高亮
    │   ├── Math.tsx        # KaTeX 行内/块级渲染
    │   ├── ChapterShell.tsx# 章节外壳（标题/引言/入场动画）
    │   ├── CanvasCard.tsx  # 图表卡片容器
    │   ├── ui/             # Radix 封装：Slider / Tabs / Card / Badge
    │   └── viz/            # 6 个交互可视化组件
    │       ├── SinusoidProjection.tsx
    │       ├── ProjectionCube.tsx
    │       ├── NearFar.tsx
    │       ├── RailroadGrid.tsx
    │       ├── FordCircles.tsx
    │       └── CircleEllipse.tsx
    └── sections/           # 每章的内容文案 + 对应演示
        ├── Hero.tsx
        ├── IntroSection.tsx
        ├── FirstPrincipleSection.tsx
        ├── NearFarSection.tsx
        ├── VanishingSection.tsx
        ├── RailroadSection.tsx
        ├── RationalSection.tsx
        ├── CircleEllipseSection.tsx
        └── OutroSection.tsx
```

---

## 运行

```bash
npm install        # 安装依赖
npm run dev        # 本地开发（Vite dev server）
npm run build      # 类型检查 + 生产构建（输出到 dist/）
npm run preview    # 预览生产构建
npm run typecheck  # 仅做 TypeScript 类型检查
```

---

## 设计说明

- **可视化即数学**：投影公式 `(x/z, y/z)` 是内容的核心，因此没有引入通用 3D 引擎，
  而是用 `lib/math3d.ts` 里的纯函数直接实现透视投影、正交示意相机与消失点计算，
  让「代码」与「视频里的推导」一一对应。
- **组件化与模块化**：章节文案与演示分离（`sections/` 与 `components/viz/`），
  共享的 Canvas 能力收敛在 `useCanvas` 与 `viz/shared.ts`，UI 原语收敛在 `components/ui/`。
- **响应式**：Canvas 通过 `ResizeObserver` + 设备像素比自适应，布局在移动端纵向堆叠。
- **可访问性**：交互控件均为原生可聚焦元素（按钮 / `input[type=range]`），并带中文 `aria-label`。
