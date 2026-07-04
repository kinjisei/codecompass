import { useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { IconArrowLeft, IconDownload, IconFlame, IconUpload } from '../../components/icons'
import { allEntries, categories } from '../../content'
import { allCourses } from '../../content/courses'
import { exportBackup, importBackup } from '../../lib/backup'
import { getStreak } from '../../lib/activity'

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-100/80 p-3 text-center dark:bg-slate-700/40">
      <p className="text-xl font-extrabold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}

export function SettingsPage() {
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onExport = () => {
    exportBackup()
    setMessage({ kind: 'ok', text: 'Файл резервной копии сохранён в загрузки.' })
  }

  const onImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!window.confirm('Текущий прогресс будет заменён данными из файла. Продолжить?')) return
    try {
      const count = await importBackup(file)
      setMessage({ kind: 'ok', text: `Готово: восстановлено записей — ${count}.` })
    } catch (err) {
      setMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Не удалось прочитать файл.',
      })
    }
  }

  const lessonCount = allCourses.reduce(
    (sum, course) => sum + course.modules.reduce((m, mod) => m + mod.lessons.length, 0),
    0,
  )

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/"
        className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400"
      >
        <IconArrowLeft className="h-4 w-4" />
        Главная
      </Link>

      <header>
        <h1 className="text-2xl font-bold">Настройки</h1>
      </header>

      <Card className="flex flex-col gap-3">
        <p className="font-bold">Резервная копия</p>
        <p className="text-sm leading-relaxed text-slate-500">
          Весь прогресс (повторение карточек и пройденные уроки) хранится только на этом
          устройстве. Время от времени делай экспорт — файл пригодится при переустановке
          приложения или переходе на новый телефон.
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onExport}>
            <IconDownload className="h-4.5 w-4.5" />
            Экспорт
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => fileRef.current?.click()}>
            <IconUpload className="h-4.5 w-4.5" />
            Импорт
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImport}
          />
        </div>
        {message && (
          <p
            className={`text-sm ${
              message.kind === 'ok'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message.text}
          </p>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-bold">О приложении</p>
          <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <IconFlame className="h-3.5 w-3.5" />
            {getStreak()} дн.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatTile value={allEntries.length} label="Терминов" />
          <StatTile value={categories.length} label="Тем" />
          <StatTile value={allCourses.length} label="Курсов" />
          <StatTile value={lessonCount} label="Уроков" />
        </div>
        <p className="text-xs text-slate-400">
          CodeCompass — личный путеводитель по программированию и вайб-кодингу.
        </p>
      </Card>
    </div>
  )
}
