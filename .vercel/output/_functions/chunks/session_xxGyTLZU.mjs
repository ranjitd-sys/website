import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { z } from "zod";
//#region src/lib/session.ts
var SESSION_SECRET = "1f6f1a45d13af8f5134ecb695e54dc6a7547df5c50ffc343d60f0141aab6af83";
console.log("Secre", SESSION_SECRET);
if (Buffer.from(SESSION_SECRET, "hex").length !== 32) throw new Error("SESSION_SECRET must be a 64-char hex string (32 bytes) for AES-256-GCM");
var KEY = Buffer.from(SESSION_SECRET, "hex");
var SessionSchema = z.object({
	id: z.number(),
	login: z.string(),
	name: z.string().nullable(),
	avatar: z.string().url(),
	token: z.string(),
	phase1Completed: z.boolean().optional(),
	selectedRepo: z.string().optional(),
	analysisStatus: z.enum([
		"idle",
		"running",
		"done",
		"error"
	]).optional()
});
function serializeSession(session) {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", KEY, iv);
	const payload = Buffer.from(JSON.stringify(session), "utf-8");
	const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);
	const authTag = cipher.getAuthTag();
	return [
		iv.toString("base64url"),
		authTag.toString("base64url"),
		encrypted.toString("base64url")
	].join(".");
}
function parseSignedSession(cookieValue) {
	if (!cookieValue) {
		console.log("[session] no cookie value received");
		return null;
	}
	const parts = cookieValue.split(".");
	if (parts.length !== 3) {
		console.log("[session] cookie malformed, parts:", parts.length);
		return null;
	}
	const [ivB64, authTagB64, cipherB64] = parts;
	try {
		const iv = Buffer.from(ivB64, "base64url");
		const authTag = Buffer.from(authTagB64, "base64url");
		const encrypted = Buffer.from(cipherB64, "base64url");
		const decipher = createDecipheriv("aes-256-gcm", KEY, iv);
		decipher.setAuthTag(authTag);
		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		const result = SessionSchema.safeParse(JSON.parse(decrypted.toString("utf-8")));
		if (!result.success) console.log("[session] schema validation failed:", result.error.flatten());
		return result.success ? result.data : null;
	} catch (err) {
		console.log("[session] decrypt/parse threw:", err);
		return null;
	}
}
function safeLookup(dict, key) {
	if (!key || !Object.prototype.hasOwnProperty.call(dict, key)) return void 0;
	return dict[key];
}
//#endregion
export { safeLookup as n, serializeSession as r, parseSignedSession as t };
