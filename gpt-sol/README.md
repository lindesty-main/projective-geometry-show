# 投影场记 · Projective Field Notes

将 `tmp/srt.txt` 中关于透视投影的数学叙事，重构为一个可交互的中文网页体验。

## 内容结构

1. 第一性原理：`(x, y, z) → (x/z, y/z)`
2. 两条空间正弦曲线与 `x·sin(1/x)`
3. 近大远小、投影不可逆与消失点
4. 一点、两点、三点透视
5. 铁轨的调和收缩与平方倒数间距
6. 有理数森林与无限晶格
7. 圆的透视投影与圆锥曲线

## 技术方案

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React
- 原生 SVG 数学可视化

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 工程结构

```text
src/
├── components/       # 独立场景、交互实验和通用排版组件
├── data/             # 从字幕提炼的章节数据
├── App.tsx           # 页面叙事编排
├── main.tsx          # 应用入口
└── styles.css        # Tailwind 主题与少量全局基础样式
```
