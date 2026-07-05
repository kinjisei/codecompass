import type { Course } from '../../types'
import { promptingCourse } from './prompting'
import { aiAutoCourse } from './ai-auto'
import { eqCourse } from './eq'

export const allCourses: Course[] = [promptingCourse, aiAutoCourse, eqCourse]

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
}
