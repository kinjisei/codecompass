export type CategoryId =
  | 'vibecoding'
  | 'git'
  | 'webdev'
  | 'flutter'
  | 'mobile-publish'
  | 'patterns'
  | 'algorithms'
  | 'react-ts'
  | 'testing'
  | 'backend-baas'
  | 'qa'
  | 'kotlin'
  | 'js-basics'
  | 'ai-services'
  | 'supabase'
  | 'vercel'
  | 'css'
  | 'net'
  | 'security'
  | 'cli'
  | 'npm'
  | 'html'
  | 'debug'
  | 'vibe-practice'
  | 'qa-tools'
  | 'code-reading'
  | 'db-deep'
  | 'prompting'
  | 'ai-core'
  | 'eq'

export interface Category {
  id: CategoryId
  title: string
  icon: string
  description: string
}

export interface GlossaryEntry {
  id: string
  categoryId: CategoryId
  term: string
  /** Короткая формулировка — используется как вопрос на карточке. */
  short: string
  /** Подробное объяснение — для глоссария и обратной стороны карточки. */
  detail: string
  example?: string
  related?: string[]
}

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export type ReviewStateName = 'new' | 'learning' | 'review' | 'relearning'

export interface ReviewState {
  entryId: string
  due: string
  stability: number
  difficulty: number
  reps: number
  lapses: number
  state: ReviewStateName
  last_review?: string
}

// ---------------------------------------------------------------------------
// Курсы: структурированные уроки с квизами (вкладка «Курсы»).

export interface QuizQuestion {
  id: string
  question: string
  /** 3-4 варианта ответа. */
  options: string[]
  /** Индекс правильного варианта в options. */
  correct: number
  /** Объяснение — показывается после ответа, и при верном тоже. */
  explain: string
}

/** Кусочек урока. Урок собирается из таких блоков по порядку. */
export type LessonBlock =
  | { type: 'p'; text: string } // обычный абзац
  | { type: 'h'; text: string } // подзаголовок внутри урока
  | { type: 'example'; title?: string; text: string } // разобранный пример
  | { type: 'tip'; text: string } // 💡 совет
  | { type: 'warn'; text: string } // ⚠️ частая ошибка / предостережение
  | { type: 'try'; text: string } // 🧪 «попробуй сам» — практика
  | { type: 'code'; text: string } // промпт или код моноширинным шрифтом

export interface Lesson {
  id: string
  title: string
  /** Честная оценка времени чтения в минутах. */
  minutes: number
  blocks: LessonBlock[]
  /** 3-5 вопросов в конце урока. */
  quiz: QuizQuestion[]
  /** Термины глоссария из урока — показываются чипами и попадают в карточки. */
  termIds?: string[]
}

export interface CourseModule {
  id: string
  title: string
  /** 1-2 фразы, о чём модуль. */
  intro: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  icon: string
  description: string
  modules: CourseModule[]
}
