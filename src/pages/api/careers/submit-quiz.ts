import type { APIRoute } from "astro";
import { z } from "zod";
import { lessons } from "@/data/lession";
import { parseSignedSession, serializeSession, safeLookup } from "@/lib/session";

const BodySchema = z.object({
  slug: z.string(),
  answers: z.array(z.number().int()),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = parseSignedSession(cookies.get("user_session")?.value);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request shape" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { slug, answers } = parsed.data;
  //@ts-ignore
  const lesson = safeLookup(lessons, slug);
  if (!lesson) {
    return new Response(JSON.stringify({ error: "Lesson not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Lessons with no quiz are auto-pass.
  if (!lesson.quiz || lesson.quiz.length === 0) {
    const updatedSession = { ...session, phase1Completed: true };
    cookies.set("user_session", serializeSession(updatedSession), {
      path: "/", httpOnly: true, secure: import.meta.env.PROD,
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7,
    });
    return new Response(JSON.stringify({ success: true, scorePercentage: 100, passed: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }

  if (answers.length !== lesson.quiz.length) {
    return new Response(JSON.stringify({ error: "Answer count mismatch" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const correctCount = lesson.quiz.reduce(
    (count: number, q: any, i: number) => count + (answers[i] === q.correctOptionIndex ? 1 : 0),
    0,
  );
  const scorePercentage = (correctCount / lesson.quiz.length) * 100;
  const passed = scorePercentage >= 70;

  if (passed) {
    const updatedSession = { ...session, phase1Completed: true };
    cookies.set("user_session", serializeSession(updatedSession), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return new Response(JSON.stringify({ success: true, scorePercentage, passed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};