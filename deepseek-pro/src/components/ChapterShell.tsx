import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChapterShellProps {
  id: string;
  index: string;
  kicker: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/** Consistent full-bleed section wrapper for every chapter. */
export function ChapterShell({ id, index, kicker, title, lead, children, className }: ChapterShellProps) {
  return (
    <section id={id} className={cn("relative scroll-mt-20 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-8 max-w-3xl sm:mb-12"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-indigo-400/80">
              {index}
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-indigo-400/60 to-transparent" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {kicker}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            {title}
          </h2>
          {lead ? (
            <div className="mt-4 space-y-3 text-[15px] leading-7 text-zinc-400">{lead}</div>
          ) : null}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
