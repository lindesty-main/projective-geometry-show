import { useEffect, useState } from "react";
import { Aperture } from "lucide-react";
import { chapters } from "@/data/content";
import { cn } from "@/lib/utils";

export function Nav() {
  const [active, setActive] = useState("intro");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = chapters[0].id;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= 140) current = c.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-zinc-950">
            <Aperture className="size-4.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">
            透视与投影
            <span className="ml-2 hidden font-mono text-[11px] font-normal tracking-widest text-zinc-500 sm:inline">
              PERSPECTIVE
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {chapters.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active === c.id
                  ? "bg-white/10 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-200",
              )}
            >
              {c.nav}
            </a>
          ))}
        </nav>

        {/* progress on mobile: active chapter name */}
        <span className="text-xs font-medium text-zinc-400 lg:hidden">
          {chapters.find((c) => c.id === active)?.nav}
        </span>
      </div>
    </header>
  );
}
