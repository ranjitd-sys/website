import type { APIRoute } from "astro"
import { z } from "zod"
import nodemailer from "nodemailer"

export const prerender = false

const NAME_RE = /^[\p{L}\p{M}.'\-\s]+$/u
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(?:\+?91[\s.-]?|0)?\s*[6-9]\d{9}$/

const BodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name must be under 120 characters.")
    .regex(NAME_RE, "Name contains invalid characters."),
  email: z
    .string()
    .trim()
    .min(5, "Please enter your email address.")
    .max(254, "Email is too long.")
    .regex(EMAIL_RE, "Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .refine((v) => v === "" || PHONE_RE.test(v), "Please enter a valid 10-digit Indian phone number.")
    .default(""),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5000 characters."),
  _honey: z.string().optional(),
})

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export const POST: APIRoute = async ({ request }) => {
  const host = import.meta.env.SMTP_HOST
  const port = Number(import.meta.env.SMTP_PORT ?? 587)
  const user = import.meta.env.SMTP_USER
  const pass = import.meta.env.SMTP_PASS
  const from = import.meta.env.SMTP_FROM ?? user
  const to = import.meta.env.INFO_EMAIL ?? "info@deepecom.com"

  if (!host || !user || !pass) {
    return json({ error: "Email is not configured yet. Please configure SMTP settings." }, 500)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: "Invalid JSON body" }, 400)
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: "Invalid form data", issues: parsed.error.flatten() }, 400)
  }

  const { name, email, phone, message, _honey } = parsed.data

  // Honeypot — silently accept bot submissions without sending.
  if (_honey && _honey.length > 0) {
    return json({ success: true, referenceId: `HP-${Math.floor(100000 + Math.random() * 900000)}` })
  }

  const referenceId = `DE${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  })

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `New demo request — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        "",
        "Message:",
        message,
        "",
        `Reference: ${referenceId}`,
        `Submitted: ${new Date().toUTCString()}`,
      ]
        .filter(Boolean)
        .join("\n"),
    })

    return json({ success: true, referenceId })
  } catch (err) {
    console.error("[contact] send failed", err)
    return json({ error: "Failed to send your message. Please try again." }, 500)
  }
}