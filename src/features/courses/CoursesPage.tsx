import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { ProgressRing } from '../../components/Progress'
import { IconCheckCircle } from '../../components/icons'
import { allCourses } from '../../content/courses'
import { getCourseStats } from '../../lib/courseProgress'

export function CoursesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">Курсы</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Уроки с проверкой знаний. Термины из уроков попадают в карточки повторения.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {allCourses.map((course) => {
          const stats = getCourseStats(course)
          const done = stats.doneLessons === stats.totalLessons && stats.totalLessons > 0
          return (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <Card interactive className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/60 text-2xl dark:from-slate-700 dark:to-slate-700/40">
                  {course.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{course.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {course.description}
                  </p>
                  <p className="mt-1.5 text-xs font-medium tabular-nums text-slate-400">
                    Пройдено {stats.doneLessons} из {stats.totalLessons} уроков
                  </p>
                </div>
                <div className="shrink-0">
                  {done ? (
                    <IconCheckCircle className="h-11 w-11 text-emerald-500" />
                  ) : (
                    <ProgressRing done={stats.doneLessons} total={stats.totalLessons} />
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
