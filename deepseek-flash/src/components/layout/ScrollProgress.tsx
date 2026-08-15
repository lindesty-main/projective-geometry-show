import { motion, useScroll, useSpring } from 'framer-motion'

/** 顶部阅读进度条 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-amber"
      style={{ scaleX }}
    />
  )
}
