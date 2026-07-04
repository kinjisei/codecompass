import type { Course } from '../../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'
import { m7 } from './m7'
import { m8 } from './m8'

// Курс «Эмоциональный интеллект» — полный, 8 модулей / 32 урока (см. PLAN-2.0.md).
export const eqCourse: Course = {
  id: 'eq',
  title: 'Эмоциональный интеллект',
  icon: '💛',
  description:
    'Замечать эмоции, управлять реакциями, понимать людей и говорить сложное — практично, по науке и с примерами из работы QA.',
  modules: [m1, m2, m3, m4, m5, m6, m7, m8],
}
