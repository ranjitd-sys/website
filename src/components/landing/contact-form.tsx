import { useState, type FormEvent } from "react"
import { Button } from "@deepecom/ui/ui/button"
import { Input } from "@deepecom/ui/ui/input"
import { Textarea } from "@deepecom/ui/ui/textarea"
import { ArrowNarrowRightIcon, CircleCheckIcon, ClockIcon, CalendarIcon,  } from "@deepecom/ui/icons"
import { Download } from "lucide-react"

const facts = [
  { icon: ClockIcon, t: "Response within one business day", d: "Real humans, no ticket black holes." },
  { icon: CalendarIcon, t: "Free guided demo", d: "See reconciliation running on sample settlements." },
  { icon: Download, t: "Migration assistance included", d: "We help import backdated settlements and map SKUs." },
]


const label = "text-[13px] font-semibold text-ink"

export default function ContactForm() {
  const [refId, setRefId] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (submitBtn) submitBtn.disabled = true

    const referenceId = Math.floor(100000 + Math.random() * 900000)
    setRefId(String(referenceId))
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
              <span className="rounded-full border border-indigo-100 bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground num">
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
          {facts.map((f) => (
            <div key={f.t} className="flex items-start gap-3.5 border-b border-subtle py-3.5 last:border-0">
              <span className="grid size-9.5 shrink-0 place-items-center rounded-xl border border-indigo-100 bg-accent text-primary">
                <f.icon  />
              </span>
              <div>
                <b className="block text-[14.5px] font-bold text-ink">{f.t}</b>
                <span className="text-[13.5px] text-muted-foreground">{f.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className="reveal grid gap-4.5 rounded-2xl border border-border bg-white p-6 shadow-card sm:grid-cols-2 md:p-8"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cName" className={label}>Full name</label>
          <Input id="cName" name="name" required placeholder="Priya Sharma" autoComplete="name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cEmail" className={label}>Email</label>
          <Input id="cEmail" name="email" type="email" required placeholder="priya@yourstore.com" autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="cPhone" className={label}>Contact number</label>
          <Input id="cPhone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="cMsg" className={label}>Message</label>
          <Textarea
            id="cMsg"
            name="message"
            required
            rows={5}
            placeholder="Tell us about your store — channels, monthly order volume, and what you'd like to automate…"
          />
        </div>
        <Button type="submit" size="lg" className="gap-2 sm:col-span-2">
          Submit
          <ArrowNarrowRightIcon size={16} />
        </Button>
        <p className="-mt-2 text-center text-xs text-zinc-400 sm:col-span-2">We'll never share your details. No spam, ever.</p>
      </form>
    </>
  )
}
