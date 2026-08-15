import { useEffect, useState } from 'react'
import { CHAPTERS } from '@/content/chapters'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Hero } from '@/components/layout/Hero'
import { ChapterSection } from '@/components/layout/ChapterSection'
import { Outro } from '@/components/layout/Outro'
import { Footer } from '@/components/layout/Footer'

export default function App() {
  const [activeId, setActiveId] = useState(CHAPTERS[0].id)

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]
        if (top) setActiveId(top.target.getAttribute('data-chapter') ?? '')
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
      <ScrollProgress />
      <Navbar activeId={activeId} />
      <Sidebar activeId={activeId} />
      <main>
        {/* 首屏全宽 */}
        <Hero />
        {/* 章节内容（xl 以上为侧边栏让位） */}
        <div className="xl:pl-60">
          {CHAPTERS.map((c, i) => (
            <ChapterSection key={c.id} chapter={c} index={i} />
          ))}
          <Outro />
        </div>
      </main>
      <div className="xl:pl-60">
        <Footer />
      </div>
    </div>
  )
}
