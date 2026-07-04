import { NavLink } from 'react-router-dom'
import { IconCards, IconCourses, IconGlossary, IconHome } from './icons'

const tabs = [
  { to: '/', label: 'Главная', Icon: IconHome, end: true },
  { to: '/courses', label: 'Курсы', Icon: IconCourses, end: false },
  { to: '/glossary', label: 'Глоссарий', Icon: IconGlossary, end: false },
  { to: '/cards', label: 'Карточки', Icon: IconCards, end: false },
]

export function BottomNav() {
  return (
    <nav className="nav-safe fixed inset-x-0 bottom-0 z-10 border-t border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-screen-sm items-stretch justify-around">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-11 flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 hover:text-slate-500 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`rounded-full px-3.5 py-0.5 transition-colors duration-150 ${
                    isActive ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-transparent'
                  }`}
                >
                  <Icon className="h-5.5 w-5.5" strokeWidth={isActive ? 2.2 : 2} />
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
