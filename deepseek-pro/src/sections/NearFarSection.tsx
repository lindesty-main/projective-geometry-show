import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { NearFar } from "@/components/viz/NearFar";

export function NearFarSection() {
  return (
    <ChapterShell
      id="near-far"
      index="02"
      kicker="尺度与信息"
      title="近大远小与不可逆"
      lead={
        <>
          <p>
            因为 <InlineMath tex="x,y" /> 都会除以深度 <InlineMath tex="z" />，投影带来了最经典的结论：
            <span className="font-medium text-zinc-100">近大远小</span>。同样的物体离得越远，{" "}
            <InlineMath tex="z" /> 越大，整体看起来就按 <InlineMath tex="1/z" /> 反比例缩小。
          </p>
          <p>
            另一个更深刻的性质是：从三维到二维的对应是
            <span className="font-medium text-zinc-100">不可逆</span>的——与原点连线在同一条直线上的所有点，都会被压到画布上同一个位置。
            正因如此，才会出现 Ames 房间这样的经典视错觉。
          </p>
        </>
      }
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <BlockMath tex={String.raw`\text{大小} \propto \frac{1}{z} \qquad (u,v)=\left(\frac{x}{z},\frac{y}{z}\right)`} />
          <p className="text-sm leading-7 text-zinc-400">
            图中五个在三维空间里<em className="not-italic text-zinc-200">同样大小</em>的正方形，放在深度{" "}
            <InlineMath tex="z=2,3,4,6,9" />，投影到画布后变成一组按{" "}
            <InlineMath tex="1/z" /> 缩小的嵌套正方形。
          </p>
          <p className="text-sm leading-7 text-zinc-400">
            拖动滑块，让一条穿过画布上某个点的射线扫过这些正方形：画布上的
            <span className="text-zinc-200">一个点</span>，对应着三维空间中整条射线上的
            <span className="text-zinc-200">无数个点</span>——这就是投影不可逆的直观含义。
          </p>
        </div>

        <CanvasCard
          title="近大远小 · 投影不可逆"
          caption="左：三维空间中五个相同大小的正方形；右：它们投影后按 1/z 缩小，一条射线上的点全部落到同一点。"
        >
          <NearFar />
        </CanvasCard>
      </div>
    </ChapterShell>
  );
}
