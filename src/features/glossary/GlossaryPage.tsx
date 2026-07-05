import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card } from '../../components/Card'
import { IconChevronRight, IconSearch } from '../../components/icons'
import { categories, allEntries } from '../../content'
import type { CategoryId, GlossaryEntry } from '../../types'

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
      <header className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Справочник</h1>
        <span className="text-xs tabular-nums text-slate-400">
          {filtered.length} из {allEntries.length}
        </span>
      </header>

      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[15px] shadow-sm shadow-slate-900/[0.03] outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-600 dark:bg-slate-800"
          placeholder="Поиск термина…"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setParams({})}
          className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            !activeCategory
              ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
          }`}
        >
          Все
        </button>
        {/* Учебные темы — первыми, справочные (легаси) — в конце ленты, приглушённые. */}
        {[...categories.filter((c) => !c.reference), ...categories.filter((c) => c.reference)].map(
          (c) => (
            <button
              key={c.id}
              onClick={() => setParams({ category: c.id })}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === c.id
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/25'
                  : c.reference
                    ? 'bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:ring-slate-700'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
              }`}
            >
              {c.icon} {c.title}
            </button>
          ),
        )}
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
              interactive
              className="scroll-mt-6 p-4"
              onClick={() => setOpenId(open ? null : e.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold leading-snug">{e.term}</p>
                <IconChevronRight
                  className={`h-4.5 w-4.5 shrink-0 text-slate-300 transition-transform duration-200 dark:text-slate-600 ${
                    open ? 'rotate-90' : ''
                  }`}
                />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{e.short}</p>
              {open && (
                <div className="mt-3 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                  <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">
                    {e.detail}
                  </p>
                  {e.example && (
                    <p className="mt-3 rounded-xl bg-slate-100/80 p-3 italic leading-relaxed text-slate-500 dark:bg-slate-700/40 dark:text-slate-400">
                      Пример: {e.example}
                    </p>
                  )}
                  {related.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Связано:
                      </span>
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={(ev) => {
                            ev.stopPropagation()
                            goToEntry(r.id)
                          }}
                          className="cursor-pointer rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/70"
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
          <Card className="py-8 text-center">
            <p className="font-semibold text-slate-500">Ничего не найдено</p>
            <p className="mt-1 text-sm text-slate-400">
              Попробуй другое слово или сбрось фильтр темы.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
