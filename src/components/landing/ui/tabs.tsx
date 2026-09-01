import { createContext, useContext, useState, type HTMLAttributes } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

type TabsCtx = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = createContext<TabsCtx | null>(null)

function useTabs(): TabsCtx {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>")
  return ctx
}

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
}

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const setValue = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="tablist" className={twMerge(clsx("inline-flex flex-wrap items-center gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1", className))} {...props}>
      {children}
    </div>
  )
}

type TabsTabProps = Omit<HTMLAttributes<HTMLButtonElement>, "value"> & { value: string }

export function TabsTab({ value, className, children, ...props }: TabsTabProps) {
  const { value: current, setValue } = useTabs()
  const active = current === value
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`tab-panel-${value}`}
      onClick={() => setValue(value)}
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
          active ? "bg-white text-ink-900 shadow-sm" : "text-muted-foreground hover:text-ink-900",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  )
}

type TabsPanelProps = HTMLAttributes<HTMLDivElement> & { value: string; keepMounted?: boolean }

export function TabsPanel({ value, keepMounted, className, children, ...props }: TabsPanelProps) {
  const { value: current } = useTabs()
  const active = current === value
  if (!keepMounted && !active) return null
  return (
    <div
      role="tabpanel"
      id={`tab-panel-${value}`}
      aria-hidden={!active}
      className={twMerge(clsx(className, !active && "hidden"))}
      {...props}
    >
      {children}
    </div>
  )
}