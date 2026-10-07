import type { LabelMeta } from "@/components/pages/meesho-label-manager/types"
import { extractMetaMeesho, extractMetaFlipkart, type TItem } from "@/components/pages/meesho-label-manager/lib/meta"

export interface ProviderAnchors {
  /** regex matched against a text item to find the "product details" anchor (Meesho). */
  productDetails?: RegExp
  /** regex matched against a text item to find the "tax invoice" anchor. */
  taxInvoice: RegExp
}

export interface LabelProvider {
  id: string
  name: string
  anchors: ProviderAnchors
  extractMeta: (items: TItem[], productDetailsY: number | null, taxInvoiceY: number | null) => LabelMeta
  /** crop the label to its printed box (drop side margins + separator) so it stays portrait. */
  trimSides: boolean
  /** default for the "Rotate to fill" A4 option. */
  autoRotate: boolean
  ui: {
    dropTitle: string
    dropDesc: string
    step1Title: string
    step1Desc: string
    uploadAria: string
  }
}

export const meeshoProvider: LabelProvider = {
  id: "meesho-label-manager",
  name: "Meesho",
  anchors: { productDetails: /product\s*details/i, taxInvoice: /tax\s*invoice/i },
  extractMeta: extractMetaMeesho,
  trimSides: false,
  autoRotate: true,
  ui: {
    dropTitle: "Drop your Meesho label PDFs here",
    dropDesc: "The one from your Meesho supplier panel",
    step1Title: "Upload your PDF",
    step1Desc: "The one from your Meesho supplier panel",
    uploadAria: "Upload Meesho label PDF",
  },
}

export type ProviderId = "meesho" | "flipkart"

export function getProvider(id: ProviderId | undefined): LabelProvider {
  return id === "flipkart" ? flipkartProvider : meeshoProvider
}

export const flipkartProvider: LabelProvider = {
  id: "flipkart-label-manager",
  name: "Flipkart",
  anchors: { taxInvoice: /tax\s*invoice/i },
  extractMeta: extractMetaFlipkart,
  trimSides: true,
  autoRotate: false,
  ui: {
    dropTitle: "Drop your Flipkart label PDFs here",
    dropDesc: "The one from your Flipkart seller panel",
    step1Title: "Upload your PDF",
    step1Desc: "The one from your Flipkart seller panel",
    uploadAria: "Upload Flipkart label PDF",
  },
}
