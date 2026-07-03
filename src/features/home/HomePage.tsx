import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { categories, allEntries } from '../../content'
import { getProgress, type Progress } from '../../lib/srs'

const emptyProgress: Progress = { total: 0, due: 0, studied: 0, learned: 0 }

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

export function HomePage() {
  const [progress, setProgress] = useState<{
    overall: Progress
    byCategory: Record<string, Progress>
  }>({ overall: emptyProgress, byCategory: {} })

  useEffect(() => {
    setProgress(getProgress(allEntries))
  }, [])

  const { overall, byCategory } = progress

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">🧭 CodeCompass</h1>
        <p className="text-slate-500">Путеводитель по программированию и вайб-кодингу</p>
      </header>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">К повторению сейчас</p>
            <p className="text-3xl font-bold">{overall.due}</p>
            <p className="text-xs text-slate-400">
              Изучено {overall.studied} из {overall.total}
            </p>
          </div>
          <Link to="/cards">
            <Button>Повторить</Button>
          </Link>
        </div>
        <ProgressBar done={overall.studied} total={overall.total} />
      </Card>

      <p className="text-sm font-semibold text-slate-500">Темы</p>
      <div className="flex flex-col gap-3">
        {categories.map((c) => {
          const p = byCategory[c.id] ?? emptyProgress
          return (
            <Card key={c.id} className="flex flex-col gap-3">
              <Link to={`/glossary?category=${c.id}`} className="flex items-center gap-3">
                <span className="text-3xl">{c.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{c.title}</p>
                  <div className="mt-1.5">
                    <ProgressBar done={p.studied} total={p.total} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    Изучено {p.studied} из {p.total}
                  </p>
                </div>
              </Link>
              {p.due > 0 && (
                <Link to={`/cards?category=${c.id}`}>
                  <Button variant="secondary" className="w-full py-2 text-sm">
                    Повторить {p.due}
                  </Button>
                </Link>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
