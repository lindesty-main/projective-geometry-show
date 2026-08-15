import { ChapterShell } from "@/components/ChapterShell";

export function OutroSection() {
  return (
    <ChapterShell
      id="outro"
      index="∞"
      kicker="结语"
      title="数学并不高深，它就在目之所及"
      lead={
        <p className="text-lg leading-8 text-zinc-300">
          其实数学一点都不可怕：就在我们每天目之所及的地板、树林之中，都藏着三维空间映射到眼中二维空间的奥秘。
          生活中不缺少美，更不缺少数学之美——只要保持好奇与思考。
        </p>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            t: "透视的第一性原理",
            d: "眼睛在原点、画布在 z=1，一切投影都归结为 (u,v)=(x/z, y/z)。",
          },
          {
            t: "从公式出发，推出一切",
            d: "消失点 (A/C, B/C)、铁轨的 1/n 与 1/n²、有理数的树林、圆变椭圆——全部由此公式导出。",
          },
          {
            t: "投影不可逆",
            d: "一条射线上的无数三维点被压到画布上同一点，才有了 Ames 房间与种种视错觉。",
          },
          {
            t: "树林即有理数",
            d: "每个最简分数 p/q 对应一棵高度 1/q 的树；望向晶格，就是凝视全体有理数。",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <h4 className="text-sm font-semibold text-zinc-100">{c.t}</h4>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-200">保持好奇，你也会发现有趣的知识。</p>
          <p className="mt-1 text-xs text-zinc-500">曼氏 · 一名毕业于清华姚班的人工智能博士生 · 我们下期再会</p>
        </div>
        <a
          href="#top"
          className="shrink-0 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
        >
          回到顶部 ↑
        </a>
      </div>
    </ChapterShell>
  );
}
