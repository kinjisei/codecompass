import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

function Loader() {
  return (
    <div className="flex justify-center pt-16">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
    </div>
  )
}

export function Layout() {
  return (
    <div className="min-h-dvh bg-slate-100/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="pb-nav mx-auto min-h-dvh max-w-screen-sm px-4 pt-5">
        {/* Suspense — для лениво загружаемых страниц (курсы, настройки). */}
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <BottomNav />
    </div>
  )
}