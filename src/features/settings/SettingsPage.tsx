import { useRef, useState, type ChangeEvent } from 'react'
import { Card } from '../../components/Card'
import { Button } from '../../components/Button'
import { allEntries, categories } from '../../content'
import { allCourses } from '../../content/courses'
import { exportBackup, importBackup } from '../../lib/backup'

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
      <header>
        <h1 className="text-2xl font-bold">⚙️ Настройки</h1>
      </header>

      <Card className="flex flex-col gap-3">
        <p className="font-semibold">Резервная копия</p>
        <p className="text-sm text-slate-500">
          Весь прогресс (повторение карточек и пройденные уроки) хранится только на этом
          устройстве. Время от времени делай экспорт — файл пригодится при переустановке
          приложения или переходе на новый телефон.
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onExport}>
            Экспорт
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => fileRef.current?.click()}>
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

      <Card className="flex flex-col gap-2">
        <p className="font-semibold">О приложении</p>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
          <p>
            Терминов: <span className="font-semibold text-slate-700 dark:text-slate-200">{allEntries.length}</span>
          </p>
          <p>
            Тем: <span className="font-semibold text-slate-700 dark:text-slate-200">{categories.length}</span>
          </p>
          <p>
            Курсов: <span className="font-semibold text-slate-700 dark:text-slate-200">{allCourses.length}</span>
          </p>
          <p>
            Уроков: <span className="font-semibold text-slate-700 dark:text-slate-200">{lessonCount}</span>
          </p>
        </div>
        <p className="text-xs text-slate-400">
          CodeCompass — личный путеводитель по программированию и вайб-кодингу.
        </p>
      </Card>
    </div>
  )
}
