import * as Tabs from '@radix-ui/react-tabs'
import type { ReactNode } from 'react'

export type TabItem = {
  value: string
  label: string
  content: ReactNode
}

type SegmentedTabsProps = {
  items: TabItem[]
  value: string
  onChange: (v: string) => void
  /** 若提供，将 TabList 渲染到面板上方悬浮位置之外的自定义位置 */
  listClassName?: string
}

/** Radix Tabs 封装为分段控件样式 */
export function SegmentedTabs({ items, value, onChange, listClassName }: SegmentedTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={onChange}>
      <Tabs.List
        className={
          listClassName ??
          'absolute left-4 top-4 z-10 flex gap-1 rounded-lg border border-white/10 bg-surface/80 p-1 backdrop-blur'
        }
      >
        {items.map((item) => (
          <Tabs.Trigger
            key={item.value}
            value={item.value}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-ink-3 transition-colors hover:text-ink-2 data-[state=active]:bg-s1/20 data-[state=active]:text-ink"
          >
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.value} value={item.value} forceMount hidden={value !== item.value}>
          {item.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
