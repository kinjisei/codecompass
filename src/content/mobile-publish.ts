import type { GlossaryEntry } from '../types'

export const mobilePublish: GlossaryEntry[] = [
  {
    id: 'pub-semver',
    categoryId: 'mobile-publish',
    term: 'Семантическое версионирование и build number',
    short: 'Формат вида 1.0.0+1 — «маркетинговая» версия (MAJOR.MINOR.PATCH) плюс отдельный номер сборки для магазинов приложений.',
    detail:
      'MAJOR меняют при несовместимых изменениях, MINOR — при новых фичах, PATCH — при исправлениях багов. Число после + — build number, техническая метка сборки: App Store и Google Play отклонят повторную загрузку с уже использованным номером, поэтому его увеличивают при каждой заливке, даже если «маркетинговая» версия не поменялась.',
    example: 'version: 1.0.0+1 в pubspec.yaml проекта spatial_memory_game.',
  },
  {
    id: 'pub-signing',
    categoryId: 'mobile-publish',
    term: 'Подпись приложения (code signing)',
    short: 'Криптографическая подпись сборки, подтверждающая автора — без неё Google Play и App Store не примут приложение.',
    detail:
      'Для iOS нужны сертификат и provisioning-профиль, привязанные к платному Apple Developer Program, а сама сборка возможна только на macOS через Xcode. Для Android подпись настраивается в Gradle (signingConfig). Без подписи установить релизную сборку на чужое устройство или загрузить в магазин невозможно — это защита от подмены приложения кем-то другим.',
    example: 'В spatial_memory_game для отладки временно используется debug-подпись (signingConfigs.getByName("debug")) в Android Gradle-конфиге.',
    related: ['pub-testflight', 'pub-gradle'],
  },
  {
    id: 'pub-testflight',
    categoryId: 'mobile-publish',
    term: 'TestFlight и бета-раздача',
    short: 'Сервис Apple для раздачи бета-версий iOS-приложения тестировщикам до публичного релиза.',
    detail:
      'Вместо того чтобы сразу публиковать приложение всем, разработчик заливает сборку в TestFlight, а ограниченный круг тестировщиков ставит её через специальное приложение и оставляет отзывы. Заливка на iOS без своего Mac возможна через CI-сервисы с macOS-раннерами (например Codemagic, GitHub Actions) — они собирают и подписывают приложение в облаке.',
    example: 'Весь процесс iOS-релиза в spatial_memory_game расписан отдельным документом TESTFLIGHT.md в репозитории.',
    related: ['pub-signing'],
  },
  {
    id: 'pub-asc-key',
    categoryId: 'mobile-publish',
    term: 'App Store Connect API key (.p8)',
    short: 'Ключ доступа, который позволяет CI-серверу самому заливать сборки в App Store без ручного логина человека.',
    detail:
      'Вместо email/пароля разработчика для автоматизации выдают файл-ключ .p8 плюс Key ID и Issuer ID — это пример «машинных учётных данных» (service credentials): процесс аутентифицируется ключом с ограниченной ролью, а не полным доступом живого аккаунта. Такие ключи никогда не кладут в репозиторий — только в защищённое хранилище секретов CI.',
    example: 'Использование ключа описано в TESTFLIGHT.md проекта spatial_memory_game — команда xcrun altool --apiKey ... --apiIssuer ....',
    related: ['pub-testflight'],
  },
  {
    id: 'pub-gradle',
    categoryId: 'mobile-publish',
    term: 'Gradle и Kotlin DSL (сборка Android)',
    short: 'Система сборки Android-приложений, настраиваемая скриптами — в современных проектах на Kotlin DSL (.gradle.kts).',
    detail:
      'В Gradle-файле задаются applicationId (уникальный идентификатор приложения в Google Play), minSdk/targetSdk (диапазон поддерживаемых версий Android) и настройки подписи. Kotlin DSL — современная замена старому синтаксису Groovy для тех же файлов конфигурации. Flutter-проекты подставляют свои значения версий через плейсхолдеры вроде flutter.minSdkVersion.',
    example: 'android/app/build.gradle.kts в spatial_memory_game задаёт namespace, Java 17 и signingConfig.',
    related: ['pub-signing'],
  },
  {
    id: 'pub-icons',
    categoryId: 'mobile-publish',
    term: 'flutter_launcher_icons и adaptive icons',
    short: 'Автоматическая генерация иконки приложения во всех нужных размерах и форматах из одной картинки.',
    detail:
      'Магазины приложений требуют иконку в десятках размеров под разные экраны и плотности пикселей — рисовать их вручную непрактично. Пакет генерирует весь набор из одного PNG. Android использует adaptive icons — иконку из двух слоёв (фон + передний план), которые система по-разному обрезает и анимирует в зависимости от темы лаунчера, поэтому важное содержимое держат в центральной «безопасной зоне». iOS требует убрать альфа-канал.',
    example: 'Блок flutter_launcher_icons в pubspec.yaml проекта spatial_memory_game с отдельными слоями adaptive_icon_background/foreground.',
  },
]
