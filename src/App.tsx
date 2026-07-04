import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './features/home/HomePage'
import { GlossaryPage } from './features/glossary/GlossaryPage'
import { CardsPage } from './features/cards/CardsPage'
import { CoursesPage } from './features/courses/CoursesPage'
import { CoursePage } from './features/courses/CoursePage'
import { LessonPage } from './features/courses/LessonPage'
import { SettingsPage } from './features/settings/SettingsPage'

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
