import { useId } from "react"

const STEPPER = [
  { title: "Fetch Data", sub: "Marketplace data", active: false },
  { title: "Tally Config", sub: "Address & company", active: false },
  { title: "Voucher Type", sub: "Map voucher types", active: false },
  { title: "Ledgers", sub: "Create or map", active: true },
  { title: "Reconcile", sub: "Read back & match", active: false },
]

const MAPPINGS = [
  { from: "Marketplace fee", channel: "Amazon", to: "Commission" },
  { from: "CGST / SGST", channel: "Amazon", to: "Input GST" },
  { from: "TCS", channel: "Flipkart", to: "TCS Payable" },
  { from: "Shipping", channel: "Meesho", to: "Freight Out" },
]

export default function TallyWorkflowGraphic() {
  const id = useId()
  const titleId = `${id}-title`
  const descId = `${id}-desc`

  return (
    <svg
      viewBox="0 0 460 402"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      className="block h-auto w-full bg-transparent"
    >
      <title id={titleId}>DeepEcom Tally Sync workflow</title>
      <desc id={descId}>
        Marketplace attributes are mapped to the correct Tally ledgers — fees to Commission,
        CGST and SGST to Input GST, TCS to TCS Payable and shipping to Freight Out. Four of four
        mappings are resolved and transactions are reconciled against Tally.
      </desc>

      <rect x="12" y="10" width="436" height="34" rx="8" className="fill-white stroke-ink-200" />
      <rect x="20" y="15" width="24" height="24" rx="6" className="fill-brand-600" />
      <text x="32" y="31.5" textAnchor="middle" className="fill-white" fontSize="10" fontWeight="700" letterSpacing="0.4">
        DE
      </text>
      <text x="52" y="31.5" className="fill-ink-950" fontSize="12" fontWeight="700">
        DeepEcom
      </text>
      <text x="124" y="31.5" className="fill-ink-500" fontSize="10" fontWeight="500">
        Tally Integration · TALLY SYNC
      </text>

      {STEPPER.map((s, i) => {
        const y = 54 + i * 57
        return (
          <g key={s.title}>
            <rect
              x="12"
              y={y}
              width="120"
              height="48"
              rx="8"
              className={s.active ? "fill-brand-50 stroke-brand-600" : "fill-white stroke-ink-200"}
              strokeWidth={s.active ? 1.3 : 1}
            />
            <rect
              x="22"
              y={y + 14}
              width="20"
              height="20"
              rx="6"
              className={s.active ? "fill-brand-600" : "fill-ink-100"}
            />
            <text
              x="32"
              y={y + 28}
              textAnchor="middle"
              className={s.active ? "fill-white" : "fill-ink-500"}
              fontSize="9.5"
              fontWeight="700"
            >
              {i + 1}
            </text>
            <text x="48" y={y + 22} className="fill-ink-900" fontSize="10.5" fontWeight="600">
              {s.title}
            </text>
            <text x="48" y={y + 35} className="fill-ink-500" fontSize="8.5">
              {s.sub}
            </text>
          </g>
        )
      })}

      <rect x="144" y="54" width="304" height="276" rx="10" className="fill-white stroke-ink-200" />
      <text x="162" y="78" className="fill-ink-950" fontSize="12" fontWeight="700">
        Ledger mapping
      </text>
      <text x="430" y="78" textAnchor="end" className="fill-success-700" fontSize="9" fontWeight="600">
        4 / 4 resolved
      </text>

      {MAPPINGS.map((m, i) => {
        const y = 92 + i * 56
        return (
          <g key={m.from}>
            <rect x="162" y={y} width="268" height="48" rx="8" className="fill-ink-50 stroke-ink-200" />
            <circle cx="182" cy={y + 24} r="4.5" className="fill-brand-600" />
            <text x="196" y={y + 22} className="fill-ink-900" fontSize="10.5" fontWeight="600">
              {m.from}
            </text>
            <text
              x="196"
              y={y + 35}
              className="fill-ink-400"
              fontSize="8"
              fontWeight="600"
              letterSpacing="0.4"
            >
              {m.channel.toUpperCase()}
            </text>
            <path d={`M296 ${y + 24} h20`} className="stroke-ink-300" strokeWidth="1.3" strokeLinecap="round" />
            <path
              d={`M312 ${y + 20} l4 4 l-4 4`}
              fill="none"
              className="stroke-ink-300"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="332" y={y + 15} width="88" height="18" rx="9" className="fill-success-50 stroke-success-200" />
            <text
              x="376"
              y={y + 27}
              textAnchor="middle"
              className="fill-success-700"
              fontSize="8.5"
              fontWeight="600"
            >
              {m.to}
            </text>
          </g>
        )
      })}

      <rect x="12" y="340" width="436" height="52" rx="10" className="fill-white stroke-ink-200" />
      <circle cx="34" cy="366" r="10" className="fill-success-50 stroke-success-200" />
      <path
        d="M29.5 366.5 l3 3 l6 -6.5"
        fill="none"
        className="stroke-success-700"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="52" y="360" className="fill-ink-900" fontSize="11" fontWeight="600">
        Reconciled successfully
      </text>
      <text x="52" y="374" className="fill-ink-500" fontSize="9">
        Expenses synced &amp; reconciled
      </text>
      <text x="196" y="374" className="fill-success-700" fontSize="9" fontWeight="600">
        18 / 18 (100%)
      </text>
      <rect x="260" y="353" width="84" height="26" rx="6" className="fill-ink-50 stroke-ink-200" />
      <text x="302" y="369.5" textAnchor="middle" className="fill-ink-600" fontSize="8.5" fontWeight="600">
        151 Transactions
      </text>
      <rect x="352" y="353" width="84" height="26" rx="6" className="fill-ink-50 stroke-ink-200" />
      <text x="394" y="369.5" textAnchor="middle" className="fill-ink-600" fontSize="8.5" fontWeight="600">
        18 Types Checked
      </text>
    </svg>
  )
}
