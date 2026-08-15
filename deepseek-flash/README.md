# 透视与投影 · 交互式数学漫游

> 由科普视频字幕（`./tmp/srt.txt`）自动解析改编的交互式数学可视化应用。
> 原视频：曼氏《透视与投影》（清华大学姚班人工智能博士 · 科普 up 主）。

从一条公式 **(x/z, y/z)** 出发，用 10 个可交互章节漫游透视、消失点、有理数森林与圆锥曲线的世界。

## ✨ 功能亮点

| 章节 | 内容 | 可视化 |
|------|------|--------|
| 序 | x·sin(1/x) 在原点附近的无穷震荡 | 2D Canvas · 自动巡航缩放 |
| 壹 | 投影第一性原理 (u,v)=(x/z, y/z) | 3D（R3F）· 可拖拽物体 + 实时投影 |
| 贰 | 两条正弦曲线投影出 x·sin(1/x) | 3D · 「乘船视角」沿江而下 |
| 叁 | 近大远小与投影的不可逆性 | 2D Canvas · 深度滑块 + Ames Room |
| 肆 | 直线与消失点 (a/c, b/c) | 3D · 长方体旋转 = 一点/两点/三点透视 |
| 伍 | 铁轨枕木问题（Honsberger） | 2D Canvas · 对角线法 / 中点法作图 |
| 陆 | 调和级数与平方倒数收缩 | 2D 双曲线图 |
| 柒 | 有理数森林（投影出全体正有理数） | 3D 实例化树林 + 2D 投影结果联动 |
| 捌 | 无限晶格 → 平面有理点 | 3D 实例化球阵 + 「正视画布」 |
| 玖 | 圆投影成标准椭圆 | 3D 圆锥截线 + 2D 逐点对应 |

## 🛠 技术栈

- **构建**：Vite 5 · React 18 · TypeScript（strict）
- **样式**：Tailwind CSS 3（零手写 CSS，仅设计令牌）
- **3D**：three.js + @react-three/fiber + @react-three/drei（OrbitControls / DragControls / instancedMesh / Line2）
- **动画**：Framer Motion（滚动进度、视口进入、章节过渡）
- **数学排版**：KaTeX（离线打包，无需网络）
- **图标**：lucide-react
- **工程化**：ESLint（flat config）+ Prettier + 路径别名 `@/` + 代码分割（每个可视化独立懒加载 chunk）

## 🚀 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 开发模式 → http://localhost:5173
npm run build    # 类型检查 + 生产构建 → dist/
npm run preview  # 预览生产构建
npm run lint     # ESLint
npm run format   # Prettier
```

Node.js ≥ 18 即可。

## 📁 项目结构

```
├── index.html
├── vite.config.ts / tsconfig*.json / tailwind.config.js / eslint.config.js
└── src/
    ├── main.tsx / App.tsx / index.css
    ├── content/chapters.ts        # 章节数据：字幕金句 + 公式 + 可视化注册表
    ├── hooks/useInView.ts         # 视口观察（懒挂载 / 离屏暂停）
    ├── lib/
    │   ├── math.ts                # 投影公式、消失点、旋转、分数工具
    │   └── colors.ts              # 全局配色令牌
    ├── components/
    │   ├── ui/
    │   │   ├── Canvas2D.tsx       # 2D 画布引擎（DPR/resize/rAF/指针）
    │   │   └── MathFormula.tsx    # KaTeX 封装
    │   ├── layout/                # Navbar / Sidebar / Hero / ChapterSection…
    │   └── viz/                   # 10 个可视化组件 + helpers（3D 共用件）
```

## 🧠 性能设计

- **懒挂载 WebGL**：每个 3D 场景仅在滚动进入视口后创建（`IntersectionObserver` + `React.lazy`），避免一次性创建 7+ 个 WebGL 上下文。
- **离屏暂停**：`frameloop={active ? 'always' : 'never'}`，章节离开视口即停止渲染。
- **实例化渲染**：有理数森林（数百棵树）与晶格球阵（数百球+圆片）使用 `InstancedMesh`，单次 draw call。
- **2D 引擎**：统一 `Canvas2D` 组件处理 DPR、ResizeObserver、指针状态与帧循环。

## 📝 版权说明

字幕内容版权归原作者（曼氏）所有；本项目仅将用户提供的字幕文件解析、重组为教学演示应用，所有引用均标注出处。

---

*保持好奇，保持思考。*
