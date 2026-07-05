// ============================================================================
// Лёгкие метаданные учебного пути — БЕЗ контента уроков. Импортируется главной
// страницей («Путь»), которая должна стартовать без тяжёлого чанка курсов.
// Прогресс считается по префиксу id уроков (у каждого курса он уникален).
// Согласованность счётчиков с реальным контентом проверяется в dev-режиме
// в content/courses/index.ts.
// ============================================================================

export interface PathCourse {
  kind: 'course'
  id: string
  icon: string
  title: string
  short: string
  /** Число уроков (проверяется dev-проверкой против контента). */
  total: number
  /** Префикс id уроков курса — по нему считается пройденное. */
  prefix: string
}

export interface PathComingSoon {
  kind: 'soon'
  icon: string
  title: string
  short: string
}

export type PathEntry = PathCourse | PathComingSoon

/** Рекомендованный порядок пути (PLAN-3.0). Заглушки «скоро» — будущие треки. */
export const learningPath: PathEntry[] = [
  {
    kind: 'course',
    id: 'vibecode',
    icon: '🚀',
    title: 'Вайб-кодинг: от идеи до продукта',
    short: 'Флагманский трек-навык: требования, задачи AI, git, деплой, данные, безопасность.',
    total: 30,
    prefix: 'vcode-',
  },
  {
    kind: 'course',
    id: 'prompting',
    icon: '✍️',
    title: 'Промпт-инжиниринг',
    short: 'Как получать от AI то, что нужно.',
    total: 28,
    prefix: 'pr-',
  },
  {
    kind: 'course',
    id: 'ai-auto',
    icon: '🧠',
    title: 'Нейросети и автоматизация',
    short: 'Как AI устроен и как заставить его работать.',
    total: 29,
    prefix: 'ai-',
  },
  {
    kind: 'course',
    id: 'code',
    icon: '💻',
    title: 'Как устроен код',
    short: 'Обзорный трек: читать и понимать то, что пишет AI.',
    total: 26,
    prefix: 'code-',
  },
  {
    kind: 'course',
    id: 'qa-pro',
    icon: '🐞',
    title: 'QA: профессия',
    short: 'Трек-навык: мышление о рисках, тест-дизайн, API-тестирование, процессы, AI в QA.',
    total: 22,
    prefix: 'qap-',
  },
  {
    kind: 'course',
    id: 'eq',
    icon: '💛',
    title: 'Эмоциональный интеллект',
    short: 'Люди и ты сам: то, что не автоматизировать.',
    total: 32,
    prefix: 'eq-',
  },
]
