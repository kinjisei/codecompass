import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/Progress'
import { IconCheckCircle } from '../../components/icons'
import { allEntries, categoryTitle } from '../../content'
import { getDueEntries, reviewEntry, type DueEntry } from '../../lib/srs'
import type { CategoryId, Rating } from '../../types'

const ratingButtons: { rating: Rating; label: string; className: string }[] = [
  { rating: 'again', label: 'Снова', className: 'bg-red-500 hover:bg-red-400 text-white shadow-sm shadow-red-500/25' },
  { rating: 'hard', label: 'Трудно', className: 'bg-orange-500 hover:bg-orange-400 text-white shadow-sm shadow-orange-500/25' },
  { rating: 'good', label: 'Хорошо', className: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/25' },
  { rating: 'easy', label: 'Легко', className: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/25' },
]

export function CardsPage() {
  const [params] = useSearchParams()
  const category = params.get('category') as CategoryId | null
  const [queue, setQueue] = useState<DueEntry[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  const load = useCallback(() => {
    const pool = category
      ? allEntries.filter((e) => e.categoryId === category)
      : allEntries
    setQueue(getDueEntries(pool))
    setIndex(0)
    setRevealed(false)
    setReviewedCount(0)
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  const current = queue[index]

  const onRate = (rating: Rating) => {
    if (!current) return
    reviewEntry(current.entry.id, current.state, rating)
    setReviewedCount((c) => c + 1)
    setRevealed(false)
    setIndex((i) => i + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Карточки</h1>
          {category && (
            <p className="mt-0.5 text-sm text-slate-500">Тема: {categoryTitle(category)}</p>
          )}
        </div>
        {category && (
          <Link
            to="/cards"
            className="shrink-0 text-sm font-semibold text-sky-600 dark:text-sky-400"
          >
            Все темы
          </Link>
        )}
      </header>

      {current ? (
        <>
          <div>
            <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
              <span className="tabular-nums">Осталось: {queue.length - index}</span>
              <span className="tabular-nums">
                {index} / {queue.length}
              </span>
            </div>
            <ProgressBar done={index} total={queue.length} tone="sky" />
          </div>

          <Card className="flex min-h-[240px] flex-col justify-center px-6 py-7 text-center">
            <span className="mx-auto rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              {categoryTitle(current.entry.categoryId)}
            </span>
            <p className="mt-4 text-2xl font-bold leading-tight">{current.entry.term}</p>
            <p className="mt-2 leading-relaxed text-slate-500">{current.entry.short}</p>
            {revealed && (
              <div className="mt-5 border-t border-slate-200 pt-4 text-left dark:border-slate-700">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
                  {current.entry.detail}
                </p>
                {current.entry.example && (
                  <p className="mt-3 rounded-xl bg-slate-100/80 p-3 text-sm italic leading-relaxed text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
                    Пример: {current.entry.example}
                  </p>
                )}
              </div>
            )}
          </Card>

          {!revealed ? (
            <Button onClick={() => setRevealed(true)}>Показать ответ</Button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {ratingButtons.map((b) => (
                <button
                  key={b.rating}
                  onClick={() => onRate(b.rating)}
                  className={`min-h-12 cursor-pointer rounded-xl py-3 text-sm font-bold transition-all duration-150 active:scale-95 ${b.className}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center gap-1 py-8 text-center">
          <IconCheckCircle className="h-12 w-12 text-emerald-500" />
          <p className="mt-2 font-bold">
            {reviewedCount > 0
              ? `Готово! Повторено терминов: ${reviewedCount}`
              : category
                ? 'В этой теме нет карточек к повторению'
                : 'Карточек к повторению нет'}
          </p>
          <p className="text-sm text-slate-500">
            {category
              ? 'Вернись позже или разбери другие темы.'
              : 'Загляни в «Глоссарий», чтобы почитать темы — новые термины появятся здесь.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="secondary" onClick={load}>
              Обновить
            </Button>
            {category && (
              <Link to="/cards">
                <Button>Все темы</Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
