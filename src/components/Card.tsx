import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Карточка-поверхность. `interactive` добавляет отклик на нажатие —
 * для карточек-ссылок и раскрывающихся элементов.
 */
export function Card({
  children,
  className = '',
  interactive = false,
  ...rest
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] dark:border-slate-700/60 dark:bg-slate-800 ${
        interactive
          ? 'cursor-pointer transition-all duration-150 hover:border-slate-300 active:scale-[0.99] dark:hover:border-slate-600'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
