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
