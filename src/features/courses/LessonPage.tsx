import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { allCourses, flatLessons } from '../../content/courses'
import { allEntries } from '../../content'
import { completeLesson, getAllLessonProgress } from '../../lib/courseProgress'
import type { GlossaryEntry, Lesson, LessonBlock } from '../../types'

const entryById = new Map(allEntries.map((e) => [e.id, e]))

/** Цветная плашка-вставка внутри урока (совет / предостережение / практика). */
function Callout({ label, tone, text }: { label: string; tone: 'sky' | 'emerald' | 'amber' | 'violet'; text: string }) {
  const tones = {
    sky: 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40',
    emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40',
    amber: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40',
    violet: 'border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40',
  }
  const labels = {
    sky: 'text-sky-700 dark:text-sky-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    amber: 'text-amber-700 dark:text-amber-300',
    violet: 'text-violet-700 dark:text-violet-300',
  }
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className={`text-sm font-semibold ${labels[tone]}`}>{label}</p>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {text}
      </p>
    </div>
  )
}

function BlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'h':
      return <h2 className="mt-2 text-lg font-bold">{block.text}</h2>
    case 'p':
      return (
        <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">
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
        <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
          <code>{block.text}</code>
        </pre>
      )
  }
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
      <Card className="text-center">
        <p className="text-4xl">{score === total ? '🏆' : '✅'}</p>
        <p className="mt-2 font-semibold">
          Урок пройден! Квиз: {score} из {total}
        </p>
        {score < total && (
          <p className="mt-1 text-sm text-slate-500">
            Можно пройти квиз ещё раз — засчитается лучший результат.
          </p>
        )}
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="secondary" onClick={reset}>
            Ещё раз
          </Button>
          {nextLessonId ? (
            <Link to={`/courses/${courseId}/${nextLessonId}`}>
              <Button>Следующий урок →</Button>
            </Link>
          ) : (
            <Link to={`/courses/${courseId}`}>
              <Button>К курсу</Button>
            </Link>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Проверь себя · {qIndex + 1} из {total}
      </p>
      <p className="font-semibold">{q.question}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          let cls =
            'border-slate-200 bg-white hover:border-sky-400 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-sky-500'
          if (selected !== null) {
            if (i === q.correct) {
              cls =
                'border-emerald-500 bg-emerald-50 font-medium text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200'
            } else if (i === selected) {
              cls = 'border-red-400 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-200'
            } else {
              cls = 'border-slate-200 opacity-50 dark:border-slate-600'
            }
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={selected !== null}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <>
          <div
            className={`rounded-xl p-3 text-sm ${
              selected === q.correct
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
            }`}
          >
            <p className="font-semibold">{selected === q.correct ? 'Верно!' : 'Не совсем.'}</p>
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

  if (!course) return <Navigate to="/courses" replace />

  const lessons = flatLessons(course)
  const index = lessons.findIndex((l) => l.id === lessonId)
  if (index === -1) return <Navigate to={`/courses/${course.id}`} replace />

  const lesson = lessons[index]
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
        className="text-sm font-medium text-sky-600 dark:text-sky-400"
      >
        ← {course.title}
      </Link>

      <header>
        {mod && <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{mod.title}</p>}
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <p className="mt-1 text-xs text-slate-400">
          {lesson.minutes} мин чтения
          {done && ' · пройден ✓'}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {lesson.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      {terms.length > 0 && (
        <Card className="py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Термины из урока
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {terms.map((t) => (
              <Link
                key={t.id}
                to={`/glossary?entry=${t.id}`}
                className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/70"
              >
                {t.term}
              </Link>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Эти термины уже в твоих карточках — система повторения напомнит их сама.
          </p>
        </Card>
      )}

      <Quiz lesson={lesson} courseId={course.id} nextLessonId={nextLesson?.id} />
    </div>
  )
}
