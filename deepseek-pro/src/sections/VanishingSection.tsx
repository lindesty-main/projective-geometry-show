import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { ProjectionCube } from "@/components/viz/ProjectionCube";

export function VanishingSection() {
  return (
    <ChapterShell
      id="vanishing"
      index="03"
      kicker="消失点"
      title="一点、两点与三点透视"
      lead={
        <>
          <p>
            三维空间中的直线可以用一个基准点 <InlineMath tex="P_0" /> 加方向向量{" "}
            <InlineMath tex="D=(A,B,C)" /> 表示：<InlineMath tex="P(t)=P_0+tD" />。把直线上每个点都投影到画布，会出现两种情况：
          </p>
          <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-zinc-400">
            <li>
              若 <InlineMath tex="C=0" />（平行于画布），深度 <InlineMath tex="z" /> 不变，投影只是缩放平移——
              <span className="text-zinc-200">平行线依然平行</span>，且线段的等分点（中点、三等分点……）被保留。
            </li>
            <li>
              若 <InlineMath tex="C\neq 0" />，让 <InlineMath tex="t\to\infty" />，常数项可忽略，投影收敛到同一个点：
            </li>
          </ul>
        </>
      }
    >
      <div className="space-y-5">
        <BlockMath
          tex={String.raw`V_D=\left(\frac{A}{C},\frac{B}{C}\right) \quad\text{—— 消失点 (vanishing point)}`}
        />
        <p className="text-sm leading-7 text-zinc-400">
          所有方向平行的平行线，最终都奔向同一个消失点；反过来，画布上任意一个“消失点”，也唯一地决定了一组三维方向——
          二者构成<span className="text-zinc-200">一一对应</span>。这便是一点、两点、三点透视的由来：
        </p>

        <CanvasCard
          title="让立方体的三组棱依次出现消失点"
          caption="切到「消失点」，三组棱会各自汇聚（VP·x / VP·y / VP·z）。点预设可一键切换一点 / 两点 / 三点透视。"
        >
          <ProjectionCube />
        </CanvasCard>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["一点透视", "只有深度方向的一组棱不平行于画布，其余两组保持正方形，只有一个消失点。"],
            ["两点透视", "把长方体转一下，水平一组棱也不再平行画布，多出一个消失点。"],
            ["三点透视", "竖直一组棱也转一下，三组棱都不平行画布，出现三个消失点。"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <h4 className="text-sm font-semibold text-zinc-100">{t}</h4>
              <p className="mt-1.5 text-xs leading-6 text-zinc-500">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
