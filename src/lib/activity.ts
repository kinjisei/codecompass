// ============================================================================
// Журнал активности, стрик и дневная цель. Отмечаем карточки и уроки раздельно,
// чтобы «Путь» показывал прогресс цели дня (урок + карточки).
// Ключ с префиксом codecompass. — попадает в резервную копию.
// Старые записи (просто числа, до 3.0) читаются как «карточки».
// ============================================================================

const STORAGE_KEY = 'codecompass.activity.v1'

export type ActivityKind = 'card' | 'lesson'

interface DayActivity {
  c: number // повторено карточек
  l: number // пройдено уроков
}

type ActivityLog = Record<string, DayActivity | number>

function dayKey(d: Date): string {
  // 'sv' даёт формат ГГГГ-ММ-ДД в локальном часовом поясе.
  return d.toLocaleDateString('sv')
}

function normalize(value: DayActivity | number | undefined): DayActivity {
  if (value === undefined) return { c: 0, l: 0 }
  if (typeof value === 'number') return { c: value, l: 0 }
  return value
}

function loadAll(): ActivityLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ActivityLog) : {}
  } catch {
    return {}
  }
}

/** Засчитать действие за сегодня: повторение карточки или пройденный урок. */
export function recordActivity(kind: ActivityKind = 'card'): void {
  const all = loadAll()
  const key = dayKey(new Date())
  const day = normalize(all[key])
  if (kind === 'lesson') day.l += 1
  else day.c += 1
  all[key] = day
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

function hasActivity(value: DayActivity | number | undefined): boolean {
  const day = normalize(value)
  return day.c > 0 || day.l > 0
}

/**
 * Стрик: сколько дней подряд была активность.
 * Сегодняшний день без активности стрик не рвёт (день ещё не кончился) —
 * отсчёт тогда идёт со вчера.
 */
export function getStreak(): number {
  const all = loadAll()
  const cursor = new Date()
  if (!hasActivity(all[dayKey(cursor)])) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (hasActivity(all[dayKey(cursor)])) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Была ли активность сегодня (стрик уже «защищён»). */
export function isTodayActive(): boolean {
  return hasActivity(loadAll()[dayKey(new Date())])
}

/** Сегодняшние счётчики — для дневной цели на «Пути». */
export function getToday(): DayActivity {
  return normalize(loadAll()[dayKey(new Date())])
}

/** Дневная цель (константа осознанно простая; настройка — если попросит пользователь). */
export const DAILY_GOAL = { lessons: 1, cards: 10 }
