import { Section, Prose, Callout } from '@/components/ui/Section'
import { Formula } from '@/components/ui/Formula'
import { CubeProjectionDemo } from '@/components/demos/CubeProjectionDemo'
import { SinScapeDemo } from '@/components/demos/SinScapeDemo'
import { IrreversibleDemo } from '@/components/demos/IrreversibleDemo'
import { VanishingPointDemo } from '@/components/demos/VanishingPointDemo'
import { RailroadDemo } from '@/components/demos/RailroadDemo'
import { OrchardDemo } from '@/components/demos/OrchardDemo'
import { EllipseDemo } from '@/components/demos/EllipseDemo'

export function FormulaSection() {
  return (
    <Section
      id="formula"
      index={1}
      eyebrow="First Principle"
      title="透视的万能公式"
      subtitle="整个透视的第一性原理，只需要一次相似三角形。"
    >
      <Prose>
        <p>
          想象你的眼睛是原点，面前距离为 1 的地方立着一张画布（z = 1 平面）。三维空间里任何一点 (x, y, z)
          发出的光线射入眼睛，都会穿过画布，留下一个点 (u, v)。画布上的点与物体的点永远共线，
          而缩放比例只看 z 坐标 —— 一个是 1，一个是 z：
        </p>
        <Formula display tex="(x,\; y,\; z) \;\longmapsto\; (u,\; v) = \left(\frac{x}{z},\; \frac{y}{z}\right)" />
        <p>接下来，我们将从这一个公式出发，推导并理解透视中的一切。</p>
      </Prose>
      <CubeProjectionDemo />
    </Section>
  )
}

export function SinSection() {
  return (
    <Section
      id="sin"
      index={2}
      eyebrow="A Familiar Landscape"
      title="课本怪函数，原是两岸青山"
      subtitle="视频开头的似曾相识，是严格的数学投影对应。"
    >
      <Prose>
        <p>
          在三维空间里「真的搞出山来」：取两条正弦曲线，分别位于 x = ±1 的平面内，沿 z 轴方向满足 y = sin z。
          曲线上点的参数方程是 (±1, sin τ, τ)。代入万能公式：
        </p>
        <Formula
          display
          tex="u = \pm\frac{1}{\tau},\quad v = \frac{\sin \tau}{\tau} \;\;\xRightarrow{\;\tau = \pm 1/u\;}\;\; v = u \cdot \sin\frac{1}{u}"
        />
        <p>
          微积分课本上那个「连续、但在原点处无穷震荡不可导」的经典函数，
          竟然真的就是透视空间里两条平行的波浪线在我们眼中的模样。
        </p>
      </Prose>
      <SinScapeDemo />
    </Section>
  )
}

export function IrreversibleSection() {
  return (
    <Section
      id="irreversible"
      index={3}
      eyebrow="Lossy by Nature"
      title="近大远小，且不可逆"
      subtitle="x、y 都要除以深度 z —— 由此立刻得到两个经典结论。"
    >
      <Prose>
        <p>
          <strong className="text-ink">近大远小</strong>：同样的物体离得越远，z 越大，
          看起来的大小按 1/z 反比例缩小。
        </p>
        <p>
          <strong className="text-ink">不可逆</strong>：从三维到二维的对应会丢失信息 ——
          与原点连线共线的所有点，都被压到画布上的同一个位置。你眼中的一个正方形，反向射出四条射线，
          空间中的四个顶点可以在射线上任意跑动，投影后看起来都是同一个正方形。
        </p>
      </Prose>
      <IrreversibleDemo />
      <Callout>
        利用这种不可逆性，产生了许多经典视错觉与魔术。最著名的是{' '}
        <strong className="text-ink">艾姆斯房间（Ames Room）</strong>：看似正常的房间其实左侧深得多，
        人走到左边显得很小，走到右边却显得很大。
      </Callout>
    </Section>
  )
}

export function VanishingSection() {
  return (
    <Section
      id="vanishing"
      index={4}
      eyebrow="Vanishing Points"
      title="消失点：平行线奔向何方"
      subtitle="为什么有时平行线依然平行，有时却汇聚一点？"
    >
      <Prose>
        <p>
          三维空间中的直线可以写成定点 P₀ 加方向向量 D 的任意实数倍：P₀ + tD，其中 P₀ = (x₀, y₀, z₀)，D
          = (a, b, c)。把直线上每个点都投影到画布上：
        </p>
        <Formula
          display
          tex="\left(\frac{x_0 + at}{z_0 + ct},\; \frac{y_0 + bt}{z_0 + ct}\right) \;\xrightarrow{\;t \to \infty\;}\; \left(\frac{a}{c},\; \frac{b}{c}\right) \quad (c \neq 0)"
        />
        <p>
          若 c = 0，直线平行于画布，投影只是简单的缩放平移 —— 平行线依然平行，中点仍是中点，
          三等分点仍是三等分点。而当 c ≠ 0，横纵坐标依然满足线性方程（直线投影后还是直线），
          但当 t 趋于无穷，所有常数都变得不重要，整条直线收敛到一个点 (a/c, b/c) ——{' '}
          <strong className="text-ink">消失点</strong>。
        </p>
        <p>
          更有意思的是，消失点与直线方向构成一一对应：每一组空间中的平行线对应同一个消失点；反过来，
          画面上连向同一个消失点的直线，在三维空间中全部同向。文艺复兴时期，
          艺术家们开始认真地用数学严格绘画，便有了大量单点透视的作品。
        </p>
      </Prose>
      <VanishingPointDemo />
    </Section>
  )
}

export function RailroadSection() {
  return (
    <Section
      id="railroad"
      index={5}
      eyebrow="A Thought Experiment"
      title="下一根枕木画在哪里？"
      subtitle="一望无际的平原上，铁路向无限远延伸 —— 请严格作图。"
    >
      <Prose>
        <p>
          画家已画出两根相邻的枕木（画面上两条与地平线平行的线段），下一根应该画在哪里？
          古典做法：俯瞰时每格铁轨的对角线互相平行，所以它们共享一个消失点，且该消失点落在地平线上 ——
          连接对角线消失点即可倒推出下一根枕木。
        </p>
        <p>
          而坐标计算一步到位。设铁轨在 x = ±w、地面 y = −1，枕木位于 z = 1, 2, 3, …，投影后第 n 根枕木的纵坐标：
        </p>
        <Formula
          display
          tex="v_n = -\frac{1}{n}, \qquad v_{n} - v_{n+1} = \frac{1}{n(n+1)} \sim \frac{1}{n^2}"
        />
        <p>
          枕木到地平线的距离按<strong className="text-ink">调和级数 1/n</strong> 收缩，
          相邻间距按<strong className="text-ink">平方倒数 1/n²</strong> 衰减 ——
          第一反应中的「等比级数指数收缩」是错的。古人用相似三角形几何推导，
          有了坐标系之后只需一行代数。
        </p>
      </Prose>
      <RailroadDemo />
    </Section>
  )
}

export function OrchardSection() {
  return (
    <Section
      id="orchard"
      index={6}
      eyebrow="Euclid's Orchard"
      title="望向树林，凝视全体正有理数"
      subtitle="站在一整片树林前，你正在以最直观的方式凝视所有有理数。"
    >
      <Prose>
        <p>
          俯视 xz 平面，选网格基底 (1, 1) 与 (−1, 1)，网格点落在 (j−i, j+i)。在每个网格点种一棵高度为 1 的树，
          树顶投影后落在：
        </p>
        <Formula
          display
          tex="(j-i,\; 1,\; j+i) \;\longmapsto\; \left(\frac{j-i}{j+i},\; \frac{1}{j+i}\right)"
        />
        <p>
          这恰好就是「在每个最简分数 q/p 的位置长出一根高度 1/p 的线段」。若分数不是最简的，
          它的树会与最简分数的树位置完全相同、但更矮 —— 被完全挡住。同理还可以在三维整点放上同样大小的小球：
          投影后圆心在 (x/z, y/z)，半径缩小 z 倍，于是半径的大小直接告诉你这个有理数有多「简洁」。
        </p>
      </Prose>
      <OrchardDemo />
    </Section>
  )
}

export function EllipseSection() {
  return (
    <Section
      id="ellipse"
      index={7}
      eyebrow="The Classic Debate"
      title="圆投影后，真是标准椭圆吗？"
      subtitle="一个经典「吵架问题」的两种证明。"
    >
      <Prose>
        <p>
          代数做法：设空间圆 (cos t, 1, sin t + 2)，投影后运用出色的注意力，你会发现坐标满足 x² + 3y² − 4y + 1 =
          0，配方即得标准椭圆方程：
        </p>
        <Formula display tex="x^2 + 3\left(y - \tfrac{2}{3}\right)^2 = \tfrac{1}{3}" />
        <p>
          更直观的做法来自高中「丹德林双球」的逆向运用：斜切圆锥截出标准椭圆；把圆锥顶点当作眼睛、
          垂直于中轴的截面当作画布，这正是一次透视投影 —— 说明椭圆在特定条件下投影成正圆。
          再把所有点的 y 坐标均匀压缩：圆与椭圆都在做各自坐标系下的均匀拉伸，压到恰到好处的时刻，
          原来的椭圆刚好变成圆、圆变成椭圆 —— 于是任何圆的投影都是标准椭圆，证明完毕。
        </p>
      </Prose>
      <EllipseDemo />
      <Callout>
        细节控的彩蛋：最初椭圆的中心并不在圆锥中轴上，压缩后依然不在 ——
        所以<strong className="text-ink">圆心的投影永远不是画面中椭圆的正中心</strong>，总会偏向一侧。
        这也是为什么画面边缘的球看起来「不太圆」。
      </Callout>
    </Section>
  )
}
