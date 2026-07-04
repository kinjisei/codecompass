import type { Course } from '../../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'
import { m7 } from './m7'

// Курс «Промпт-инжиниринг» — полный, 7 модулей / 28 уроков (см. PLAN-2.0.md).
export const promptingCourse: Course = {
  id: 'prompting',
  title: 'Промпт-инжиниринг',
  icon: '✍️',
  description:
    'Как получать от AI то, что нужно: устройство модели, анатомия промпта, техники и отладка — с примерами из вайб-кодинга и работы QA.',
  modules: [m1, m2, m3, m4, m5, m6, m7],
}
