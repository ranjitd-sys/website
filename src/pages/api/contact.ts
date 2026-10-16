import type { APIRoute } from "astro"
import { z } from "zod"
import { Resend } from "resend"

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

function env(name: string): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined
  const fromMeta = (import.meta.env as unknown as Record<string, string | undefined>)?.[name]
  const value = fromProcess || fromMeta
  return value && value.length > 0 ? value : undefined
}

export const POST: APIRoute = async ({ request }) => {
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

  const apiKey = env("RESEND_API_KEY")
  if (!apiKey) {
    return json({ error: "Email is not configured yet. Please add RESEND_API_KEY." }, 500)
  }

  const to = env("INFO_EMAIL") ?? "info@deepecom.com"
  const from = env("RESEND_FROM") ?? "DeepEcom <no-reply@deepecom.com>"
  const referenceId = `DE${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`

  const numberedLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    "",
    "Message:",
    message,
    "",
    `Reference: ${referenceId}`,
    `Submitted: ${new Date().toUTCString()}`,
  ].filter(Boolean) as string[]

  const text = numberedLines.join("\n")

  const resend = new Resend(apiKey)

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New demo request — ${name}`,
      text,
      // A clean, minimal HTML version for modern email clients.
      html: `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f5f7;font-family:Inter,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e4e9;border-radius:12px;padding:24px 28px;">
      <tr><td>
        <p style="margin:0 0 4px 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#533AFD;">DeepEcom · Demo request</p>
        <h1 style="margin:0 0 16px 0;font-size:20px;line-height:1.3;font-weight:700;color:#0f172a;">New demo request — ${escapeHtml(name)}</h1>
        <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#533AFD;">${escapeHtml(email)}</a></p>
        ${phone ? `<p style="margin:0 0 6px 0;font-size:14px;line-height:1.6;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p style="margin:16px 0 6px 0;font-size:14px;line-height:1.6;"><strong>Message:</strong></p>
        <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</p>
        <hr style="border:none;border-top:1px solid #e2e4e9;margin:20px 0;" />
        <p style="margin:0;font-size:12px;color:#64748b;">Reference: ${referenceId} · ${new Date().toUTCString()}</p>
      </td></tr>
    </table>
    <p style="margin:14px auto 0;max-width:560px;font-size:12px;color:#64748b;">Hit Reply to respond directly to the sender.</p>
  </body>
</html>`,
    })

    if (result.error) {
      console.error("[contact] Resend send failed", result.error)
      return json({ error: "Failed to send your message. Please try again." }, 500)
    }

    return json({ success: true, referenceId })
  } catch (err) {
    console.error("[contact] send failed", err)
    return json({ error: "Failed to send your message. Please try again." }, 500)
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}