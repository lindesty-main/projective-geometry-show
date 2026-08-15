import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MathFormulaProps {
  tex: string
  block?: boolean
  className?: string
}

/** KaTeX 公式渲染（离线打包，无需网络） */
export function MathFormula({ tex, block = false, className }: MathFormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        output: 'html',
      }),
    [tex, block],
  )
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
