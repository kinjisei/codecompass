// ============================================================================
// Журнал активности и стрик: отмечаем дни, в которые было хоть одно повторение
// карточки или пройден урок. Ключ с префиксом codecompass. — попадает в бэкап.
// ============================================================================

const STORAGE_KEY = 'codecompass.activity.v1'

type ActivityLog = Record<string, number> // 'ГГГГ-ММ-ДД' (локальная дата) → число действий

function dayKey(d: Date): string {
  // 'sv' даёт формат ГГГГ-ММ-ДД в локальном часовом поясе.
  return d.toLocaleDateString('sv')
}

function loadAll(): ActivityLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ActivityLog) : {}
  } catch {
    return {}
  }
}

/** Засчитать одно действие (повторение карточки / пройденный урок) за сегодня. */
export function recordActivity(): void {
  const all = loadAll()
  const key = dayKey(new Date())
  all[key] = (all[key] ?? 0) + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

/**
 * Стрик: сколько дней подряд была активность.
 * Сегодняшний день без активности стрик не рвёт (день ещё не кончился) —
 * отсчёт тогда идёт со вчера.
 */
export function getStreak(): number {
  const all = loadAll()
  const cursor = new Date()
  if (!all[dayKey(cursor)]) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (all[dayKey(cursor)]) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Была ли активность сегодня (стрик уже «защищён»). */
export function isTodayActive(): boolean {
  return Boolean(loadAll()[dayKey(new Date())])
}
