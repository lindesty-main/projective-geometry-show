import katex from "katex";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function InlineMath({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: false }),
    [tex],
  );
  return <span className={cn("whitespace-nowrap", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function BlockMath({ tex, className }: { tex: string; className?: string }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: true }),
    [tex],
  );
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
