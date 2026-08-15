import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { FordCircles } from "@/components/viz/FordCircles";

export function RationalSection() {
  return (
    <ChapterShell
      id="rational-trees"
      index="05"
      kicker="有理数"
      title="凝视一片树林，就是凝视全体有理数"
      lead={
        <>
          <p>
            你可能站在过一整片树林前，却未必意识到：此时此刻，你正在以最直观的方式凝视
            <span className="font-medium text-zinc-100">全体正有理数</span>。
          </p>
          <p>
            取出 <InlineMath tex="0\sim1" /> 之间所有最简分数 <InlineMath tex="p/q" />，在每个{" "}
            <InlineMath tex="p/q" /> 的位置向上、向下各长出一段长度为 <InlineMath tex="1/q" /> 的线段：
            在 <InlineMath tex="1/2" /> 处长出长度 <InlineMath tex="1/2" /> 的线段，在{" "}
            <InlineMath tex="1/3,2/3" /> 处长出 <InlineMath tex="1/3" />，在{" "}
            <InlineMath tex="1/5,\dots,4/5" /> 处长出 <InlineMath tex="1/5" />……推到无穷，就得到和树林一模一样的景象。
          </p>
        </>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-zinc-400">
            证明同样来自投影公式：在三维网格 <InlineMath tex="(J-I,\,1,\,J+I)" /> 的位置种下一棵高为{" "}
            <InlineMath tex="1" /> 的树，投影后位于
          </p>
          <BlockMath tex={String.raw`\left(\frac{J-I}{J+I},\ \frac{1}{J+I}\right)`} />
          <p className="text-sm leading-7 text-zinc-400">
            把 <InlineMath tex="I+J" /> 相同的数分为一组，高度都是 <InlineMath tex="1/(I+J)" />——
            与“在 <InlineMath tex="p/q" /> 处长出高度 <InlineMath tex="1/q" />”如出一辙。
            若一个分数不是最简分数，它的线段会更矮、且位置相同，于是被最简分数的那棵树
            <span className="text-zinc-200">完全挡住</span>——一切丝丝入扣。
          </p>
          <p className="text-sm leading-7 text-zinc-400">
            把树换成同样大小的三维晶格小球，投影后半径按 <InlineMath tex="1/z" /> 缩减：半径越大，意味着这个有理数越“简单”。
          </p>
        </div>

        <CanvasCard
          title="有理数的树林 / 晶格圆"
          caption="每个最简分数 p/q 处，长出一棵高度（或半径）为 1/q 的树。悬停可查看分数。"
        >
          <FordCircles />
        </CanvasCard>
      </div>
    </ChapterShell>
  );
}
