import type { Course } from '../../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'
import { m7 } from './m7'
import { m8 } from './m8'

// Флагманский трек-навык «Вайб-кодинг: от идеи до продукта» (PLAN-3.0 §5.1).
// 8 модулей / 30 уроков: требования → постановка задач AI → git → деплой →
// данные → безопасность → поддерживаемость → инциденты. Все уроки — навык,
// с упражнениями (compare / find-error / order / practice).
export const vibecodeCourse: Course = {
  id: 'vibecode',
  title: 'Вайб-кодинг: от идеи до продукта',
  icon: '🚀',
  description:
    'Полный путь от замысла до живого приложения: что строить, как ставить задачи AI и принимать результат, git-страховка, деплой, данные, безопасность, поддержка и инциденты.',
  modules: [m1, m2, m3, m4, m5, m6, m7, m8],
}
