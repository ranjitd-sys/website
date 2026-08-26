import { useState, useId, type FormEvent } from "react"
import { Button } from "@deepecom/ui/ui/button"
import { Label } from "@deepecom/ui/ui/label"
import {
  ArrowNarrowRightIcon,
  CircleCheckIcon,
  ClockIcon,
  CalendarIcon,
} from "@deepecom/ui/icons"
import { Download, Loader2 } from "lucide-react"

const FACTS = [
  {
    icon: ClockIcon,
    title: "Response within one business day",
    desc: "Real humans, no ticket black holes.",
  },
  {
    icon: CalendarIcon,
    title: "Free guided demo",
    desc: "See reconciliation running on sample settlements.",
  },
  {
    icon: Download,
    title: "Migration assistance included",
    desc: "We help import backdated settlements and map SKUs.",
  },
] as const

// Shared base styling for native form inputs & textarea
const fieldBaseClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export default function ContactForm() {
  const [refId, setRefId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const msgId = useId()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const referenceId = Math.floor(100000 + Math.random() * 900000)
      setRefId(String(referenceId))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (refId !== null) {
    return (
      <div
        className="rounded-2xl border border-border bg-white p-8 shadow-card"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4 sm:items-center">
          <span className="grid size-13 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CircleCheckIcon size={26} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-bold tracking-tight text-ink">Message sent</h3>
              <span className="rounded-full border border-blue-100 bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground num">
                #{refId}
              </span>
            </div>
            <p className="mt-1 text-sm/relaxed text-muted-foreground">
              We'll reply within 1 business day.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="reveal">
        <span className="eyebrow">Contact us</span>
        <h2 className="h2 mt-1">Get in touch.</h2>
        <p className="lead mt-4 max-w-xl">
          Do you need help with something, or have questions about a feature? Tell us about your store and
          we'll show you exactly how DeepEcom fits your workflow.
        </p>
        <div className="mt-9">
          {FACTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5 border-b border-subtle py-3.5 last:border-0">
              <span className="grid size-9.5 shrink-0 place-items-center rounded-xl border border-blue-100 bg-accent text-primary">
                <Icon size={18} />
              </span>
              <div>
                <strong className="block text-[14.5px] font-bold text-ink">{title}</strong>
                <span className="text-[13.5px] text-muted-foreground">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="reveal grid gap-4.5 rounded-2xl border border-border bg-white p-6 shadow-card sm:grid-cols-2 md:p-8"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={nameId}>Full name</Label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            placeholder="Priya Sharma"
            autoComplete="name"
            className={`${fieldBaseClass} h-10`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={emailId}>Email</Label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            placeholder="priya@yourstore.com"
            autoComplete="email"
            className={`${fieldBaseClass} h-10`}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={phoneId}>Contact number</Label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={`${fieldBaseClass} h-10`}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor={msgId}>Message</Label>
          <textarea
            id={msgId}
            name="message"
            required
            rows={5}
            placeholder="Tell us about your store — channels, monthly order volume, and what you'd like to automate…"
            className={fieldBaseClass}
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="gap-2 sm:col-span-2">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Sending...
            </>
          ) : (
            <>
              Submit
              <ArrowNarrowRightIcon size={16} />
            </>
          )}
        </Button>
        <p className="-mt-2 text-center text-xs text-zinc-400 sm:col-span-2">We'll never share your details. No spam, ever.</p>
      </form>
    </>
  )
}