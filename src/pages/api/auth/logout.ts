import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete("user_session", { 
    path: "/" 
  });

  return redirect("/", 302);
};