import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** A framed, titled panel used to present the interactive diagrams. */
export function CanvasCard({
  title,
  caption,
  children,
  className,
  controls,
}: {
  title?: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
  controls?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm",
        className,
      )}
    >
      {(title || caption) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
            )}
            {caption && (
              <div className="mt-0.5 text-xs text-zinc-500">{caption}</div>
            )}
          </div>
          {controls && <div className="flex items-center gap-2">{controls}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
