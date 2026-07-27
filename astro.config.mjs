import { defineConfig, fontProviders } from "astro/config"
import { fileURLToPath } from "node:url"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import mdx from "@astrojs/mdx"
const GoogleFontProvider = fontProviders.google()
export default defineConfig({
    site: "http://localhost:4321",
    output:"server",
   
     fonts: [
    {
      provider: GoogleFontProvider,
      name: "Inter",
      weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      cssVariable: "--font-inter",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      provider: GoogleFontProvider,
      name: "JetBrains Mono",
      weights: ["300", "400", "500", "600", "700"],
      display: "swap",
      cssVariable: "--font-jetbrains-mono",
      fallbacks: ["ui-monospace", "SFMono-Regular", "monospace"],
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
  integrations: [react(), mdx()],
  // ...fonts, etc.
})