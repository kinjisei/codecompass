// ============================================================================
// Интервальное повторение терминов (обёртка над ts-fsrs), состояние — в localStorage.
// Нет Supabase: это личный однопользовательский инструмент на одном телефоне,
// синхронизация между устройствами не нужна.
// ============================================================================
import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating as FsrsRating,
  State,
  type Card as FsrsCard,
  type Grade,
} from 'ts-fsrs'
import type { GlossaryEntry, Rating, ReviewState, ReviewStateName } from '../types'

const STORAGE_KEY = 'codecompass.review_states.v1'
const scheduler = fsrs(generatorParameters({ enable_fuzz: true }))

const stateNameToEnum: Record<ReviewStateName, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
}

function stateEnumToName(s: State): ReviewStateName {
  switch (s) {
    case State.New:
      return 'new'
    case State.Learning:
      return 'learning'
    case State.Review:
      return 'review'
    default:
      return 'relearning'
  }
}

const ratingMap: Record<Rating, Grade> = {
  again: FsrsRating.Again,
  hard: FsrsRating.Hard,
  good: FsrsRating.Good,
  easy: FsrsRating.Easy,
}

function loadAll(): Record<string, ReviewState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, ReviewState>) : {}
  } catch {
    return {}
  }
}

function saveAll(states: Record<string, ReviewState>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
}

function toFsrsCard(state: ReviewState | undefined, now: Date): FsrsCard {
  const base = createEmptyCard(now)
  if (!state || state.state === 'new') return base
  return {
    ...base,
    due: new Date(state.due),
    stability: state.stability,
    difficulty: state.difficulty,
    reps: state.reps,
    lapses: state.lapses,
    state: stateNameToEnum[state.state],
    last_review: state.last_review ? new Date(state.last_review) : undefined,
  }
}

export interface DueEntry {
  entry: GlossaryEntry
  state: ReviewState | undefined
}

/** Термины к повторению: новые (без истории) + просроченные (due <= сейчас). Новые — первыми. */
export function getDueEntries(entries: GlossaryEntry[], limit = 30): DueEntry[] {
  const states = loadAll()
  const now = new Date()

  const fresh: DueEntry[] = []
  const overdue: DueEntry[] = []

  for (const entry of entries) {
    const state = states[entry.id]
    if (!state) {
      fresh.push({ entry, state: undefined })
    } else if (new Date(state.due) <= now) {
      overdue.push({ entry, state })
    }
  }

  overdue.sort((a, b) => new Date(a.state!.due).getTime() - new Date(b.state!.due).getTime())

  return [...fresh, ...overdue].slice(0, limit)
}

/** Записать оценку и посчитать следующий показ (FSRS), сохранить в localStorage. */
export function reviewEntry(entryId: string, existing: ReviewState | undefined, rating: Rating): void {
  const now = new Date()
  const fsrsCard = toFsrsCard(existing, now)
  const { card: next } = scheduler.next(fsrsCard, now, ratingMap[rating])

  const states = loadAll()
  states[entryId] = {
    entryId,
    due: next.due.toISOString(),
    stability: next.stability,
    difficulty: next.difficulty,
    reps: next.reps,
    lapses: next.lapses,
    state: stateEnumToName(next.state),
    last_review: (next.last_review ?? now).toISOString(),
  }
  saveAll(states)
}

/** Прогресс для дашборда: сколько терминов всего / выучено / к повторению сейчас. */
export function getStats(entries: GlossaryEntry[]): { total: number; due: number; learned: number } {
  const states = loadAll()
  const learned = Object.values(states).filter((s) => s.state === 'review').length
  return {
    total: entries.length,
    due: getDueEntries(entries, entries.length).length,
    learned,
  }
}