import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { InlineMath } from "@/components/Math";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-center overflow-hidden pt-16">
      {/* backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 20%, rgba(129,140,248,0.18), transparent 60%), radial-gradient(50% 40% at 80% 30%, rgba(34,211,238,0.14), transparent 60%), radial-gradient(40% 40% at 50% 90%, rgba(244,114,182,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(70% 70% at 50% 40%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
            <span className="size-1.5 rounded-full bg-cyan-400" />
            交互式数学科普 · 由视频字幕重构
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl">
            透视与投影的
            <span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">
              世界
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
            从一个钻入原点的函数 <InlineMath tex="x\sin\tfrac{1}{x}" /> 出发，走进消失点、调和级数、有理数与圆锥曲线——
            看一张二维画布，如何精确地装下整个三维世界。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#first-principle"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
            >
              从第一性原理开始
            </a>
            <a
              href="#rational-trees"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
            >
              直接看「有理数的树林」
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        >
          <ChevronDown className="size-5 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
