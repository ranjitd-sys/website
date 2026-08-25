import { useEffect, useRef, useState } from "react"

interface Props {
  target: number
  decimals?: number
}

const fmt = (n: number, d: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d })

export default function KpiValue({ target, decimals = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [text, setText] = useState(fmt(0, decimals))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const dur = 1300
        const tick = (t: number) => {
          const p = Math.min((t - start) / dur, 1)
          setText(fmt(target * (1 - Math.pow(1 - p, 3)), decimals))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, decimals])

  return (
    <span ref={ref} className="num text-[clamp(21px,2vw,26px)] font-[660] tracking-tight text-ink">
      {text}
    </span>
  )
}
