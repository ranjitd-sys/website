import type { APIRoute } from "astro"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import React from "react"

export const prerender = true

const WIDTH = 1200
const HEIGHT = 630

type Copy = { eyebrow: string; title: string; lead: string }

const COPY: Record<string, Copy> = {
  landing: {
    eyebrow: "THE ACCOUNTING LAYER FOR ECOMMERCE",
    title: "Your ecommerce business, connected.",
    lead: "Marketplaces → DeepEcom → ERP",
  },
  integrations: {
    eyebrow: "INTEGRATIONS",
    title: "Works with the systems you already use.",
    lead: "Amazon · Flipkart · Shopify · Meesho · Tally · SAP · Zoho",
  },
  platform: {
    eyebrow: "DEEPECOM PLATFORM",
    title: "Understand your business.",
    lead: "Profitability, reconciliation, dashboard, reports.",
  },
  erp: {
    eyebrow: "DEEPECOM ERP CONNECTOR",
    title: "Account every transaction. Automatically.",
    lead: "GST · TCS/TDS · inventory · stock transfers · Tally · SAP · Zoho",
  },
  solutions: {
    eyebrow: "SOLUTIONS",
    title: "Built around how your business works.",
    lead: "Amazon sellers, D2C brands, enterprise, CFOs, accountants.",
  },
  customers: {
    eyebrow: "CUSTOMERS",
    title: "Real ecommerce businesses, one clean financial picture.",
    lead: "Read the stories behind the numbers.",
  },
  pricing: {
    eyebrow: "PRICING",
    title: "Pricing that keeps up with your marketplace.",
    lead: "No credit card required. Set up in minutes.",
  },
  resources: {
    eyebrow: "RESOURCES",
    title: "Ecommerce accounting, explained.",
    lead: "Guides, blog, reconciliation, GST, ERP and FAQs.",
  },
}

const DEFAULT_COPY: Copy = {
  eyebrow: "DEEPECOM",
  title: "Your ecommerce business, connected.",
  lead: "The accounting layer for ecommerce",
}

const ALL_KEYS = Object.keys(COPY)

export function getStaticPaths() {
  return ALL_KEYS.map((key) => ({ params: { key } }))
}

const COLORS = {
  bgTop: "#171040",
  bgMid: "#1d1149",
  bgBottom: "#2a1761",
  glow: "rgba(83,58,253,0.55)",
  white: "#ffffff",
  muted: "#b6bdd3",
  accent: "#b9a9ff",
  grid: "rgba(255,255,255,0.05)",
}

function Logo() {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          fontWeight: 800,
          letterSpacing: "-1px",
          color: "#150f38",
          fontFamily: "Inter",
        },
      },
      "DE",
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
          fontFamily: "Inter",
        },
      },
      React.createElement(
        "span",
        { style: { fontSize: "26px", fontWeight: 700, color: COLORS.white, letterSpacing: "-0.5px" } },
        "DeepEcom",
      ),
    ),
  )
}

function GridLayer() {
  const lines: React.ReactNode[] = []
  for (let i = 1; i < 12; i++) {
    lines.push(
      React.createElement("div", {
        key: `v${i}`,
        style: { position: "absolute", top: 0, bottom: 0, left: `${(i / 12) * 100}%`, width: 1, background: COLORS.grid },
      }),
      React.createElement("div", {
        key: `h${i}`,
        style: { position: "absolute", left: 0, right: 0, top: `${(i / 6) * 100}%`, height: 1, background: COLORS.grid },
      }),
    )
  }
  return React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex" } }, lines)
}

export const GET: APIRoute = async ({ params }) => {
  const key = params.key ?? "landing"
  const copy = COPY[key] ?? DEFAULT_COPY

  const [interRegular, interBold] = await Promise.all([
    readFile(resolve("node_modules/@fontsource/inter/files/inter-latin-400-normal.woff")),
    readFile(resolve("node_modules/@fontsource/inter/files/inter-latin-700-normal.woff")),
  ])

  const element = React.createElement(
    "div",
    {
      style: {
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 88px",
        background:
          "linear-gradient(135deg, " + COLORS.bgTop + " 0%, " + COLORS.bgMid + " 52%, " + COLORS.bgBottom + " 100%)",
        fontFamily: "Inter",
        overflow: "hidden",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(820px 460px at 88% -18%, " +
            COLORS.glow +
            " 0%, rgba(83,58,253,0) 55%)",
        },
      },
    ),
    GridLayer(),
    React.createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", zIndex: 1 } },
      Logo(),
      React.createElement(
        "div",
        {
          style: {
            marginTop: "40px",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.accent,
          },
        },
        copy.eyebrow,
      ),
      React.createElement(
        "div",
        {
          style: {
            marginTop: "18px",
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: COLORS.white,
            maxWidth: "940px",
          },
        },
        copy.title,
      ),
    ),
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 1,
          fontFamily: "Inter",
        },
      },
      React.createElement(
        "span",
        { style: { fontSize: "24px", fontWeight: 400, color: COLORS.muted } },
        copy.lead,
      ),
      React.createElement(
        "div",
        { style: { width: 6, height: 6, borderRadius: 999, background: "#533afd" } },
      ),
      React.createElement(
        "span",
        { style: { fontSize: "24px", fontWeight: 400, color: COLORS.muted } },
        "deepecom.com",
      ),
    ),
  )

  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      { name: "Inter", data: interBold, weight: 700, style: "normal" },
    ],
  })

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
  const png = resvg.render().asPng()

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}