import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from "node:crypto"
import { z } from "zod"

const SESSION_SECRET = import.meta.env.SESSION_SECRET
const ADMIN_PASSWORD: string | undefined = import.meta.env.SEO_DASHBOARD_PASSWORD

export const ADMIN_COOKIE = "admin_session"
export const SESSION_TTL_S = 60 * 60 * 24 * 7

const KEY: Buffer | null =
  SESSION_SECRET && Buffer.from(SESSION_SECRET, "hex").length === 32 ? Buffer.from(SESSION_SECRET, "hex") : null

const AdminTokenSchema = z.object({
  role: z.literal("admin"),
  iat: z.number(),
})

export function checkAdminPassword(candidate: string): boolean {
  if (!ADMIN_PASSWORD || !candidate) return false
  const a = Buffer.from(candidate, "utf-8")
  const b = Buffer.from(ADMIN_PASSWORD, "utf-8")
  if (a.length !== b.length) {
    timingSafeEqual(Buffer.alloc(32), Buffer.alloc(32))
    return false
  }
  return timingSafeEqual(a, b)
}

export function createAdminToken(): string {
  if (!KEY) {
    throw new Error("SESSION_SECRET must be a 64-char hex string (32 bytes) for AES-256-GCM")
  }
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", KEY, iv)
  const payload = Buffer.from(JSON.stringify({ role: "admin", iat: Date.now() } satisfies z.infer<typeof AdminTokenSchema>), "utf-8")
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()])
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".")
}

export function verifyAdminToken(cookieValue: string | undefined): boolean {
  if (!cookieValue || !KEY) return false
  const parts = cookieValue.split(".")
  if (parts.length !== 3) return false
  const [ivB64, authTagB64, cipherB64] = parts as [string, string, string]
  try {
    const decipher = createDecipheriv("aes-256-gcm", KEY, Buffer.from(ivB64, "base64url"))
    decipher.setAuthTag(Buffer.from(authTagB64, "base64url"))
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(cipherB64, "base64url")),
      decipher.final(),
    ])
    const parsed = AdminTokenSchema.safeParse(JSON.parse(decrypted.toString("utf-8")))
    if (!parsed.success) return false
    return Date.now() - parsed.data.iat < SESSION_TTL_S * 1000
  } catch {
    return false
  }
}
