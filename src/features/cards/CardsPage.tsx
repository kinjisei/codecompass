import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/Progress'
import { IconCheck, IconCheckCircle, IconX } from '../../components/icons'
import { allEntries, categoryTitle } from '../../content'
import { getDueEntries, reviewEntry, type DueEntry } from '../../lib/srs'
import { recordActivity } from '../../lib/activity'
import {
  getLessonQuestions,
  markLessonReviewed,
  type LessonQuestion,
} from '../../lib/lessonReview'
import type { CategoryId, Rating } from '../../types'

const ratingButtons: { rating: Rating; label: string; className: string }[] = [
  { rating: 'again', label: 'Снова', className: 'bg-red-500 hover:bg-red-400 text-white shadow-sm shadow-red-500/25' },
  { rating: 'hard', label: 'Трудно', className: 'bg-orange-500 hover:bg-orange-400 text-white shadow-sm shadow-orange-500/25' },
  { rating: 'good', label: 'Хорошо', className: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/25' },
  { rating: 'easy', label: 'Легко', className: 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-600/25' },
]

/** Вопросы из пройденных уроков — вторая часть смешанной сессии повторения. */
function LessonQuestions({
  questions,
  onFinish,
}: {
  questions: LessonQuestion[]
  onFinish: (answered: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  const item = questions[index]
  const q = item.question

  const pick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    markLessonReviewed(item.lessonId)
    recordActivity('card')
  }

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      onFinish(questions.length)
    }
  }

  return (
    <>
      <div>
        <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
          <span>Вопросы из уроков</span>
          <span className="tabular-nums">
            {index + 1} / {questions.length}
          </span>
        </div>
        <ProgressBar done={index} total={questions.length} tone="sky" />
      </div>

      <Card className="flex flex-col gap-3">
        <div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {item.courseTitle}
          </span>
          <p className="mt-2 text-xs text-slate-400">Урок: {item.lessonTitle}</p>
        </div>
        <p className="font-semibold leading-snug">{q.question}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => {
            let cls =
              'border-slate-200 bg-white hover:border-sky-400 active:scale-[0.99] dark:border-slate-600 dark:bg-slate-900 dark:hover:border-sky-500'
            let mark = null
            if (selected !== null) {
              if (i === q.correct) {
                cls =
                  'border-emerald-500 bg-emerald-50 font-medium text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200'
                mark = <IconCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
              } else if (i === selected) {
                cls = 'border-red-400 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-200'
                mark = <IconX className="h-4.5 w-4.5 shrink-0 text-red-400" />
              } else {
                cls = 'border-slate-200 opacity-50 dark:border-slate-600'
              }
            }
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={selected !== null}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 disabled:cursor-default ${cls}`}
              >
                <span>{opt}</span>
                {mark}
              </button>
            )
          })}
        </div>
        {selected !== null && (
          <>
            <div
              className={`rounded-xl p-3.5 text-sm leading-relaxed ${
                selected === q.correct
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
              }`}
            >
              <p className="font-bold">{selected === q.correct ? 'Верно!' : 'Не совсем.'}</p>
              <p className="mt-1">{q.explain}</p>
            </div>
            <Button onClick={next}>
              {index + 1 < questions.length ? 'Дальше' : 'Завершить повторение'}
            </Button>
          </>
        )}
      </Card>

      <Link
        to={`/courses/${item.courseId}/${item.lessonId}`}
        className="text-center text-sm font-semibold text-sky-600 dark:text-sky-400"
      >
        Открыть урок целиком →
      </Link>
    </>
  )
}

export function CardsPage() {
  const [params] = useSearchParams()
  const category = params.get('category') as CategoryId | null
  const [queue, setQueue] = useState<DueEntry[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [questions, setQuestions] = useState<LessonQuestion[]>([])
  const [questionsDone, setQuestionsDone] = useState(0)
  const [stage, setStage] = useState<'cards' | 'questions' | 'done'>('cards')
  // Защита от гонки: переход между стадиями разрешён только после загрузки очереди.
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(() => {
    const pool = category
      ? allEntries.filter((e) => e.categoryId === category)
      : allEntries
    setQueue(getDueEntries(pool))
    // Вопросы из уроков подмешиваются только в общую сессию (без фильтра темы).
    setQuestions(category ? [] : getLessonQuestions(5))
    setIndex(0)
    setRevealed(false)
    setReviewedCount(0)
    setQuestionsDone(0)
    setStage('cards')
    setLoaded(true)
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  const current = stage === 'cards' ? queue[index] : undefined

  // Карточки закончились → вопросы из уроков (если есть) → итог.
  useEffect(() => {
    if (!loaded || stage !== 'cards' || index < queue.length) return
    if (questions.length > 0) setStage('questions')
    else setStage('done')
  }, [loaded, stage, index, queue.length, questions.length])

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
          <h1 className="text-2xl font-bold">Повторение</h1>
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
      ) : stage === 'questions' ? (
        <LessonQuestions
          questions={questions}
          onFinish={(answered) => {
            setQuestionsDone(answered)
            setStage('done')
          }}
        />
      ) : (
        <Card className="flex flex-col items-center gap-1 py-8 text-center">
          <IconCheckCircle className="h-12 w-12 text-emerald-500" />
          <p className="mt-2 font-bold">
            {reviewedCount > 0 || questionsDone > 0
              ? 'Готово! Повторение на сегодня выполнено'
              : category
                ? 'В этой теме нет карточек к повторению'
                : 'Карточек к повторению нет'}
          </p>
          {(reviewedCount > 0 || questionsDone > 0) && (
            <p className="text-sm tabular-nums text-slate-500">
              Карточек: {reviewedCount}
              {questionsDone > 0 && ` · вопросов из уроков: ${questionsDone}`}
            </p>
          )}
          {reviewedCount === 0 && questionsDone === 0 && (
            <p className="text-sm text-slate-500">
              {category
                ? 'Вернись позже или разбери другие темы.'
                : 'Пройди урок в «Курсах» — новые термины появятся здесь.'}
            </p>
          )}
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
