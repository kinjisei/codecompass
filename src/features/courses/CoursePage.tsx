import { Link, Navigate, useParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { allCourses } from '../../content/courses'
import { getAllLessonProgress, getCourseStats } from '../../lib/courseProgress'

export function CoursePage() {
  const { courseId } = useParams()
  const course = allCourses.find((c) => c.id === courseId)
  if (!course) return <Navigate to="/courses" replace />

  const stats = getCourseStats(course)
  const progress = getAllLessonProgress()
  const allDone = stats.totalLessons > 0 && stats.doneLessons === stats.totalLessons

  return (
    <div className="flex flex-col gap-4">
      <Link to="/courses" className="text-sm font-medium text-sky-600 dark:text-sky-400">
        ← Все курсы
      </Link>

      <header>
        <h1 className="text-2xl font-bold">
          {course.icon} {course.title}
        </h1>
        <p className="mt-1 text-slate-500">{course.description}</p>
      </header>

      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Пройдено уроков</p>
          <p className="text-3xl font-bold">
            {stats.doneLessons}
            <span className="text-base font-normal text-slate-400"> из {stats.totalLessons}</span>
          </p>
        </div>
        {allDone ? (
          <p className="text-2xl">🎉</p>
        ) : (
          stats.next && (
            <Link to={`/courses/${course.id}/${stats.next.id}`}>
              <Button>{stats.doneLessons === 0 ? 'Начать' : 'Продолжить'}</Button>
            </Link>
          )
        )}
      </Card>

      {course.modules.map((mod, mi) => (
        <div key={mod.id} className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-slate-500">
            Модуль {mi + 1}. {mod.title}
          </p>
          <p className="-mt-1 text-xs text-slate-400">{mod.intro}</p>
          <div className="flex flex-col gap-2">
            {mod.lessons.map((lesson, li) => {
              const p = progress[lesson.id]
              return (
                <Link key={lesson.id} to={`/courses/${course.id}/${lesson.id}`}>
                  <Card className="flex items-center gap-3 py-4">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        p
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p ? '✓' : li + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-xs text-slate-400">
                        {lesson.minutes} мин
                        {p && p.quizTotal > 0 && ` · квиз ${p.quizBest}/${p.quizTotal}`}
                      </p>
                    </div>
                    <span className="text-slate-300 dark:text-slate-600">›</span>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
