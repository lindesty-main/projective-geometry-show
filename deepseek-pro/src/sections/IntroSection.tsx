import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { SinusoidProjection } from "@/components/viz/SinusoidProjection";

export function IntroSection() {
  return (
    <ChapterShell
      id="intro"
      index="00"
      kicker="引子"
      title="一个钻入原点的函数"
      lead={
        <>
          <p>
            视频从 <InlineMath tex="x\sin\frac{1}{x}" /> 这个函数讲起：它在原点附近震荡得
            <em className="text-zinc-200 not-italic">越来越快</em>、振幅
            <em className="text-zinc-200 not-italic">越来越小</em>，直到“钻进原点”。
          </p>
          <p>
            但换个角度，把它看成三维空间中的景象——你会感觉自己像
            <span className="text-zinc-200">沿江而下</span>，两岸连绵的青山消失在天际。这种感觉不仅精确、严谨，还有一个名字：
            <span className="font-medium text-zinc-100">透视（perspective）</span>。
          </p>
        </>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <p className="text-sm leading-7 text-zinc-400">
            上图演示的正是这个“换角度”：在三维空间中，<InlineMath tex="x=+1" /> 与{" "}
            <InlineMath tex="x=-1" /> 两个平面上各有两条沿 <InlineMath tex="z" /> 方向延伸的正弦波浪线
            <InlineMath tex="y=\sin z" />。
          </p>
          <p className="text-sm leading-7 text-zinc-400">
            把它们投影到眼前的画布（<InlineMath tex="z=1" />）上，两条波浪线
            <span className="text-zinc-200">恰好</span>拼出了{" "}
            <InlineMath tex="y=x\sin\frac{1}{x}" />——微积分课本上那个“连续但在原点无穷震荡、不可导”的经典函数，
            竟然就是透视空间里两条平行波浪线的模样。
          </p>
          <BlockMath tex={String.raw`t=\frac{1}{u}\;\Rightarrow\; v=\frac{\sin t}{t}=u\sin\frac{1}{u}`} />
        </div>

        <CanvasCard
          title="两条波浪线 → x·sin(1/x)"
          caption="上：三维空间中的两条正弦曲线；下：它们投影到画布后形成的函数图像。"
        >
          <SinusoidProjection />
        </CanvasCard>
      </div>
    </ChapterShell>
  );
}
