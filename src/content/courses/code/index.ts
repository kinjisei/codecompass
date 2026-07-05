import type { Course } from '../../../types'
import { m1 } from './m1'
import { m2 } from './m2'
import { m3 } from './m3'
import { m4 } from './m4'
import { m5 } from './m5'
import { m6 } from './m6'
import { m7 } from './m7'

// Обзорный трек «Как устроен код» (PLAN-3.0 §5.2): понимать то, что делает AI,
// не углубляясь. 7 модулей / 26 уроков. depth большинства — 'overview', кроме
// М1 «Чтение кода» (skill: читать код — навык эпохи AI). Термины —
// существующие (js/react/html/css/net/patterns/code-reading), уроки ссылаются.
export const codeCourse: Course = {
  id: 'code',
  title: 'Как устроен код',
  icon: '💻',
  description:
    'Понимать то, что пишет AI: читать код, узнавать конструкции языка, из чего собрана страница, как она говорит с сервером, где живут данные, что за компоненты и слои. Не чтобы писать — чтобы направлять.',
  modules: [m1, m2, m3, m4, m5, m6, m7],
}
