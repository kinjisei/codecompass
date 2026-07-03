import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 'vibecoding',
    title: 'Вайб-кодинг и AI',
    icon: '🤖',
    description:
      'Как работать с Claude и другими AI-ассистентами: базовые термины, из чего состоит проект, что происходит «под капотом».',
  },
  {
    id: 'git',
    title: 'Git и терминал',
    icon: '🌿',
    description:
      'Как сохранять код, откатывать изменения и работать с историей проекта.',
  },
  {
    id: 'webdev',
    title: 'Как устроена веб-разработка',
    icon: '🌐',
    description:
      'Клиент, сервер, база данных, API, деплой — то, что ты каждый день видишь в Supabase и Vercel.',
  },
  {
    id: 'react-ts',
    title: 'React, TypeScript и асинхронность',
    icon: '⚛️',
    description:
      'Vite, компоненты, хуки, промисы — то, что не попало в общий обзор веба, но каждый день встречается в Recall.',
  },
  {
    id: 'flutter',
    title: 'Flutter и мобильная разработка',
    icon: '📱',
    description:
      'Второй большой мир, кроме веба: Dart, виджеты, BLoC, кодогенерация — из твоих мобильных проектов.',
  },
  {
    id: 'mobile-publish',
    title: 'Публикация мобильных приложений',
    icon: '🚀',
    description: 'Версии, подпись сборки, Gradle, TestFlight — путь от кода до магазина приложений.',
  },
  {
    id: 'patterns',
    title: 'Архитектурные паттерны',
    icon: '🧩',
    description:
      'Многоразовые решения одних и тех же задач: слои, репозитории, DI, конечные автоматы — не привязаны к одному языку.',
  },
  {
    id: 'algorithms',
    title: 'Алгоритмы и обработка данных',
    icon: '🧮',
    description: 'Как программы распознают рисунки и «понимают» неточный текст — реальные примеры из твоих проектов.',
  },
  {
    id: 'testing',
    title: 'Тестирование',
    icon: '✅',
    description: 'Взгляд разработчика на автотесты — пригодится и тебе как QA с другой стороны процесса.',
  },
  {
    id: 'backend-baas',
    title: 'Backend без своего сервера',
    icon: '☁️',
    description: 'Firebase и serverless-функции — второй способ сделать бэкенд, кроме Supabase.',
  },
  {
    id: 'qa',
    title: 'Тестирование и поиск багов (QA)',
    icon: '🐞',
    description:
      'Твоя работа на языке команды: баг, регрессия, edge case, как воспроизвести и описать проблему, как читать стектрейс.',
  },
  {
    id: 'js-basics',
    title: 'JavaScript и TypeScript: азы',
    icon: '📜',
    description: 'Самые базовые кирпичики: переменная, функция, массив, объект, тип — с чего вообще состоит код.',
  },
  {
    id: 'kotlin',
    title: 'Kotlin и нативный Android',
    icon: '🤖',
    description:
      'Другой путь для телефона — настоящее приложение из Google Play. Чем отличается от PWA и когда его выбирают.',
  },
  {
    id: 'ai-services',
    title: 'AI-сервисы: ключи и лимиты',
    icon: '🔑',
    description: 'Google AI Studio, API-ключи, бесплатные лимиты — практическая сторона работы с AI, которую ты сейчас осваиваешь.',
  },
  {
    id: 'supabase',
    title: 'Supabase изнутри',
    icon: '🗄️',
    description:
      'Глубже, чем общий обзор: таблицы и SQL, схема, миграции, политики RLS на примерах, хранилище файлов, Realtime.',
  },
  {
    id: 'vercel',
    title: 'Vercel и деплой изнутри',
    icon: '▲',
    description:
      'Как код из репозитория превращается в живой сайт: сборка, переменные окружения, домены, превью-деплои веток.',
  },
  {
    id: 'css',
    title: 'CSS и вёрстка',
    icon: '🎨',
    description: 'Как из голого текста получается красивый экран: CSS, Tailwind, flexbox и grid, адаптивность, тёмная тема.',
  },
]

export function categoryTitle(id: Category['id']): string {
  return categories.find((c) => c.id === id)?.title ?? ''
}
