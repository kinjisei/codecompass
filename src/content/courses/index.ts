import type { Course } from '../../types'
import { promptingCourse } from './prompting'
import { aiAutoCourse } from './ai-auto'
import { eqCourse } from './eq'

export const allCourses: Course[] = [promptingCourse, aiAutoCourse, eqCourse]

/** Плоский список уроков курса — для поиска следующего урока и подсчётов. */
export function flatLessons(course: Course) {
  return course.modules.flatMap((m) => m.lessons)
}
