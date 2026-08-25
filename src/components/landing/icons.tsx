import type { SVGProps } from "react"

export type IconProps = SVGProps<SVGSVGElement>;
const base: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};



export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[7px] bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_6px_rgba(79,70,229,0.35)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="#fff">
        <rect x="3" y="13" width="4.5" height="8" rx="1" />
        <rect x="9.75" y="8" width="4.5" height="13" rx="1" />
        <rect x="16.5" y="3" width="4.5" height="18" rx="1" />
      </svg>
    </span>
  )
}



export function PlugIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props} >
      <path d="M9 7H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h3M15 7h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-3" />
      <path d="M8 12h8" />
    </svg>
  );
}



export function ReconcileIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props} >
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

export function SyncIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  )
}

export function TrendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M7 13l4-4 4 3 5-6" />
    </svg>
  )
}

export function PieIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M21.2 15.9A10 10 0 1 1 8.2 2.8" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

export function AlertBellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  )
}

export function CheckCircle({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 ${className}`}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )
}
