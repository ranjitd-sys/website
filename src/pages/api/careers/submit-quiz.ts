import type { APIRoute } from "astro"
import { z } from "zod"
import { lessons } from "@/data/lessons"
import { parseSignedSession, serializeSession, safeLookup } from "@/lib/session"

export const prerender = false

const BodySchema = z.object({
  slug: z.string(),
  answers: z.array(z.number().int()),
})

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = parseSignedSession(cookies.get("user_session")?.value)
  if (!session) {
    return new Response(JSON.stringify({ error: "Session expired, please log in again" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid request shape" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { slug, answers } = parsed.data
  const lesson = safeLookup(lessons, slug)
  if (!lesson) {
    return new Response(JSON.stringify({ error: "Lesson not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const setPhase1 = () =>
    cookies.set("user_session", serializeSession({ ...session, phase1Completed: true }), {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

  // Lessons with no quiz are auto-pass.
  if (!lesson.quiz || lesson.quiz.length === 0) {
    setPhase1()
    return new Response(JSON.stringify({ success: true, scorePercentage: 100, passed: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (answers.length !== lesson.quiz.length) {
    return new Response(JSON.stringify({ error: "Answer count mismatch" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const correctCount = lesson.quiz.reduce(
    (count, q, i) => count + (answers[i] === q.correctOptionIndex ? 1 : 0),
    0,
  )
  const scorePercentage = (correctCount / lesson.quiz.length) * 100
  const passed = scorePercentage >= 70

  if (passed) {
    setPhase1()
  }

  return new Response(JSON.stringify({ success: true, scorePercentage, passed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}