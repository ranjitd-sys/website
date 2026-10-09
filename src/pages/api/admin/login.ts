import type { APIRoute } from "astro"
import { ADMIN_COOKIE, SESSION_TTL_S, checkAdminPassword, createAdminToken } from "@/lib/admin-auth"

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData().catch(() => null)
  const password = String(form?.get("password") ?? "")

  if (!checkAdminPassword(password)) {
    return redirect("/admin/login?error=1", 303)
  }

  cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: SESSION_TTL_S,
  })

  return redirect("/admin/seo", 303)
}
