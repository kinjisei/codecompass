import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto min-h-screen max-w-screen-sm px-4 pb-24 pt-6">
        {/* Suspense — для лениво загружаемых страниц (курсы, настройки). */}
        <Suspense fallback={<p className="pt-10 text-center text-slate-400">Загрузка…</p>}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}