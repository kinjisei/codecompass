import { useCallback, useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { allEntries, categoryTitle } from '../../content'
import { getDueEntries, reviewEntry, type DueEntry } from '../../lib/srs'
import type { Rating } from '../../types'

const ratingButtons: { rating: Rating; label: string; className: string }[] = [
  { rating: 'again', label: 'Снова', className: 'bg-red-500 hover:bg-red-400 text-white' },
  { rating: 'hard', label: 'Трудно', className: 'bg-orange-500 hover:bg-orange-400 text-white' },
  { rating: 'good', label: 'Хорошо', className: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
  { rating: 'easy', label: 'Легко', className: 'bg-sky-600 hover:bg-sky-500 text-white' },
]

export function CardsPage() {
  const [queue, setQueue] = useState<DueEntry[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  const load = useCallback(() => {
    setQueue(getDueEntries(allEntries))
    setIndex(0)
    setRevealed(false)
  }, [])

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
      <header>
        <h1 className="text-2xl font-bold">🧠 Карточки</h1>
      </header>

      {current ? (
        <>
          <p className="text-center text-sm text-slate-500">
            Осталось: {queue.length - index}
          </p>
          <Card className="min-h-[220px] flex-col items-center justify-center text-center">
            <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
              <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                {categoryTitle(current.entry.categoryId)}
              </p>
              <p className="text-2xl font-bold">{current.entry.term}</p>
              <p className="text-slate-500">{current.entry.short}</p>
              {revealed && (
                <div className="mt-2 border-t border-slate-200 pt-3 text-left dark:border-slate-700">
                  <p className="whitespace-pre-line text-slate-700 dark:text-slate-200">
                    {current.entry.detail}
                  </p>
                  {current.entry.example && (
                    <p className="mt-2 text-sm italic text-slate-500">
                      Пример: {current.entry.example}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {!revealed ? (
            <Button onClick={() => setRevealed(true)}>Показать ответ</Button>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {ratingButtons.map((b) => (
                <button
                  key={b.rating}
                  onClick={() => onRate(b.rating)}
                  className={`rounded-xl py-3 text-sm font-semibold transition-colors ${b.className}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card className="text-center">
          <p className="text-4xl">🎉</p>
          <p className="mt-2 font-semibold">
            {reviewedCount > 0
              ? `Готово! Повторено терминов: ${reviewedCount}`
              : 'Карточек к повторению нет'}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Загляни в «Глоссарий», чтобы почитать темы — новые термины появятся здесь.
          </p>
          <Button variant="secondary" className="mt-4" onClick={load}>
            Обновить
          </Button>
        </Card>
      )}
    </div>
  )
}