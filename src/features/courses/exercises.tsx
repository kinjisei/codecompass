import { useMemo, useState } from 'react'
import { IconCheck, IconCheckCircle, IconX } from '../../components/icons'
import { getPracticeChecked, togglePracticeStep } from '../../lib/practice'

// ============================================================================
// Интерактивные упражнения внутри уроков (движок 3.0, PLAN-3.0 §4).
// Каждое — самодостаточный блок: вопрос → действие → мгновенный разбор.
// ============================================================================

const shellClass =
  'rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/30'
const labelClass = 'text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300'

function ExplainBox({ correct, text }: { correct: boolean; text: string }) {
  return (
    <div
      className={`mt-3 rounded-xl p-3.5 text-sm leading-relaxed ${
        correct
          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
          : 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
      }`}
    >
      <p className="font-bold">{correct ? 'Верно!' : 'Не совсем.'}</p>
      <p className="mt-1">{text}</p>
    </div>
  )
}

/** «Какой вариант лучше»: два варианта, тап по одному, разбор. */
export function CompareBlock({
  prompt,
  a,
  b,
  better,
  explain,
}: {
  prompt: string
  a: string
  b: string
  better: 'a' | 'b'
  explain: string
}) {
  const [picked, setPicked] = useState<'a' | 'b' | null>(null)

  const option = (key: 'a' | 'b', text: string) => {
    let cls =
      'border-slate-200 bg-white hover:border-indigo-400 active:scale-[0.99] dark:border-slate-600 dark:bg-slate-900'
    if (picked !== null) {
      if (key === better)
        cls =
          'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
      else if (key === picked)
        cls = 'border-red-400 bg-red-50 dark:bg-red-900/30'
      else cls = 'border-slate-200 opacity-60 dark:border-slate-600'
    }
    return (
      <button
        onClick={() => picked === null && setPicked(key)}
        disabled={picked !== null}
        className={`flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-150 disabled:cursor-default ${cls}`}
      >
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
          {key === 'a' ? 'А' : 'Б'}
        </span>
        <span className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {text}
        </span>
        {picked !== null && key === better && (
          <IconCheck className="ml-auto h-5 w-5 shrink-0 text-emerald-500" />
        )}
        {picked !== null && key === picked && key !== better && (
          <IconX className="ml-auto h-5 w-5 shrink-0 text-red-400" />
        )}
      </button>
    )
  }

  return (
    <div className={shellClass}>
      <p className={labelClass}>🎯 Упражнение · выбери лучший вариант</p>
      <p className="mt-2 text-[15px] font-semibold leading-snug">{prompt}</p>
      <div className="mt-3 flex flex-col gap-2">
        {option('a', a)}
        {option('b', b)}
      </div>
      {picked !== null && <ExplainBox correct={picked === better} text={explain} />}
    </div>
  )
}

/** «Найди проблему»: фрагменты текста, тап по проблемному. */
export function FindErrorBlock({
  prompt,
  fragments,
  wrong,
  explain,
}: {
  prompt: string
  fragments: string[]
  wrong: number
  explain: string
}) {
  const [picked, setPicked] = useState<number | null>(null)

  return (
    <div className={shellClass}>
      <p className={labelClass}>🔍 Упражнение · найди проблему</p>
      <p className="mt-2 text-[15px] font-semibold leading-snug">{prompt}</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {fragments.map((fragment, i) => {
          let cls =
            'border-slate-200 bg-white hover:border-indigo-400 active:scale-[0.99] dark:border-slate-600 dark:bg-slate-900'
          if (picked !== null) {
            if (i === wrong)
              cls = 'border-red-400 bg-red-50 dark:bg-red-900/30'
            else if (i === picked)
              cls = 'border-slate-300 opacity-60 dark:border-slate-500'
            else cls = 'border-emerald-300/60 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
          }
          return (
            <button
              key={i}
              onClick={() => picked === null && setPicked(i)}
              disabled={picked !== null}
              className={`cursor-pointer rounded-lg border px-3.5 py-2.5 text-left text-sm leading-relaxed text-slate-700 transition-all duration-150 disabled:cursor-default dark:text-slate-200 ${cls}`}
            >
              {fragment}
            </button>
          )
        })}
      </div>
      {picked !== null && <ExplainBox correct={picked === wrong} text={explain} />}
    </div>
  )
}

/** «Расставь по порядку»: перемешанные шаги собираются тапами. */
export function OrderBlock({
  prompt,
  steps,
  explain,
}: {
  prompt: string
  steps: string[]
  explain?: string
}) {
  // Перемешиваем один раз на монтирование (гарантированно не в исходном порядке).
  const shuffled = useMemo(() => {
    const arr = steps.map((text, originalIndex) => ({ text, originalIndex }))
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    if (arr.every((item, i) => item.originalIndex === i) && arr.length > 1) {
      ;[arr[0], arr[1]] = [arr[1], arr[0]]
    }
    return arr
  }, [steps])

  const [placedCount, setPlacedCount] = useState(0)
  const [shakeIndex, setShakeIndex] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const done = placedCount === steps.length

  const pick = (originalIndex: number, listIndex: number) => {
    if (originalIndex === placedCount) {
      setPlacedCount((c) => c + 1)
      setShakeIndex(null)
    } else {
      setMistakes((m) => m + 1)
      setShakeIndex(listIndex)
      setTimeout(() => setShakeIndex(null), 600)
    }
  }

  return (
    <div className={shellClass}>
      <p className={labelClass}>🧩 Упражнение · расставь по порядку</p>
      <p className="mt-2 text-[15px] font-semibold leading-snug">{prompt}</p>

      {placedCount > 0 && (
        <ol className="mt-3 flex flex-col gap-1.5">
          {steps.slice(0, placedCount).map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-lg border border-emerald-300/60 bg-emerald-50/60 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-slate-200"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {!done ? (
        <>
          <p className="mt-3 text-xs font-medium text-slate-400">
            Что дальше? Выбери шаг {placedCount + 1}:
          </p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {shuffled.map((item, listIndex) =>
              item.originalIndex < placedCount ? null : (
                <button
                  key={item.originalIndex}
                  onClick={() => pick(item.originalIndex, listIndex)}
                  className={`cursor-pointer rounded-lg border px-3.5 py-2.5 text-left text-sm leading-relaxed text-slate-700 transition-all duration-150 active:scale-[0.99] dark:text-slate-200 ${
                    shakeIndex === listIndex
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/30'
                      : 'border-slate-200 bg-white hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-900'
                  }`}
                >
                  {item.text}
                </button>
              ),
            )}
          </div>
        </>
      ) : (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3.5 text-sm leading-relaxed text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          <p className="font-bold">
            Собрано!{' '}
            {mistakes === 0 ? 'Без единой ошибки.' : `Промахов по пути: ${mistakes}.`}
          </p>
          {explain && <p className="mt-1">{explain}</p>}
        </div>
      )}
    </div>
  )
}

/** Практикум-чеклист: реальное задание, отметки сохраняются между сессиями. */
export function PracticeBlock({
  id,
  title,
  intro,
  steps,
}: {
  id: string
  title: string
  intro?: string
  steps: string[]
}) {
  const [checked, setChecked] = useState<number[]>(() => getPracticeChecked(id))
  const done = checked.length === steps.length

  return (
    <div
      className={`rounded-xl border p-4 ${
        done
          ? 'border-emerald-300/70 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30'
          : 'border-violet-200/80 bg-violet-50/60 dark:border-violet-900/60 dark:bg-violet-950/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
          🛠 Практикум
        </p>
        {done && <IconCheckCircle className="h-5 w-5 text-emerald-500" />}
      </div>
      <p className="mt-1.5 font-semibold leading-snug">{title}</p>
      {intro && (
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{intro}</p>
      )}
      <div className="mt-3 flex flex-col gap-1.5">
        {steps.map((step, i) => {
          const isChecked = checked.includes(i)
          return (
            <button
              key={i}
              onClick={() => setChecked(togglePracticeStep(id, i))}
              className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm leading-relaxed transition-all duration-150 active:scale-[0.99] ${
                isChecked
                  ? 'border-emerald-300/70 bg-white/70 text-slate-400 line-through dark:border-emerald-900/50 dark:bg-slate-900/40 dark:text-slate-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-violet-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-500'
                }`}
              >
                {isChecked && <IconCheck className="h-3.5 w-3.5" />}
              </span>
              {step}
            </button>
          )
        })}
      </div>
      <p className="mt-2.5 text-xs text-slate-400">
        Отметки сохраняются — можно возвращаться к практикуму в любой момент.
      </p>
    </div>
  )
}
