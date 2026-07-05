// ============================================================================
// Интервальное повторение уроков: в сессию «Повторения» подмешиваются
// квиз-вопросы из ПРОЙДЕННЫХ уроков — retrieval practice (PLAN-3.0 §4).
// Выбор простой и честный: уроки, которые дольше всего не повторялись.
// ВАЖНО: файл импортирует контент курсов — подключать только из ленивых
// страниц (Повторение уже лениво), чтобы не раздувать стартовый чанк.
// ============================================================================
import { allCourses, flatLessons } from '../content/courses'
import { getAllLessonProgress } from './courseProgress'
import type { Lesson, QuizQuestion } from '../types'

const STORAGE_KEY = 'codecompass.lesson_review.v1'

type ReviewLog = Record<string, string> // lessonId → ISO-дата последнего повторения

function loadAll(): ReviewLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ReviewLog) : {}
  } catch {
    return {}
  }
}

export interface LessonQuestion {
  question: QuizQuestion
  lessonId: string
  lessonTitle: string
  courseId: string
  courseTitle: string
}

/** Минимальный «возраст» урока для повторения — не гоняем только что пройденное. */
const MIN_AGE_MS = 2 * 24 * 60 * 60 * 1000 // 2 дня

/**
 * Подобрать вопросы для сессии: по одному случайному вопросу из `limit`
 * пройденных уроков, которые дольше всего не повторялись.
 */
export function getLessonQuestions(limit = 5): LessonQuestion[] {
  const progress = getAllLessonProgress()
  const reviewed = loadAll()
  const now = Date.now()

  const candidates: { lesson: Lesson; courseId: string; courseTitle: string; lastTouch: number }[] = []
  for (const course of allCourses) {
    for (const lesson of flatLessons(course)) {
      const p = progress[lesson.id]
      if (!p || lesson.quiz.length === 0) continue
      const completedAt = Date.parse(p.completedAt) || 0
      const lastReview = reviewed[lesson.id] ? Date.parse(reviewed[lesson.id]) : 0
      const lastTouch = Math.max(completedAt, lastReview)
      if (now - lastTouch < MIN_AGE_MS) continue // слишком свежее
      candidates.push({ lesson, courseId: course.id, courseTitle: course.title, lastTouch })
    }
  }

  // Самые «залежавшиеся» — первыми.
  candidates.sort((a, b) => a.lastTouch - b.lastTouch)

  return candidates.slice(0, limit).map(({ lesson, courseId, courseTitle }) => ({
    question: lesson.quiz[Math.floor(Math.random() * lesson.quiz.length)],
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    courseId,
    courseTitle,
  }))
}

/** Отметить, что вопрос урока повторён (сдвигает урок в конец очереди). */
export function markLessonReviewed(lessonId: string): void {
  const all = loadAll()
  all[lessonId] = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
