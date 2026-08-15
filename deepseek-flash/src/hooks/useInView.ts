import { useEffect, useRef, useState } from 'react'

type Options = IntersectionObserverInit & { once?: boolean }

/**
 * 观察元素是否进入视口。
 * 用于：懒挂载 WebGL 场景、章节高亮、离屏暂停动画。
 */
export function useInView<T extends Element>(options?: Options) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const optsRef = useRef<Options | undefined>(options)
  optsRef.current = options

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const { once = true, ...ioOpts } = optsRef.current ?? {}
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) io.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05, ...ioOpts },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView] as const
}
