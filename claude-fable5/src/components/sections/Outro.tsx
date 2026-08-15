import { motion } from 'framer-motion'
import { Eye, GitFork, Infinity as InfinityIcon } from 'lucide-react'

const TAKEAWAYS = [
  {
    icon: Eye,
    title: '一个公式',
    text: '(x, y, z) ↦ (x/z, y/z)。近大远小、消失点、调和级数、椭圆 —— 全部由它推出。',
  },
  {
    icon: GitFork,
    title: '两种视角',
    text: '同一个对象，2D 是课本怪函数，3D 是两岸青山；直觉与严格证明可以互相成就。',
  },
  {
    icon: InfinityIcon,
    title: '无穷藏在眼前',
    text: '树林是全体正有理数，铁轨是调和级数 —— 无穷不在远方，就在目之所及。',
  },
]

export function Outro() {
  return (
    <footer className="border-t border-white/8 bg-panel/40">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-(family-name:--font-serif-sc) text-2xl font-bold leading-relaxed md:text-3xl">
            「生活中不缺少美，
            <br />
            更不缺少<span className="text-s1">数学之美</span>。」
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-3">
            数学一点都不可怕，也没有那么高深。每天目之所及的地板、树林之中，
            都藏着三维空间映射到眼中二维画面的奥秘。只要保持好奇和思考，你也会发现有趣的知识。
          </p>
        </motion.blockquote>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {TAKEAWAYS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-panel p-6"
            >
              <item.icon className="mb-3 size-5 text-s1" aria-hidden />
              <h3 className="mb-2 text-sm font-semibold text-ink">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink-3">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-14 text-center text-xs leading-relaxed text-ink-3">
          内容改编自科普视频字幕 · 原作者：漫士 —— 一名毕业于清华姚班的人工智能博士生
        </p>
      </div>
    </footer>
  )
}
