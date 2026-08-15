import { useMemo } from 'react'
import katex from 'katex'
import clsx from 'clsx'

type FormulaProps = {
  tex: string
  display?: boolean
  className?: string
}

/** KaTeX 数学公式渲染 */
export function Formula({ tex, display = false, className }: FormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      }),
    [tex, display],
  )

  return (
    <span
      className={clsx(display && 'my-4 block text-lg', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
