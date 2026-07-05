import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/Progress'
import {
  IconCheck,
  IconChevronRight,
  IconFlame,
  IconGlossary,
  IconPlay,
  IconSettings,
} from '../../components/icons'
import { allEntries } from '../../content'
import { learningPath } from '../../content/courses/meta'
import { getProgress } from '../../lib/srs'
import { DAILY_GOAL, getStreak, getToday, isTodayActive } from '../../lib/activity'
import {
  getAllLessonProgress,
  getContinueTarget,
  type ContinueTarget,
} from '../../lib/courseProgress'

function GoalRow({ label, done, total }: { label: string; done: number; total: number }) {
  const complete = done >= total
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          complete ? 'bg-white text-sky-600' : 'bg-white/20 text-white/70'
        }`}
      >
        {complete ? <IconCheck className="h-4 w-4" /> : null}
      </span>
      <span className="w-24 shrink-0 text-sm font-medium text-sky-50">{label}</span>
      <ProgressBar done={Math.min(done, total)} total={total} tone="white" className="flex-1" />
      <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums text-white">
        {Math.min(done, total)}/{total}
      </span>
    </div>
  )
}

export function HomePage() {
  const [due, setDue] = useState(0)
  const [streak, setStreak] = useState(0)
  const [todayActive, setTodayActive] = useState(false)
  const [today, setToday] = useState({ c: 0, l: 0 })
  const [next, setNext] = useState<ContinueTarget | undefined>(undefined)
  const [doneLessons, setDoneLessons] = useState<Record<string, unknown>>({})

  useEffect(() => {
    setDue(getProgress(allEntries).overall.due)
    setStreak(getStreak())
    setTodayActive(isTodayActive())
    setToday(getToday())
    setNext(getContinueTarget())
    setDoneLessons(getAllLessonProgress())
  }, [])

  const goalDone = today.l >= DAILY_GOAL.lessons && today.c >= DAILY_GOAL.cards
  const doneByPrefix = (prefix: string) =>
    Object.keys(doneLessons).filter((id) => id.startsWith(prefix)).length

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-lg shadow-sm shadow-sky-500/30">
            🧭
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">CodeCompass</h1>
            <p className="text-xs text-slate-500">Твой путь в код и не только</p>
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

      {/* Цель на сегодня */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-5 text-white shadow-lg shadow-sky-600/20">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-100">
            {goalDone ? 'Цель дня выполнена!' : 'Цель на сегодня'}
          </p>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
              todayActive ? 'bg-amber-400/90 text-amber-950' : 'bg-white/15 text-white'
            }`}
            title={
              todayActive
                ? 'Стрик защищён: сегодня уже занимался'
                : 'Позанимайся сегодня, чтобы продлить стрик'
            }
          >
            <IconFlame className="h-4.5 w-4.5" />
            {streak}
            <span className="font-medium">дн.</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <GoalRow label="Урок" done={today.l} total={DAILY_GOAL.lessons} />
          <GoalRow label="Карточки" done={today.c} total={DAILY_GOAL.cards} />
        </div>

        <div className="mt-4 flex gap-2">
          <Link to="/cards" className="flex-1">
            <Button variant="inverse" className="w-full">
              <IconPlay className="h-4.5 w-4.5" />
              Повторить{due > 0 ? ` · ${due}` : ''}
            </Button>
          </Link>
        </div>
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

      {/* Твой путь */}
      <h2 className="mt-1 text-sm font-bold uppercase tracking-wide text-slate-500">Твой путь</h2>
      <div className="flex flex-col gap-2.5">
        {learningPath.map((entry, i) =>
          entry.kind === 'course' ? (
            <Link key={entry.id} to={`/courses/${entry.id}`}>
              <Card interactive className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl dark:bg-slate-700/60">
                  {entry.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{entry.title}</p>
                  <div className="mt-1.5">
                    <ProgressBar done={doneByPrefix(entry.prefix)} total={entry.total} />
                  </div>
                  <p className="mt-1 text-xs tabular-nums text-slate-400">
                    {doneByPrefix(entry.prefix)} из {entry.total} уроков
                  </p>
                </div>
                <IconChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
              </Card>
            </Link>
          ) : (
            <Card
              key={`soon-${i}`}
              className="flex items-center gap-3 border-dashed p-4 opacity-75"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl grayscale dark:bg-slate-700/60">
                {entry.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[15px] font-semibold text-slate-500">{entry.title}</p>
                  <span className="shrink-0 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    скоро
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{entry.short}</p>
              </div>
            </Card>
          ),
        )}
      </div>

      {/* Справочник */}
      <Link to="/glossary">
        <Card interactive className="flex items-center gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-300">
            <IconGlossary className="h-5.5 w-5.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold">Справочник</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {allEntries.length} терминов по всем темам — поиск и подробные объяснения
            </p>
          </div>
          <IconChevronRight className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
        </Card>
      </Link>
    </div>
  )
}
