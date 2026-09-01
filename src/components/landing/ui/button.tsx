import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-brand-500 text-white hover:bg-brand-600",
        outline: "border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50",
        secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200",
        ghost: "text-ink-900 hover:bg-ink-100",
        white: "bg-white text-ink-900 shadow-sm ring-1 ring-ink-200/60 hover:bg-ink-50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
)

type ButtonOwnProps = {
  render?: ReactElement
  children?: ReactNode
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & ButtonOwnProps

export function Button({ className, variant, size, render, type = "button", children, ...props }: ButtonProps) {
  const cls = twMerge(clsx(buttonVariants({ variant, size }), className))
  if (isValidElement(render)) {
    return cloneElement(render as never, { className: cls, ...props } as never, children)
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}