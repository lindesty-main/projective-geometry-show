import { ChapterShell } from "@/components/ChapterShell";
import { CanvasCard } from "@/components/CanvasCard";
import { InlineMath, BlockMath } from "@/components/Math";
import { ProjectionCube } from "@/components/viz/ProjectionCube";

export function FirstPrincipleSection() {
  return (
    <ChapterShell
      id="first-principle"
      index="01"
      kicker="第一性原理"
      title="投影的万能公式"
      lead={
        <>
          <p>
            假设你的眼睛在原点 <InlineMath tex="O" />，面前距离 <InlineMath tex="1" /> 处有一张画布{" "}
            <InlineMath tex="z=1" />。三维空间里任意一点 <InlineMath tex="(x,y,z)" /> 发出的光线射入眼睛，都会穿过画布，留下一个点{" "}
            <InlineMath tex="(u,v)" />。
          </p>
          <p>
            因为画布上的点所在的向量永远与物体的向量共线，而缩放比例只取决于{" "}
            <InlineMath tex="z" /> 坐标（一个是 <InlineMath tex="1" />，一个是 <InlineMath tex="z" />），所以三个坐标同时除以{" "}
            <InlineMath tex="z" />——这就是透视最基础的
            <span className="font-medium text-zinc-100">万能公式</span>，是透视的“第一性原理”。
          </p>
        </>
      }
    >
      <div className="space-y-5">
        <BlockMath
          tex={String.raw`\left(\frac{x}{z},\ \frac{y}{z}\right) \;\xrightarrow{\;在画布上建立 (u,v)\;}\; (u,v)=\left(\frac{x}{z},\frac{y}{z}\right)`}
        />

        <CanvasCard
          title="把立方体投到画布上"
          caption="左：眼睛、画布与三维立方体，以及穿过顶点的光线；右：8 个顶点经 (x/z, y/z) 后的投影。拖拽或滑动即可旋转立方体。"
        >
          <ProjectionCube />
        </CanvasCard>

        <p className="text-sm leading-7 text-zinc-500">
          你可以看到：三维立方体经过这一运算后，在二维画布上呈现的 8 个点，和我们肉眼看到的三维立方体
          <span className="text-zinc-300">一模一样</span>。接下来的一切（消失点、铁轨、有理数、椭圆……）都将从这个公式出发。
        </p>
      </div>
    </ChapterShell>
  );
}
