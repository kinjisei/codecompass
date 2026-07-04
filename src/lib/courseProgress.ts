// ============================================================================
// Прогресс по курсам (пройденные уроки и результаты квизов) — в localStorage,
// по той же схеме, что прогресс карточек в srs.ts. Ключ попадает в резервную
// копию автоматически (префикс codecompass., см. lib/backup.ts).
// ============================================================================
import type { Course, Lesson } from '../types'

const STORAGE_KEY = 'codecompass.course_progress.v1'

export interface LessonProgress {
  completedAt: string
  /** Лучший результат квиза за все попытки. */
  quizBest: number
  quizTotal: number
}

export function getAllLessonProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, LessonProgress>) : {}
  } catch {
    return {}
  }
}

/** Отметить урок пройденным. Дата первого прохождения и лучший счёт сохраняются. */
export function completeLesson(lessonId: string, quizScore: number, quizTotal: number): void {
  const all = getAllLessonProgress()
  const prev = all[lessonId]
  all[lessonId] = {
    completedAt: prev?.completedAt ?? new Date().toISOString(),
    quizBest: Math.max(prev?.quizBest ?? 0, quizScore),
    quizTotal,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export interface CourseStats {
  totalLessons: number
  doneLessons: number
  /** Первый непройденный урок — для кнопки «Продолжить». */
  next: Lesson | undefined
}

export function getCourseStats(course: Course): CourseStats {
  const all = getAllLessonProgress()
  let totalLessons = 0
  let doneLessons = 0
  let next: Lesson | undefined
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      totalLessons++
      if (all[lesson.id]) doneLessons++
      else next ??= lesson
    }
  }
  return { totalLessons, doneLessons, next }
}
