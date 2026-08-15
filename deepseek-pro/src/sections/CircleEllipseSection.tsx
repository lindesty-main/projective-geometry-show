import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { CircleEllipse } from "@/components/viz/CircleEllipse";

export function CircleEllipseSection() {
  return (
    <ChapterShell
      id="circle-ellipse"
      index="06"
      kicker="圆锥曲线"
      title="圆投影之后，真的是椭圆"
      lead={
        <>
          <p>
            一个圆形（或球形）投影之后，真的还是一个标准的椭圆吗？答案是肯定的——而且可以用投影公式直接验证：
            设空间圆的参数方程，投影后的坐标满足一个可配方的二次方程，恰好化为标准椭圆。
          </p>
          <p>
            另一个更直观的证明，来自高中课本的
            <span className="text-zinc-200">丹德林双球法</span>的逆向运用：斜着切圆锥会截出一个标准椭圆；
            把顶点当眼睛、垂直于中轴的截面当画布，就变成“物体—眼睛—画布”的投影过程。
          </p>
        </>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-zinc-400">
            用“压缩/拉伸”逆向思考：把圆和椭圆都沿 <InlineMath tex="YZ" /> 平面切成细条，每个细条都在均匀缩放。
            压到恰到好处的那一刻，原来的椭圆恰好变成圆、圆则变成椭圆——于是“圆在画布上投影”就等价于“斜切圆锥得椭圆”。
          </p>
          <p className="text-sm leading-7 text-zinc-400">
            仔细端详还会发现：因为一开始椭圆的中心并不在圆锥中轴上，投影后
            <span className="text-zinc-200">圆的中心并不是画面里椭圆的正中心</span>，总是会偏上一些。
          </p>
          <BlockMath tex={String.raw`x^2+3y^2-4y+1=0 \;\Rightarrow\; \text{配方得标准椭圆}`} />
        </div>

        <CanvasCard
          title="倾斜的圆 → 投影成椭圆"
          caption="左：眼睛、画布与倾斜的圆，光锥在画布上切出椭圆；右：投影结果与「若平行于画布」的正圆对比，注意椭圆中心偏上。"
        >
          <CircleEllipse />
        </CanvasCard>
      </div>
    </ChapterShell>
  );
}
