// ============================================================================
// Резервная копия прогресса: выгрузка и загрузка всех данных приложения
// (localStorage-ключи с префиксом codecompass.) в JSON-файл.
// Зачем: прогресс живёт только в браузере — при переустановке PWA или переходе
// на APK он потеряется. Экспорт = страховка и мост между установками.
// ============================================================================

const PREFIX = 'codecompass.'

interface BackupFile {
  app: 'codecompass'
  version: 1
  exportedAt: string
  data: Record<string, string>
}

/** Собрать все данные приложения и скачать их одним JSON-файлом. */
export function exportBackup(): void {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(PREFIX)) data[key] = localStorage.getItem(key) ?? ''
  }
  const payload: BackupFile = {
    app: 'codecompass',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `codecompass-backup-${payload.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Восстановить данные из файла резервной копии (заменяет текущие значения).
 * Возвращает число восстановленных записей; кидает Error с понятным текстом,
 * если файл не похож на резервную копию CodeCompass.
 */
export async function importBackup(file: File): Promise<number> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('Это не JSON-файл. Выбери файл, скачанный кнопкой «Экспорт».')
  }
  const backup = parsed as Partial<BackupFile>
  if (backup.app !== 'codecompass' || typeof backup.data !== 'object' || !backup.data) {
    throw new Error('Файл не похож на резервную копию CodeCompass.')
  }
  let count = 0
  for (const [key, value] of Object.entries(backup.data)) {
    if (key.startsWith(PREFIX) && typeof value === 'string') {
      localStorage.setItem(key, value)
      count++
    }
  }
  if (count === 0) throw new Error('В файле не нашлось данных CodeCompass.')
  return count
}
