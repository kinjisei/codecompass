import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
}

const styles: Record<Variant, string> = {
  primary:
    'bg-sky-600 text-white shadow-sm shadow-sky-600/25 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 disabled:shadow-none',
  secondary:
    'bg-slate-200/80 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
  ghost:
    'bg-transparent text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-slate-800',
  /* Для кнопок на цветном градиентном фоне (hero-карта). */
  inverse:
    'bg-white text-sky-700 shadow-sm hover:bg-sky-50 active:bg-sky-100',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
