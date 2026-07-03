import type { HTMLAttributes, ReactNode } from 'react'

/** Простой контейнер-карточка для группировки контента. */
export function Card({
  children,
  className = '',
  ...rest
}: {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}