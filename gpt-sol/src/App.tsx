import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, CircleDot, Github, Sigma } from 'lucide-react'
import { chapters } from './data/chapters'
import { HeroScene } from './components/HeroScene'
import { ProjectionLab } from './components/ProjectionLab'
import { SectionHeading } from './components/SectionHeading'
import { Formula } from './components/Formula'
import { VanishingStudio } from './components/VanishingStudio'
import { RationalForest } from './components/RationalForest'
import { EllipseProof } from './components/EllipseProof'

function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 30 })

  return (
    <div className="min-h-screen overflow-hidden bg-paper font-sans text-ink">
      <motion.div className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-vermilion" style={{ scaleX }} />
      <div className="noise pointer-events-none fixed inset-0 z-40" />

      <header className="relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-ink text-paper"><CircleDot size={18}/></span><span><b className="block font-serif text-lg leading-none">投影场记</b><i className="mt-1 block font-mono text-[8px] not-italic uppercase tracking-[.18em] text-ink/45">Projective field notes</i></span></a>
        <nav className="hidden items-center gap-8 text-sm text-ink/60 md:flex"><a href="#principle" className="hover:text-ink">原理</a><a href="#lab" className="hover:text-ink">实验</a><a href="#chapters" className="hover:text-ink">章节</a><a href="#finale" className="hover:text-ink">结论</a></nav>
        <a href="#lab" className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs transition hover:bg-ink hover:text-paper">打开实验台 <ArrowDownRight size={14}/></a>
      </header>

      <main id="top">
        <section className="mx-auto grid min-h-[calc(100vh-90px)] max-w-[1440px] items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:pb-24">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <div className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.2em] text-moss/65"><span className="h-px w-10 bg-moss/40"/>An interactive essay on perspective</div>
            <h1 className="font-serif text-[clamp(3.7rem,8vw,7.8rem)] leading-[.88] tracking-[-.055em]">把世界<br/><em className="text-vermilion">除以深度</em></h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-ink/62 sm:text-lg">透视不是一套绘画口诀，而是一条简单的数学映射。沿着光线、铁轨与树林，看三维世界如何被压进一张二维画布。</p>
            <div className="mt-9 flex flex-wrap items-center gap-3"><a href="#principle" className="flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm text-paper transition hover:bg-moss">从第一性原理开始 <ArrowDownRight size={16}/></a><span className="font-mono text-xs text-ink/40">约 08 分钟 · 5 个场景</span></div>
          </motion.div>
          <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.15}}><HeroScene/></motion.div>
        </section>

        <section id="principle" className="border-y border-ink/10 bg-white/35 py-24 sm:py-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <SectionHeading index="01" eyebrow="THE FIRST PRINCIPLE" title="所有透视，都从一条光线开始。" body="把眼睛放在原点，画布放在 z=1。物体上的点 P 发出的光线与画布相交于 p；相似三角形让答案变得出奇简单。"/>
            <div className="mt-16 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-ink/10 bg-paper p-7 md:col-span-2"><div className="flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/40">Universal projection formula</span><Sigma size={18} className="text-vermilion"/></div><div className="mt-14 flex flex-wrap items-baseline gap-4 font-serif text-4xl sm:text-6xl"><span className="text-ink/25">P</span><span>(x, y, z)</span><span className="text-vermilion">→</span><span className="text-moss">(x/z, y/z)</span></div><p className="mt-12 max-w-lg text-sm leading-6 text-ink/55">x、y 同时除以深度 z：这既解释了近大远小，也解释了投影为什么不可逆。</p></div>
              <div className="flex flex-col rounded-3xl bg-sun p-7"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-ink/45">Key consequence</span><p className="mt-8 font-serif text-3xl">同一条视线上，<br/>无数点只有一个像。</p><div className="mt-auto pt-12"><div className="flex justify-between border-b border-ink/15 py-3 text-sm"><span>深度</span><b>z ↑</b></div><div className="flex justify-between py-3 text-sm"><span>画面尺寸</span><b>1/z ↓</b></div></div></div>
            </div>
          </div>
        </section>

        <section id="lab" className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="02" eyebrow="THE LABORATORY" title="动手改变深度，看公式如何作画。" body="三个看似不同的视觉现象，其实共享同一台投影机器。"/>
          <div className="mt-14"><ProjectionLab/></div>
        </section>

        <section id="chapters" className="bg-ink py-24 text-paper sm:py-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <SectionHeading light index="03" eyebrow="FIVE MOVEMENTS" title="从一条公式，走到无穷远。" body="原视频的论证被重组为五个递进章节：从光学直觉到空间直线，再到可以看见的无穷与数论。"/>
            <div className="mt-16 border-t border-white/15">
              {chapters.map(({number,kicker,title,summary,formula,icon:Icon},i)=><motion.article key={number} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{delay:i*.05}} className="group grid gap-5 border-b border-white/15 py-7 transition md:grid-cols-[70px_1fr_1.2fr_auto] md:items-center md:py-8">
                <span className="font-mono text-xs text-white/35">{number}</span><div><span className="font-mono text-[9px] uppercase tracking-[.18em] text-sun/70">{kicker}</span><h3 className="mt-2 font-serif text-2xl sm:text-3xl">{title}</h3></div><p className="max-w-xl text-sm leading-6 text-white/48">{summary}</p><div className="flex items-center gap-3"><Formula dark>{formula}</Formula><span className="grid size-9 place-items-center rounded-full border border-white/15 text-white/50 transition group-hover:border-sun group-hover:text-sun"><Icon size={16}/></span></div>
              </motion.article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="04" eyebrow="VANISHING POINTS" title="消失点，是方向在画布上的名字。"/>
          <div className="mt-14"><VanishingStudio/></div>
        </section>

        <section className="border-y border-ink/10 bg-white/35 py-24 sm:py-32">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <SectionHeading index="05" eyebrow="INFINITY, PROJECTED" title="树林、晶格，与全体有理数。" body="当无限规则网格被投影，分数的分母决定了物体的高度和遮挡关系。抽象的数论获得了地景般的轮廓。"/>
            <div className="mt-14"><RationalForest/></div>
          </div>
        </section>

        <section id="finale" className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="06" eyebrow="CONIC FINALE" title="最后，把目光放回一个圆。"/>
          <div className="mt-14"><EllipseProof/></div>
        </section>

        <section className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto max-w-[1280px] border-t border-ink/15 pt-12 text-center">
            <p className="mx-auto max-w-3xl font-serif text-3xl leading-tight sm:text-5xl">“数学就在每天目之所及的<br className="hidden sm:block"/>地板与树林之中。”</p>
            <a href="#top" className="mt-10 inline-flex items-center gap-2 text-sm text-moss hover:text-vermilion">回到视点 <ArrowUpRight size={15}/></a>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10 bg-white/30 px-5 py-6 sm:px-8"><div className="mx-auto flex max-w-[1280px] flex-col gap-3 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between"><span>投影场记 · 基于字幕内容重构的互动数学叙事</span><span className="flex items-center gap-2"><Github size={13}/> React · TypeScript · SVG</span></div></footer>
    </div>
  )
}

export default App
