import { lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './features/home/HomePage'
import { GlossaryPage } from './features/glossary/GlossaryPage'

// Страницы, тянущие полный контент курсов (~сотни КБ текста уроков), грузятся
// лениво отдельным чанком — «Путь» и «Справочник» стартуют без него.
// «Повторение» тоже лениво: подмешивает вопросы из пройденных уроков.
const CardsPage = lazy(() =>
  import('./features/cards/CardsPage').then((m) => ({ default: m.CardsPage })),
)
const CoursesPage = lazy(() =>
  import('./features/courses/CoursesPage').then((m) => ({ default: m.CoursesPage })),
)
const CoursePage = lazy(() =>
  import('./features/courses/CoursePage').then((m) => ({ default: m.CoursePage })),
)
const LessonPage = lazy(() =>
  import('./features/courses/LessonPage').then((m) => ({ default: m.LessonPage })),
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/courses/:courseId/:lessonId" element={<LessonPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
