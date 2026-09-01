import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChevronDown } from "lucide-react"

type AccordionCtx = {
  openValue: string | null
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionCtx | null>(null)

function useAccordion(): AccordionCtx {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error("Accordion components must be used inside <Accordion>")
  return ctx
}

type ItemCtx = { value: string; expanded: boolean }

const ItemContext = createContext<ItemCtx | null>(null)

function useItem(): ItemCtx {
  const ctx = useContext(ItemContext)
  if (!ctx) throw new Error("AccordionItem/Trigger/Panel must be used inside <AccordionItem>")
  return ctx
}

type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  multiple?: boolean
  children?: ReactNode
}

export function Accordion({ multiple = false, className, children, ...props }: AccordionProps) {
  const [openValue, setOpenValue] = useState<string | null>(null)
  const toggle = (value: string) => setOpenValue((prev) => (prev === value ? null : value))
  return (
    <AccordionContext.Provider value={{ openValue, toggle }}>
      <div className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = HTMLAttributes<HTMLDivElement> & { value: string }

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { openValue, toggle } = useAccordion()
  const expanded = openValue === value
  return (
    <ItemContext.Provider value={{ value, expanded }}>
      <div className={twMerge(clsx("border-b border-ink-200 last:border-0", expanded && "bg-white", className))} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  )
}

type AccordionTriggerProps = Omit<HTMLAttributes<HTMLButtonElement>, "children"> & { children?: ReactNode }

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { value, expanded } = useItem()
  const { toggle } = useAccordion()
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={() => toggle(value)}
      className={twMerge(clsx("flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink-900 transition-colors hover:text-primary", className))}
      {...props}
    >
      {children}
      <ChevronDown size={16} strokeWidth={2} className={twMerge(clsx("shrink-0 text-muted-foreground transition-transform duration-200", expanded && "rotate-180"))} aria-hidden />
    </button>
  )
}

type AccordionPanelProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode }

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  const { expanded } = useItem()
  return (
    <div
      className={twMerge(
        clsx(
          "grid transition-all duration-200 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          className,
        ),
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className="pb-4">{children}</div>
      </div>
    </div>
  )
}