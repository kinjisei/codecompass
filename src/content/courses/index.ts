import type { Course } from '../../types'
import { vibecodeCourse } from './vibecode'
import { codeCourse } from './code'
import { qaProCourse } from './qa-pro'
import { promptingCourse } from './prompting'
import { aiAutoCourse } from './ai-auto'
import { eqCourse } from './eq'

export const allCourses: Course[] = [
  vibecodeCourse,
  codeCourse,
  qaProCourse,
  promptingCourse,
  aiAutoCourse,
  eqCourse,
]

/** Плоский список уроков курса — для поиска следующего урока и подсчётов. */
export function flatLessons(course: Course) {
  return course.modules.flatMap((m) => m.lessons)
}

// Dev-проверка: метаданные пути (courses/meta.ts) не должны разъезжаться
// с реальным контентом — счётчики и префиксы уроков сверяются при загрузке.
if (import.meta.env.DEV) {
  import('./meta').then(({ learningPath }) => {
    for (const entry of learningPath) {
      if (entry.kind !== 'course') continue
      const course = allCourses.find((c) => c.id === entry.id)
      if (!course) {
        console.warn(`[meta] курс ${entry.id} из learningPath не найден в allCourses`)
        continue
      }
      const lessons = flatLessons(course)
      if (lessons.length !== entry.total) {
        console.warn(
          `[meta] ${entry.id}: в meta.total ${entry.total}, а уроков ${lessons.length} — обнови courses/meta.ts`,
        )
      }
      const badPrefix = lessons.find((l) => !l.id.startsWith(entry.prefix))
      if (badPrefix) {
        console.warn(`[meta] ${entry.id}: урок ${badPrefix.id} не начинается с "${entry.prefix}"`)
      }
    }
  })

  // Dev-проверка сквозных ссылок: каждый termId урока должен вести на
  // существующий термин глоссария, иначе чип «Термины из урока» молча не
  // отрисуется. Ловим битые ссылки при разработке, а не глазами в браузере.
  import('../index').then(({ allEntries }) => {
    const ids = new Set(allEntries.map((e) => e.id))
    for (const course of allCourses) {
      for (const lesson of flatLessons(course)) {
        for (const termId of lesson.termIds ?? []) {
          if (!ids.has(termId)) {
            console.warn(`[links] ${lesson.id}: termId "${termId}" не найден в глоссарии`)
          }
        }
      }
    }
  })
}
