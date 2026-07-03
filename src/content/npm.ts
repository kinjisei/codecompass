import type { GlossaryEntry } from '../types'

export const npm: GlossaryEntry[] = [
  {
    id: 'npm-npm',
    categoryId: 'npm',
    term: 'npm и реестр пакетов',
    short: 'Менеджер пакетов для JavaScript: скачивает чужие библиотеки из огромного онлайн-реестра и подключает их в проект.',
    detail:
      'npm (Node Package Manager) решает задачу «не писать всё с нуля»: нужную функциональность (роутер, работу с датами, алгоритм повторения) кто-то уже оформил в виде пакета и выложил в реестр npmjs.com. Командой npm install ты скачиваешь пакет в проект и дальше просто импортируешь его в коде. Есть альтернативные менеджеры (yarn, pnpm) — идея та же. npm ставится вместе с Node.js.',
    example: 'В CodeCompass пакеты react, react-router-dom, ts-fsrs и tailwindcss пришли именно из реестра npm по команде npm install.',
    related: ['npm-package-json', 'npm-node-modules'],
  },
  {
    id: 'npm-package-json',
    categoryId: 'npm',
    term: 'package.json',
    short: 'Паспорт проекта: имя, версия, список зависимостей и команды (scripts). Главный конфиг любого JS-проекта.',
    detail:
      'package.json — короткий файл в корне проекта, описывающий его. Ключевые части: dependencies (библиотеки, нужные приложению) и devDependencies (нужные только при разработке — сборщик, типы, линтер); scripts (короткие имена для команд, например "dev": "vite"); имя и версия проекта. По этому файлу npm install понимает, что скачивать. Это первый файл, куда смотрят, чтобы понять, из чего собран проект.',
    example: 'В package.json CodeCompass в dependencies лежат react и ts-fsrs, в scripts — dev/build/preview; аналог в мире Flutter — pubspec.yaml.',
    related: ['npm-npm', 'npm-scripts', 'flt-pubspec'],
  },
  {
    id: 'npm-node-modules',
    categoryId: 'npm',
    term: 'node_modules',
    short: 'Папка, куда npm скачивает все библиотеки. Огромная, генерируется автоматически и не хранится в git.',
    detail:
      'node_modules — это физические файлы всех зависимостей (и их зависимостей, и зависимостей тех — отсюда сотни папок). Её не коммитят в репозиторий: она весит много и полностью воссоздаётся командой npm install по package.json и lock-файлу. Поэтому node_modules всегда в .gitignore. Если что-то «странно сломалось» — частое лекарство удалить node_modules и поставить заново.',
    example: 'В CodeCompass node_modules весит десятки мегабайт и стоит в .gitignore — в репозитории её нет, но npm install восстанавливает её за секунды.',
    related: ['npm-package-json', 'npm-lockfile', 'git-gitignore'],
  },
  {
    id: 'npm-semver',
    categoryId: 'npm',
    term: 'Версии и semver (^, ~)',
    short: 'Формат версии MAJOR.MINOR.PATCH; символы ^ и ~ задают, насколько свободно можно обновлять зависимость.',
    detail:
      'Semver (semantic versioning): первое число меняют при несовместимых изменениях, второе — при новых возможностях, третье — при багфиксах. В package.json перед версией часто стоит ^ («можно обновлять minor и patch, major — нет») или ~ («только patch»). Это компромисс: получать исправления, но не поймать ломающее обновление. Точные же версии фиксирует lock-файл.',
    example: 'Запись "react": "^19.2.7" в CodeCompass значит «любая 19.x не ниже 19.2.7, но не 20». Тот же semver ты видел в теме про публикацию мобильных приложений.',
    related: ['npm-package-json', 'npm-lockfile', 'pub-semver'],
  },
  {
    id: 'npm-lockfile',
    categoryId: 'npm',
    term: 'package-lock.json',
    short: 'Фиксирует точные версии всех зависимостей (включая косвенные), чтобы сборка была одинаковой у всех и всегда.',
    detail:
      'package.json задаёт версии приблизительно (через ^/~), а lock-файл записывает, какие ровно версии реально установлены — вплоть до косвенных зависимостей. Благодаря ему npm install на другом компьютере или через полгода поставит ровно то же самое, и проект не «поедет» из-за случайно обновившейся библиотеки. Lock-файл, в отличие от node_modules, коммитят в git.',
    example: 'package-lock.json в репозитории CodeCompass гарантирует, что сборка на Vercel использует те же версии, что у тебя локально — поэтому «у меня работает» = «на проде работает».',
    related: ['npm-node-modules', 'npm-semver', 'flt-pubspec'],
  },
  {
    id: 'npm-scripts',
    categoryId: 'npm',
    term: 'npm-скрипты (npm run)',
    short: 'Короткие имена для длинных команд, записанные в package.json и запускаемые через npm run.',
    detail:
      'Вместо того чтобы помнить длинную команду сборки, её прячут в раздел scripts под коротким именем. npm run dev, npm run build — это выполнение того, что записано под ключами "dev" и "build". Некоторые имена особые и работают без run: npm start, npm test. Скрипты — точка входа в проект: заглянув в scripts, сразу видно, как его запустить и собрать.',
    example: 'В CodeCompass npm run dev запускает vite (dev-сервер), npm run build — tsc -b && vite build (проверка типов + сборка). Ты пользуешься ими постоянно.',
    related: ['npm-package-json', 'cli-command', 'rt-vite'],
  },
  {
    id: 'npm-audit',
    categoryId: 'npm',
    term: 'npm install и npm audit',
    short: 'install скачивает зависимости по package.json; audit проверяет их на известные уязвимости.',
    detail:
      'npm install читает package.json и lock-файл и наполняет node_modules; его запускают после клонирования проекта или добавления новой зависимости. npm audit сканирует установленные пакеты по базе известных уязвимостей и сообщает, что и до какой версии стоит обновить (npm audit fix пытается сделать это автоматически). Это простая гигиена безопасности проекта.',
    example: 'При установке CodeCompass npm сообщил «found 0 vulnerabilities» — это результат встроенной проверки audit; связано с темой «уязвимости в зависимостях».',
    related: ['npm-npm', 'sec-deps'],
  },
]
