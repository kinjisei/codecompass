// ============================================================================
// Прогресс практикумов-чеклистов (блоки type: 'practice' в уроках).
// Ключ с префиксом codecompass. — попадает в резервную копию автоматически.
// ============================================================================

const STORAGE_KEY = 'codecompass.practice.v1'

type PracticeState = Record<string, number[]> // practiceId → индексы отмеченных шагов

function loadAll(): PracticeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PracticeState) : {}
  } catch {
    return {}
  }
}

export function getPracticeChecked(practiceId: string): number[] {
  return loadAll()[practiceId] ?? []
}

export function togglePracticeStep(practiceId: string, step: number): number[] {
  const all = loadAll()
  const current = new Set(all[practiceId] ?? [])
  if (current.has(step)) current.delete(step)
  else current.add(step)
  all[practiceId] = [...current].sort((a, b) => a - b)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return all[practiceId]
}
