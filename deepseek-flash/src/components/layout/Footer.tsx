const STACK = ['React 18', 'TypeScript', 'Vite', 'Three.js / R3F', 'Tailwind CSS', 'Framer Motion', 'KaTeX']

/** 页脚：致谢与工程说明 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="font-display text-lg font-bold text-white">透视与投影 · 交互式数学漫游</p>
            <p className="mt-1.5 text-[12.5px] leading-6 text-slate-500">
              本项目将科普视频《透视与投影》的字幕内容（作者：曼氏，毕业于清华姚班的人工智能博士生）自动解析为
              10 个章节，并为每个章节构建了可交互的数学可视化。字幕内容版权归原作者所有，本站仅作教学演示与学习之用。
            </p>
          </div>
          <div className="flex max-w-md flex-wrap gap-2">
            {STACK.map((s) => (
              <span key={s} className="chip text-[11px] text-slate-400">
                {s}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-8 border-t border-white/5 pt-5 text-center text-[11px] text-slate-600">
          从一条公式 (x/z, y/z) 出发，推导出整个透视世界 · 保持好奇，保持思考
        </p>
      </div>
    </footer>
  )
}
