// src/lib/session.ts
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { z } from "zod";

const SESSION_SECRET = import.meta.env.SESSION_SECRET; // must be exactly 32 bytes when hex-decoded
if (!SESSION_SECRET || Buffer.from(SESSION_SECRET, "hex").length !== 32) {
  throw new Error("SESSION_SECRET must be a 64-char hex string (32 bytes) for AES-256-GCM");
}
const KEY = Buffer.from(SESSION_SECRET, "hex");

export const SessionSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().nullable(),
  avatar: z.string().url(),
  token: z.string(),
  phase1Completed: z.boolean().optional(),
  selectedRepo: z.string().optional(),
  analysisStatus: z.enum(["idle", "running", "done", "error"]).optional(),
});
export type Session = z.infer<typeof SessionSchema>;

export function serializeSession(session: Session): string {
  const iv = randomBytes(12); // GCM standard nonce size
  const cipher = createCipheriv("aes-256-gcm", KEY, iv);
  const payload = Buffer.from(JSON.stringify(session), "utf-8");
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // iv.authTag.ciphertext, each base64url
  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function parseSignedSession(cookieValue: string | undefined): Session | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 3) return null;
  const [ivB64, authTagB64, cipherB64] = parts;

  try {
    const iv = Buffer.from(ivB64, "base64url");
    const authTag = Buffer.from(authTagB64, "base64url");
    const encrypted = Buffer.from(cipherB64, "base64url");

    const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(authTag); // wrong key/tampered ciphertext throws here
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    const result = SessionSchema.safeParse(JSON.parse(decrypted.toString("utf-8")));
    return result.success ? result.data : null;
  } catch {
    // Decryption/auth failure, bad base64, bad JSON, or schema mismatch —
    // all treated as "not a valid session."
    return null;
  }
}

export function safeLookup<T>(dict: Record<string, T>, key: string | undefined): T | undefined {
  if (!key || !Object.prototype.hasOwnProperty.call(dict, key)) return undefined;
  return dict[key];
}