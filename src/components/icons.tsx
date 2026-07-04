import type { SVGProps } from 'react'

// Единый набор SVG-иконок в стиле Lucide (stroke 2, 24×24).
// Эмодзи в приложении остаются только как «иллюстрации» тем и курсов —
// вся структурная иконография (навигация, действия, статусы) — отсюда.

type IconProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconHome(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 10.5 9-7.5 9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </Base>
  )
}

export function IconCourses(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m22 9-10-5L2 9l10 5 10-5Z" />
      <path d="M6 11.5V16c0 1.4 2.7 2.8 6 2.8s6-1.4 6-2.8v-4.5" />
      <path d="M22 9v5" />
    </Base>
  )
}

export function IconGlossary(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M2 4.5h6a4 4 0 0 1 4 4V20a3 3 0 0 0-3-3H2z" />
      <path d="M22 4.5h-6a4 4 0 0 0-4 4V20a3 3 0 0 1 3-3h7z" />
    </Base>
  )
}

export function IconCards(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m12 2.5 9 4.8-9 4.8-9-4.8 9-4.8Z" />
      <path d="m3.5 12.3 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.8 8.5 4.5 8.5-4.5" />
    </Base>
  )
}

export function IconSettings(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M21 6.5h-5.5M9.5 6.5H3M21 12h-9M6 12H3M21 17.5h-4M11 17.5H3" />
      <circle cx="12" cy="6.5" r="2" />
      <circle cx="8.5" cy="12" r="2" />
      <circle cx="13.5" cy="17.5" r="2" />
    </Base>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m9 6 6 6-6 6" />
    </Base>
  )
}

export function IconArrowLeft(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </Base>
  )
}

export function IconFlame(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Base>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Base>
  )
}

export function IconX(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Base>
  )
}

export function IconCheckCircle(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
    </Base>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Base>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </Base>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </Base>
  )
}

export function IconUpload(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 14V3" />
      <path d="m7 7 5-5 5 5" />
      <path d="M5 20h14" />
    </Base>
  )
}

export function IconTrophy(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v6a5 5 0 0 1-10 0Z" />
      <path d="M7 6H4a1 1 0 0 0-1 1c0 2 1.5 3.5 4 3.5" />
      <path d="M17 6h3a1 1 0 0 1 1 1c0 2-1.5 3.5-4 3.5" />
    </Base>
  )
}

export function IconClock(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Base>
  )
}

export function IconBookCheck(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
      <path d="m9 9.5 2 2 4-4.5" />
    </Base>
  )
}
