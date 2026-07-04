import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { allCourses } from '../../content/courses'
import { getCourseStats } from '../../lib/courseProgress'

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className="h-full rounded-full bg-emerald-500 transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function CoursesPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">🎓 Курсы</h1>
        <p className="text-slate-500">
          Уроки с проверкой знаний. Термины из уроков попадают в карточки повторения.
        </p>
      </header>

      {allCourses.map((course) => {
        const stats = getCourseStats(course)
        return (
          <Link key={course.id} to={`/courses/${course.id}`}>
            <Card className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{course.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{course.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{course.description}</p>
                </div>
              </div>
              <ProgressBar done={stats.doneLessons} total={stats.totalLessons} />
              <p className="text-xs text-slate-400">
                Пройдено {stats.doneLessons} из {stats.totalLessons} уроков
              </p>
            </Card>
          </Link>
        )
      })}

    </div>
  )
}
