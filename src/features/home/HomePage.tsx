import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/Progress'
import {
  IconChevronRight,
  IconFlame,
  IconPlay,
  IconSettings,
} from '../../components/icons'
import { categories, allEntries } from '../../content'
import { getProgress, type Progress } from '../../lib/srs'
import { getStreak, isTodayActive } from '../../lib/activity'
import { getContinueTarget, type ContinueTarget } from '../../lib/courseProgress'

const emptyProgress: Progress = { total: 0, due: 0, studied: 0, learned: 0 }

export function HomePage() {
  const [progress, setProgress] = useState<{
    overall: Progress
    byCategory: Record<string, Progress>
  }>({ overall: emptyProgress, byCategory: {} })
  const [streak, setStreak] = useState(0)
  const [todayActive, setTodayActive] = useState(false)
  const [next, setNext] = useState<ContinueTarget | undefined>(undefined)

  useEffect(() => {
    setProgress(getProgress(allEntries))
    setStreak(getStreak())
    setTodayActive(isTodayActive())
    setNext(getContinueTarget())
  }, [])

  const { overall, byCategory } = progress

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg shadow-sm shadow-sky-500/30">
            🧭
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">CodeCompass</h1>
            <p className="text-xs text-slate-500">Путеводитель по коду и не только</p>
          </div>
        </div>
        <Link
          to="/settings"
          aria-label="Настройки"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <IconSettings className="h-5.5 w-5.5" />
        </Link>
      </header>

      {/* Hero: повторение + стрик */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-lg shadow-sky-600/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-sky-100">К повторению сейчас</p>
            <p className="mt-0.5 text-4xl font-extrabold tabular-nums">{overall.due}</p>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
              todayActive ? 'bg-amber-400/90 text-amber-950' : 'bg-white/15 text-white'
            }`}
            title={todayActive ? 'Стрик защищён: сегодня уже занимался' : 'Позанимайся сегодня, чтобы продлить стрик'}
          >
            <IconFlame className="h-4.5 w-4.5" />
            {streak}
            <span className="font-medium">дн.</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-sky-100">
            <span>Изучено {overall.studied} из {overall.total}</span>
            <span className="tabular-nums">
              {overall.total ? Math.round((overall.studied / overall.total) * 100) : 0}%
            </span>
          </div>
          <ProgressBar done={overall.studied} total={overall.total} tone="white" />
        </div>

        <Link to="/cards" className="mt-4 block">
          <Button variant="inverse" className="w-full">
            <IconPlay className="h-4.5 w-4.5" />
            Повторить
          </Button>
        </Link>
      </div>

      {/* Продолжить обучение */}
      {next && (
        <Link to={`/courses/${next.courseId}/${next.lessonId}`}>
          <Card interactive className="flex items-center gap-3 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl dark:bg-sky-900/40">
              {next.courseIcon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                Продолжить обучение
              </p>
              <p className="truncate font-semibold">{next.lessonTitle}</p>
              <p className="truncate text-xs text-slate-400">{next.courseTitle}</p>
            </div>
            <IconChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
          </Card>
        </Link>
      )}

      {/* Темы глоссария */}
      <div className="mt-1 flex items-baseline justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Темы</h2>
        <span className="text-xs tabular-nums text-slate-400">{categories.length}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {categories.map((c) => {
          const p = byCategory[c.id] ?? emptyProgress
          return (
            <Card key={c.id} interactive className="flex items-center gap-3 p-4">
              <Link
                to={`/glossary?category=${c.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-700/60">
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{c.title}</p>
                  <div className="mt-1.5">
                    <ProgressBar done={p.studied} total={p.total} />
                  </div>
                  <p className="mt-1 text-xs tabular-nums text-slate-400">
                    Изучено {p.studied} из {p.total}
                  </p>
                </div>
              </Link>
              {p.due > 0 && (
                <Link
                  to={`/cards?category=${c.id}`}
                  aria-label={`Повторить тему «${c.title}» — карточек: ${p.due}`}
                  className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 px-2.5 text-sm font-bold tabular-nums text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900/80"
                >
                  {p.due}
                </Link>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
