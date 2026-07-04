import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { categories, allEntries } from '../../content'
import type { CategoryId, GlossaryEntry } from '../../types'

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900'

const entryById = new Map<string, GlossaryEntry>(allEntries.map((e) => [e.id, e]))

export function GlossaryPage() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') as CategoryId | null
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  // id термина, к которому нужно проскроллить после перехода по «Связано».
  const scrollTarget = useRef<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allEntries.filter((e) => {
      if (activeCategory && e.categoryId !== activeCategory) return false
      if (!q) return true
      return e.term.toLowerCase().includes(q) || e.short.toLowerCase().includes(q)
    })
  }, [activeCategory, query])

  // Переход по связанному термину: сбрасываем фильтры (чтобы цель точно была видна),
  // открываем её и запоминаем, что нужно проскроллить.
  const goToEntry = (id: string) => {
    setQuery('')
    setParams({})
    setOpenId(id)
    scrollTarget.current = id
  }

  useEffect(() => {
    if (!scrollTarget.current) return
    const el = document.getElementById(`entry-${scrollTarget.current}`)
    scrollTarget.current = null
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [openId, filtered])

  // Переход извне на конкретный термин (например, из урока курса): /glossary?entry=<id>
  const entryParam = params.get('entry')
  useEffect(() => {
    if (!entryParam) return
    setOpenId(entryParam)
    scrollTarget.current = entryParam
    setParams({}, { replace: true })
  }, [entryParam, setParams])

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">📚 Глоссарий</h1>
      </header>

      <input
        className={inputClass}
        placeholder="Поиск термина…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParams({})}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            !activeCategory
              ? 'bg-sky-600 text-white'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParams({ category: c.id })}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === c.id
                ? 'bg-sky-600 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {c.icon} {c.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((e) => {
          const open = openId === e.id
          const related = (e.related ?? [])
            .map((id) => entryById.get(id))
            .filter((x): x is GlossaryEntry => Boolean(x))
          return (
            <Card
              key={e.id}
              id={`entry-${e.id}`}
              className="cursor-pointer scroll-mt-6"
              onClick={() => setOpenId(open ? null : e.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{e.term}</p>
                <span className="text-slate-400">{open ? '−' : '+'}</span>
              </div>
              <p className="text-sm text-slate-500">{e.short}</p>
              {open && (
                <div className="mt-3 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                  <p className="whitespace-pre-line text-slate-700 dark:text-slate-200">
                    {e.detail}
                  </p>
                  {e.example && (
                    <p className="mt-2 italic text-slate-500">Пример: {e.example}</p>
                  )}
                  {related.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">Связано:</span>
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={(ev) => {
                            ev.stopPropagation()
                            goToEntry(r.id)
                          }}
                          className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/70"
                        >
                          {r.term}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-slate-500">Ничего не найдено</p>
        )}
      </div>
    </div>
  )
}
