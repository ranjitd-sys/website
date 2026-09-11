import { useState, useId, type FormEvent } from "react"
import { Button } from "@/components/landing/ui/button"
import { Label } from "@/components/landing/ui/label"
import { ArrowRight, CircleCheck, Loader2 } from "lucide-react"

type FieldName = "name" | "email" | "phone" | "message"
type Errors = Partial<Record<FieldName, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Indian phone: optional +91 / 0, then 10 digits. Tolerates spaces and dashes.
const PHONE_RE = /^(?:\+?91[\s.-]?|0)?\s*[6-9]\d{9}$/

function validateField(name: FieldName, value: string): string {
  const v = value.trim()

  switch (name) {
    case "name":
      if (!v) return "Please enter your name."
      if (v.length < 2) return "Name must be at least 2 characters."
      if (v.length > 120) return "Name must be under 120 characters."
      if (!/^[\p{L}\p{M}.'\-\s]+$/u.test(v)) return "Name contains invalid characters."
      return ""
    case "email":
      if (!v) return "Please enter your email address."
      if (v.length > 254) return "Email is too long."
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address."
      return ""
    case "phone":
      if (!v) return ""
      if (v.length > 20) return "Phone number is too long."
      if (!PHONE_RE.test(v)) return "Please enter a valid 10-digit Indian phone number."
      return ""
    case "message":
      if (!v) return "Please tell us a little about your business."
      if (v.length < 10) return "Message must be at least 10 characters."
      if (v.length > 5000) return "Message must be under 5000 characters."
      return ""
  }
}

// Shared base styling for native form inputs & textarea
const fieldBaseClass =
  "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

function fieldClass(invalid: boolean) {
  return `${fieldBaseClass} ${
    invalid ? "border-red-400 focus-visible:ring-red-400" : ""
  }`
}

export default function ContactForm() {
  const [refId, setRefId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const msgId = useId()

  const setFieldError = (name: FieldName, message: string) =>
    setErrors((prev) => (message ? { ...prev, [name]: message } : { ...prev, [name]: undefined }))

  const handleBlur = (name: FieldName) => (e: { target: HTMLInputElement | HTMLTextAreaElement }) => {
    setFieldError(name, validateField(name, e.target.value))
  }

  const handleChange = (name: FieldName) => (e: { target: HTMLInputElement | HTMLTextAreaElement }) => {
    // Re-validate live only after the field has failed once, so we don't nag while typing.
    if (errors[name]) {
      setFieldError(name, validateField(name, e.target.value))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const formData = new FormData(form)
    const values: Record<FieldName, string> = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    }

    const newErrors: Errors = {}
    for (const [name, value] of Object.entries(values) as [FieldName, string][]) {
      const message = validateField(name, value)
      if (message) newErrors[name] = message
    }
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstInvalid = document.querySelector<HTMLElement>(`.invalid-field input, .invalid-field textarea`)
      firstInvalid?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, _honey: String(formData.get("_honey") ?? "") }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Apply any field-level errors returned by the server.
        const fieldIssues = data?.issues?.fieldErrors as Record<string, string[]> | undefined
        if (fieldIssues) {
          const serverErrors: Errors = {}
          for (const key of ["name", "email", "phone", "message"] as FieldName[]) {
            const messages = fieldIssues[key]
            if (messages && messages.length > 0) serverErrors[key] = messages[0]
          }
          if (Object.keys(serverErrors).length > 0) {
            setErrors(serverErrors)
            return
          }
        }
        throw new Error(data?.error ?? "Request failed")
      }

      setRefId(String(data.referenceId ?? Math.floor(100000 + Math.random() * 900000)))
    } catch {
      alert("Something went wrong sending your message. Please try again, or email us directly at info@deepecom.com.")
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
          <span className="grid size-13 shrink-0 place-items-center rounded-full border border-success-200 bg-success-50 text-success-700">
            <CircleCheck size={26} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-lg font-bold tracking-tight text-ink">Message sent</h3>
              <span className="rounded-full border border-brand-100 bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground num">
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
    <form
      noValidate
      onSubmit={handleSubmit}
      className="reveal grid gap-4.5 rounded-2xl border border-border bg-white p-6 shadow-card sm:grid-cols-2 md:p-8"
    >
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

        <div className={`flex flex-col gap-1.5${errors.name ? " invalid-field" : ""}`}>
          <Label htmlFor={nameId}>Full name</Label>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Priya Sharma"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={fieldClass(!!errors.name)}
            onBlur={handleBlur("name")}
            onChange={handleChange("name")}
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="text-xs font-medium text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`flex flex-col gap-1.5${errors.email ? " invalid-field" : ""}`}>
          <Label htmlFor={emailId}>Email</Label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="priya@yourstore.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            className={fieldClass(!!errors.email)}
            onBlur={handleBlur("email")}
            onChange={handleChange("email")}
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="text-xs font-medium text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className={`flex flex-col gap-1.5 sm:col-span-2${errors.phone ? " invalid-field" : ""}`}>
          <Label htmlFor={phoneId}>Contact number</Label>
          <input
            id={phoneId}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
            className={fieldClass(!!errors.phone)}
            onBlur={handleBlur("phone")}
            onChange={handleChange("phone")}
          />
          {errors.phone && (
            <p id={`${phoneId}-error`} className="text-xs font-medium text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        <div className={`flex flex-col gap-1.5 sm:col-span-2${errors.message ? " invalid-field" : ""}`}>
          <Label htmlFor={msgId}>Message</Label>
          <textarea
            id={msgId}
            name="message"
            rows={5}
            placeholder="Tell us about your store — channels, monthly order volume, and what you'd like to automate…"
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? `${msgId}-error` : undefined}
            className={fieldClass(!!errors.message)}
            onBlur={handleBlur("message")}
            onChange={handleChange("message")}
          />
          {errors.message && (
            <p id={`${msgId}-error`} className="text-xs font-medium text-red-600" role="alert">
              {errors.message}
            </p>
          )}
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
              <ArrowRight size={16} />
            </>
          )}
        </Button>
        <p className="-mt-2 text-center text-xs text-ink-400 sm:col-span-2">We'll never share your details. No spam, ever.</p>
    </form>
  )
}