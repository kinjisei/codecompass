import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { categories, allEntries } from '../../content'
import { getStats } from '../../lib/srs'

export function HomePage() {
  const [stats, setStats] = useState({ total: 0, due: 0, learned: 0 })

  useEffect(() => {
    setStats(getStats(allEntries))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">🧭 CodeCompass</h1>
        <p className="text-slate-500">Путеводитель по программированию и вайб-кодингу</p>
      </header>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">К повторению сейчас</p>
          <p className="text-3xl font-bold">{stats.due}</p>
          <p className="text-xs text-slate-400">
            Выучено {stats.learned} из {stats.total}
          </p>
        </div>
        <Link to="/cards">
          <Button>Повторить</Button>
        </Link>
      </Card>

      <p className="text-sm font-semibold text-slate-500">Темы</p>
      <div className="flex flex-col gap-3">
        {categories.map((c) => (
          <Link key={c.id} to={`/glossary?category=${c.id}`}>
            <Card className="flex items-center gap-3">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-slate-500">{c.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}