import { defineConfig, fontProviders } from "astro/config"
import { fileURLToPath } from "node:url"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import vercel from "@astrojs/vercel"


const GoogleFontProvider = fontProviders.google()

export default defineConfig({
  site: "https://deepecom-app.vercel.app/",
   output: "server",
  adapter: vercel(),
  fonts: [
    {
      provider: GoogleFontProvider,
      name: "Geist",
      weights: ["400", "500", "600", "700"],
      cssVariable: "--font-geist",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: GoogleFontProvider,
      name: "IBM Plex Sans",
      weights: ["400", "500", "600", "700"],
      display: "swap",
      cssVariable: "--font-plex",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@/": fileURLToPath(new URL("./src/", import.meta.url)),
      },
    },
  },

  integrations: [react(), mdx(), sitemap()],
})