export interface LogoAsset {
  src: string
  ratio: number
}

export const LOGO_ASSETS: Record<string, LogoAsset> = {
  // marketplaces
  amazon: { src: "/logos/amazon.png", ratio: 1 },
  flipkart: { src: "/logos/flipkart.png", ratio: 1 },
  shopify: { src: "/logos/shopify.png", ratio: 1 },
  meesho: { src: "/logos/meesho.png", ratio: 1.33 },
  myntra: { src: "/logos/Myntra.png", ratio: 1.33 },
  ajio: { src: "/logos/ajio.png", ratio: 1 },
  jiomart: { src: "/logos/JioMart_logo.svg", ratio: 1 },
  nykaa: { src: "/logos/NYKAA.png", ratio: 0.89 },
  // payments
  razorpay: { src: "/logos/rezorplay.png", ratio: 1.33 },
  payu: { src: "/logos/payu.jpeg", ratio: 2 },
  cashfree: { src: "/logos/cashfree.png", ratio: 1 },
  phonepe: { src: "/logos/phonepe.webp", ratio: 1 },
  paytm: { src: "/logos/paytm.webp", ratio: 1.85 },
  // shipping
  shiprocket: { src: "/logos/shiprocket.png", ratio: 1 },
  delhivery: { src: "/logos/delhivery-tracking-logo.png", ratio: 5.95 },
  "blue-dart": { src: "/logos/bluedart.png", ratio: 1.05 },
  bluedart: { src: "/logos/bluedart.png", ratio: 1.05 },
  xpressbees: { src: "/logos/xpress%20bee.png", ratio: 2.85 },
  // erp
  tally: { src: "/logos/tally.jpeg", ratio: 1 },
  sap: { src: "/logos/sap.webp", ratio: 1.56 },
  "zoho-books": { src: "/logos/zoho_Books.png", ratio: 1.46 },
  zoho: { src: "/logos/zoho_Books.png", ratio: 1.46 },
}

export function logoAsset(slug: string): LogoAsset | undefined {
  return LOGO_ASSETS[slug]
}

export function logoAssetSrc(slug: string): string | undefined {
  return LOGO_ASSETS[slug]?.src
}