import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { RailroadGrid } from "@/components/viz/RailroadGrid";

export function RailroadSection() {
  return (
    <ChapterShell
      id="railroad"
      index="04"
      kicker="铁轨与棋盘格"
      title="调和级数藏在枕木里"
      lead={
        <>
          <p>
            画家在画布上画一条笔直的铁路向无限远延伸。相邻的两根枕木在画面里是两条与地平线平行的线段——那么
            <span className="text-zinc-200">下一根枕木</span>严格应该画在哪里？
          </p>
          <p>
            第一反应很容易以为是等比级数的指数收缩，但正确的答案是：枕木到地平线的距离以
            <span className="font-medium text-zinc-100">调和级数</span>{" "}
            <InlineMath tex="1/n" /> 收缩，而相邻枕木的间距以
            <span className="font-medium text-zinc-100">平方倒数</span>{" "}
            <InlineMath tex="1/n^2" /> 缩减。
          </p>
        </>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-zinc-400">
            直接用投影公式最简洁：两条铁轨在三维空间里是 <InlineMath tex="x=\pm W" />，所有枕木{" "}
            <InlineMath tex="y=1" />、等间距地分布在 <InlineMath tex="z=1,2,3,\dots" />。投影之后：
          </p>
          <BlockMath tex={String.raw`v_n=\frac{1}{n} \quad(\text{到地平线距离})`} />
          <BlockMath tex={String.raw`\Delta v=\frac{1}{n}-\frac{1}{n+1}=\frac{1}{n(n+1)}\sim\frac{1}{n^2}`} />
          <p className="text-sm leading-7 text-zinc-400">
            文艺复兴以来的画家们喜欢画国际象棋棋盘格的地面，也正是因为它在地板砖上太常见、又极具立体感——
            其背后是同一套 <InlineMath tex="1/n,\ 1/n^2" /> 的节奏。
          </p>
        </div>

        <CanvasCard
          title="铁轨：等距的枕木，调和地收缩"
          caption="左：俯视视角下等间距的枕木；右：投影到画布后，到地平线距离 ∝ 1/n、间距 ∝ 1/n²。"
        >
          <RailroadGrid />
        </CanvasCard>
      </div>
    </ChapterShell>
  );
}
