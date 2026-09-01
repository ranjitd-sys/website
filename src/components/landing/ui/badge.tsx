import { type HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-5 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-ink-100 text-ink-600",
        outline: "border border-ink-200 text-ink-600",
        success: "bg-success-50 text-success-600",
        warning: "bg-warning-50 text-warning-600",
        error: "bg-danger-50 text-danger-600",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={twMerge(clsx(badgeVariants({ variant }), className))} {...props} />
}