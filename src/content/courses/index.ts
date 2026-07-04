import type { Course } from '../../types'
import { promptingCourse } from './prompting'

export const allCourses: Course[] = [promptingCourse]

/** Плоский список уроков курса — для поиска следующего урока и подсчётов. */
export function flatLessons(course: Course) {
  return course.modules.flatMap((m) => m.lessons)
}
