import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as safeLookup, r as serializeSession, t as parseSignedSession } from "./session_xxGyTLZU.mjs";
import { t as lessons } from "./lession_Bjol73Em.mjs";
import { z } from "zod";
//#region src/pages/api/careers/submit-quiz.ts
var submit_quiz_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var BodySchema = z.object({
	slug: z.string(),
	answers: z.array(z.number().int())
});
var POST = async ({ request, cookies }) => {
	const session = parseSignedSession(cookies.get("user_session")?.value);
	if (!session) {
		cookies.delete("user_session", { path: "/" });
		return new Response(JSON.stringify({ error: "Session expired, please log in again" }), { status: 401 });
	}
	let body;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
	}
	const parsed = BodySchema.safeParse(body);
	if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid request shape" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const { slug, answers } = parsed.data;
	const lesson = safeLookup(lessons, slug);
	if (!lesson) return new Response(JSON.stringify({ error: "Lesson not found" }), {
		status: 404,
		headers: { "Content-Type": "application/json" }
	});
	if (!lesson.quiz || lesson.quiz.length === 0) {
		const updatedSession = {
			...session,
			phase1Completed: true
		};
		cookies.set("user_session", serializeSession(updatedSession), {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 3600 * 24 * 7
		});
		return new Response(JSON.stringify({
			success: true,
			scorePercentage: 100,
			passed: true
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	}
	if (answers.length !== lesson.quiz.length) return new Response(JSON.stringify({ error: "Answer count mismatch" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const scorePercentage = lesson.quiz.reduce((count, q, i) => count + (answers[i] === q.correctOptionIndex ? 1 : 0), 0) / lesson.quiz.length * 100;
	const passed = scorePercentage >= 70;
	if (passed) {
		const updatedSession = {
			...session,
			phase1Completed: true
		};
		cookies.set("user_session", serializeSession(updatedSession), {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: 3600 * 24 * 7
		});
	}
	return new Response(JSON.stringify({
		success: true,
		scorePercentage,
		passed
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/careers/submit-quiz@_@ts
var page = () => submit_quiz_exports;
//#endregion
export { page };
