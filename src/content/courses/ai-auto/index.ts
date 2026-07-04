import type { Course } from '../../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'
import { m7 } from './m7'
import { m8 } from './m8'

// Курс «Нейросети и автоматизация» — полный, 8 модулей / 29 уроков (см. PLAN-2.0.md).
export const aiAutoCourse: Course = {
  id: 'ai-auto',
  title: 'Нейросети и автоматизация',
  icon: '🧠',
  description:
    'Как AI устроен под капотом — от нейрона до reasoning-моделей — и как заставить его работать на тебя: RAG, агенты, API и автоматизация.',
  modules: [m1, m2, m3, m4, m5, m6, m7, m8],
}
