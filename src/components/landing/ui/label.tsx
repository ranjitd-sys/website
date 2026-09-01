import { type LabelHTMLAttributes } from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={twMerge(clsx("text-sm font-medium text-ink-900", className))} {...props} />
}