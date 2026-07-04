import { Link, Navigate, useParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { ProgressBar } from '../../components/Progress'
import { IconArrowLeft, IconCheck, IconPlay } from '../../components/icons'
import { allCourses } from '../../content/courses'
import { getAllLessonProgress, getCourseStats } from '../../lib/courseProgress'

export function CoursePage() {
  const { courseId } = useParams()
  const course = allCourses.find((c) => c.id === courseId)
  if (!course) return <Navigate to="/courses" replace />

  const stats = getCourseStats(course)
  const progress = getAllLessonProgress()
  const allDone = stats.totalLessons > 0 && stats.doneLessons === stats.totalLessons
  const pct = stats.totalLessons
    ? Math.round((stats.doneLessons / stats.totalLessons) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/courses"
        className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400"
      >
        <IconArrowLeft className="h-4 w-4" />
        Все курсы
      </Link>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-2xl dark:from-sky-900/50 dark:to-indigo-900/40">
            {course.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight">{course.title}</h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{course.description}</p>
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-500">
            <span>
              Пройдено {stats.doneLessons} из {stats.totalLessons}
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <ProgressBar done={stats.doneLessons} total={stats.totalLessons} tone="sky" />
        </div>
        {allDone ? (
          <p className="text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Курс пройден целиком — отличная работа!
          </p>
        ) : (
          stats.next && (
            <Link to={`/courses/${course.id}/${stats.next.id}`}>
              <Button className="w-full">
                <IconPlay className="h-4.5 w-4.5" />
                {stats.doneLessons === 0 ? 'Начать курс' : 'Продолжить'}
              </Button>
            </Link>
          )
        )}
      </Card>

      {course.modules.map((mod, mi) => (
        <section key={mod.id} className="flex flex-col gap-2">
          <div className="mt-1 px-1">
            <p className="text-xs font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
              Модуль {mi + 1}
            </p>
            <h2 className="font-bold">{mod.title}</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{mod.intro}</p>
          </div>
          <div className="flex flex-col gap-2">
            {mod.lessons.map((lesson, li) => {
              const p = progress[lesson.id]
              return (
                <Link key={lesson.id} to={`/courses/${course.id}/${lesson.id}`}>
                  <Card interactive className="flex items-center gap-3 px-4 py-3.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        p
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p ? <IconCheck className="h-4.5 w-4.5" /> : li + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug">{lesson.title}</p>
                      <p className="mt-0.5 text-xs tabular-nums text-slate-400">
                        {lesson.minutes} мин
                        {p && p.quizTotal > 0 && ` · квиз ${p.quizBest}/${p.quizTotal}`}
                      </p>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
