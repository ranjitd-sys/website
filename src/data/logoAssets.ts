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
  mps: { src: "/logos/mps.svg", ratio: 1 },
  payu: { src: "/logos/PayU.webp", ratio: 2 },
  cashfree: { src: "/logos/cashfree.png", ratio: 1 },
  phonepe: { src: "/logos/phonepe.webp", ratio: 1 },
  paytm: { src: "/logos/paytm.webp", ratio: 3.18 },
  // shipping
  shiprocket: { src: "/logos/shiprocket.png", ratio: 1 },
  delhivery: { src: "/logos/delhivery-tracking-logo.png", ratio: 5.95 },
  "blue-dart": { src: "/logos/bluedart.png", ratio: 1.05 },
  bluedart: { src: "/logos/bluedart.png", ratio: 1.05 },
  xpressbees: { src: "/logos/xpress%20bee.png", ratio: 1.16 },
  ekart: { src: "/logos/ekart.png", ratio: 3.2 },
  // erp
  tally: { src: "/logos/tally.jpeg", ratio: 1 },
  sap: { src: "/logos/sap.webp", ratio: 2.02 },
  "zoho-books": { src: "/logos/zoho_Books.png", ratio: 1 },
  zoho: { src: "/logos/zoho_Books.png", ratio: 1 },
  dynamics: { src: "/logos/microsoft-dynamamics.webp", ratio: 1 },
  "microsoft-dynamics": { src: "/logos/microsoft-dynamamics.webp", ratio: 1 },
  // case studies (customers)
  gati: { src: "/logos/gati.png", ratio: 0.96 },
  vanalaya: { src: "/logos/vanalaya-logo.png", ratio: 1.67 },
  zeneme: { src: "/logos/zeneme.jpg ", ratio: 0.75 },
  "hinduja-group": { src: "/logos/Hinduja_Group_Logo.svg", ratio: 1.2 },
  paragon: { src: "/logos/paragon.png", ratio: 1 },
  rivona: { src: "/logos/rivona.png", ratio: 1 },
}

export function logoAsset(slug: string): LogoAsset | undefined {
  return LOGO_ASSETS[slug]
}

export function logoAssetSrc(slug: string): string | undefined {
  return LOGO_ASSETS[slug]?.src
}