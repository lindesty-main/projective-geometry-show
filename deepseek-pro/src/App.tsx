import { Nav } from "@/components/Nav";
import { Hero, sections } from "@/sections";

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <Nav />
      <main>
        <Hero />
        <div className="relative">
          {/* subtle section separators */}
          {sections.map(({ id, Component }) => (
            <div key={id} className="border-t border-white/[0.05]">
              <Component />
            </div>
          ))}
        </div>
      </main>
      <footer className="border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <p className="text-xs text-zinc-600">
            透视与投影的世界 · 交互式科普演示。基于一条数学科普视频的字幕内容重构。
          </p>
          <p className="font-mono text-[11px] tracking-widest text-zinc-700">
            PERSPECTIVE &amp; PROJECTION
          </p>
        </div>
      </footer>
    </div>
  );
}
