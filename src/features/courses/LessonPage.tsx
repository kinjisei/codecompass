import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import {
  IconArrowLeft,
  IconCheck,
  IconCheckCircle,
  IconClock,
  IconTrophy,
  IconX,
} from '../../components/icons'
import { allCourses, flatLessons } from '../../content/courses'
import { allEntries } from '../../content'
import {
  completeLesson,
  getAllLessonProgress,
  setContinueTarget,
} from '../../lib/courseProgress'
import { CompareBlock, FindErrorBlock, OrderBlock, PracticeBlock } from './exercises'
import type { GlossaryEntry, Lesson, LessonBlock } from '../../types'

const entryById = new Map(allEntries.map((e) => [e.id, e]))

/** Цветная плашка-вставка внутри урока (пример / совет / предостережение / практика). */
function Callout({ label, tone, text }: { label: string; tone: 'sky' | 'emerald' | 'amber' | 'violet'; text: string }) {
  const tones = {
    sky: 'border-sky-200/80 bg-sky-50/80 dark:border-sky-900/60 dark:bg-sky-950/40',
    emerald:
      'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/40',
    amber: 'border-amber-200/80 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/40',
    violet:
      'border-violet-200/80 bg-violet-50/80 dark:border-violet-900/60 dark:bg-violet-950/40',
  }
  const labels = {
    sky: 'text-sky-700 dark:text-sky-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
    violet: 'text-violet-700 dark:text-violet-300',
  }
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className={`text-sm font-bold ${labels[tone]}`}>{label}</p>
      <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
        {text}
      </p>
    </div>
  )
}

function BlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'h':
      return <h2 className="mt-3 text-lg font-bold">{block.text}</h2>
    case 'p':
      return (
        <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
          {block.text}
        </p>
      )
    case 'example':
      return <Callout label={`💬 ${block.title ?? 'Пример'}`} tone="sky" text={block.text} />
    case 'tip':
      return <Callout label="💡 Совет" tone="emerald" text={block.text} />
    case 'warn':
      return <Callout label="⚠️ Важно" tone="amber" text={block.text} />
    case 'try':
      return <Callout label="🧪 Попробуй сам" tone="violet" text={block.text} />
    case 'code':
      return (
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-relaxed text-slate-100 shadow-inner dark:bg-slate-900/80 dark:ring-1 dark:ring-slate-700">
          <code>{block.text}</code>
        </pre>
      )
    case 'compare':
      return (
        <CompareBlock
          prompt={block.prompt}
          a={block.a}
          b={block.b}
          better={block.better}
          explain={block.explain}
        />
      )
    case 'find-error':
      return (
        <FindErrorBlock
          prompt={block.prompt}
          fragments={block.fragments}
          wrong={block.wrong}
          explain={block.explain}
        />
      )
    case 'order':
      return <OrderBlock prompt={block.prompt} steps={block.steps} explain={block.explain} />
    case 'practice':
      return (
        <PracticeBlock id={block.id} title={block.title} intro={block.intro} steps={block.steps} />
      )
  }
}

/** Пометка глубины урока по принципу двух глубин (PLAN-3.0 §2). */
function DepthBadge({ depth }: { depth?: Lesson['depth'] }) {
  if (!depth) return null
  return depth === 'skill' ? (
    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
      Навык
    </span>
  ) : (
    <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
      Обзор
    </span>
  )
}

/** Квиз в конце урока: по одному вопросу, после ответа — объяснение. */
function Quiz({ lesson, courseId, nextLessonId }: { lesson: Lesson; courseId: string; nextLessonId?: string }) {
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const total = lesson.quiz.length
  const q = lesson.quiz[qIndex]

  const pick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (qIndex + 1 < total) {
      setQIndex(qIndex + 1)
      setSelected(null)
    } else {
      completeLesson(lesson.id, score, total)
      setFinished(true)
    }
  }

  const reset = () => {
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (total === 0) {
    return (
      <Button
        onClick={() => {
          completeLesson(lesson.id, 0, 0)
          setFinished(true)
        }}
      >
        Отметить урок пройденным
      </Button>
    )
  }

  if (finished) {
    return (
      <Card className="flex flex-col items-center gap-1 text-center">
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            score === total
              ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/40'
              : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40'
          }`}
        >
          {score === total ? (
            <IconTrophy className="h-7 w-7" />
          ) : (
            <IconCheck className="h-7 w-7" />
          )}
        </span>
        <p className="mt-2 font-bold">
          Урок пройден! Квиз: {score} из {total}
        </p>
        {score < total && (
          <p className="text-sm text-slate-500">
            Можно пройти квиз ещё раз — засчитается лучший результат.
          </p>
        )}
        <div className="mt-4 flex w-full gap-2">
          <Button variant="secondary" className="flex-1" onClick={reset}>
            Ещё раз
          </Button>
          {nextLessonId ? (
            <Link to={`/courses/${courseId}/${nextLessonId}`} className="flex-1">
              <Button className="w-full">Следующий урок →</Button>
            </Link>
          ) : (
            <Link to={`/courses/${courseId}`} className="flex-1">
              <Button className="w-full">К курсу</Button>
            </Link>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Проверь себя · {qIndex + 1} из {total}
        </p>
        <div className="flex gap-1">
          {lesson.quiz.map((question, i) => (
            <span
              key={question.id}
              className={`h-1.5 w-4 rounded-full ${
                i < qIndex
                  ? 'bg-emerald-500'
                  : i === qIndex
                    ? 'bg-sky-500'
                    : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
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
          <Button onClick={next}>{qIndex + 1 < total ? 'Дальше' : 'Завершить урок'}</Button>
        </>
      )}
    </Card>
  )
}

export function LessonPage() {
  const { courseId, lessonId } = useParams()
  const course = allCourses.find((c) => c.id === courseId)

  // При переходе «Следующий урок» страница остаётся той же — скроллим наверх сами.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [lessonId])

  const lessons = course ? flatLessons(course) : []
  const index = lessons.findIndex((l) => l.id === lessonId)
  const lesson = index >= 0 ? lessons[index] : undefined

  // Запоминаем последний открытый урок — для «Продолжить обучение» на главной.
  useEffect(() => {
    if (!course || !lesson) return
    setContinueTarget({
      courseId: course.id,
      courseIcon: course.icon,
      courseTitle: course.title,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    })
  }, [course, lesson])

  if (!course) return <Navigate to="/courses" replace />
  if (!lesson) return <Navigate to={`/courses/${course.id}`} replace />

  const nextLesson = lessons[index + 1]
  const mod = course.modules.find((m) => m.lessons.some((l) => l.id === lesson.id))
  const done = Boolean(getAllLessonProgress()[lesson.id])
  const terms = (lesson.termIds ?? [])
    .map((id) => entryById.get(id))
    .filter((e): e is GlossaryEntry => Boolean(e))

  return (
    // key: при переходе на следующий урок сбрасывает состояние квиза.
    <div key={lesson.id} className="flex flex-col gap-4">
      <Link
        to={`/courses/${course.id}`}
        className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400"
      >
        <IconArrowLeft className="h-4 w-4" />
        {course.title}
      </Link>

      <header>
        {mod && (
          <p className="text-xs font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            {mod.title}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold leading-tight">{lesson.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
          <DepthBadge depth={lesson.depth} />
          <span className="flex items-center gap-1">
            <IconClock className="h-3.5 w-3.5" />
            {lesson.minutes} мин чтения
          </span>
          {done && (
            <span className="flex items-center gap-1 font-semibold text-emerald-500">
              <IconCheckCircle className="h-3.5 w-3.5" />
              пройден
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3.5">
        {lesson.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      {terms.length > 0 && (
        <Card className="py-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Термины из урока
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {terms.map((t) => (
              <Link
                key={t.id}
                to={`/glossary?entry=${t.id}`}
                className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/70"
              >
                {t.term}
              </Link>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-slate-400">
            Эти термины уже в твоих карточках — система повторения напомнит их сама.
          </p>
        </Card>
      )}

      <Quiz lesson={lesson} courseId={course.id} nextLessonId={nextLesson?.id} />
    </div>
  )
}
