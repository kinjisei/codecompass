// Общие индикаторы прогресса: полоска и кольцо.

export function ProgressBar({
  done,
  total,
  className = '',
  tone = 'emerald',
}: {
  done: number
  total: number
  className?: string
  tone?: 'emerald' | 'sky' | 'white'
}) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const fill =
    tone === 'white'
      ? 'bg-white'
      : tone === 'sky'
        ? 'bg-gradient-to-r from-sky-500 to-indigo-500'
        : 'bg-emerald-500'
  const track =
    tone === 'white' ? 'bg-white/25' : 'bg-slate-200/80 dark:bg-slate-700'
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${track} ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] duration-300 ${fill}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/** Кольцо прогресса для карточек курсов: процент в центре. */
export function ProgressRing({
  done,
  total,
  size = 52,
}: {
  done: number
  total: number
  size?: number
}) {
  const pct = total ? done / total : 0
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        className="stroke-slate-200/80 dark:stroke-slate-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="stroke-sky-500 transition-[stroke-dashoffset] duration-500"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-slate-700 text-[11px] font-bold dark:fill-slate-200"
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  )
}
