import type { GlossaryEntry } from '../types'

export const flutter: GlossaryEntry[] = [
  {
    id: 'flt-flutter',
    categoryId: 'flutter',
    term: 'Flutter',
    short: 'Кроссплатформенный UI-фреймворк от Google — один код на Dart компилируется в приложения для Android, iOS, веба и десктопа.',
    detail:
      'Flutter рисует весь интерфейс сам, через собственный движок рендеринга, а не через нативные виджеты ОС — поэтому картинка выглядит одинаково на всех платформах. UI строится из «виджетов» (widgets): маленьких неизменяемых объектов-описаний, вложенных друг в друга деревом. Подход декларативный — ты описываешь, как экран должен выглядеть при данном состоянии, а Flutter сам решает, что перерисовать. Это мобильный аналог того, чем для веба является React с его декларативным JSX.',
    example: 'Во всех твоих Flutter-проектах (gitlab-mobile-app, spatial_memory_game, sybols_gitlab) это основа: точка входа lib/main.dart с runApp(...) и корневым виджетом приложения.',
    related: ['flt-dart', 'flt-widget'],
  },
  {
    id: 'flt-dart',
    categoryId: 'flutter',
    term: 'Dart',
    short: 'Язык программирования от Google, на котором пишут Flutter-приложения — типизированный, с null-safety.',
    detail:
      'Dart синтаксически похож на Java/JavaScript/TypeScript, поддерживает async/await и статическую типизацию. Ключевая черта — null-safety: тип String не может быть null, а String? может, и компилятор заставляет явно обработать оба случая — это убирает целый класс ошибок «null reference». Для релиза Dart компилируется в нативный машинный код (AOT), а при разработке работает через JIT ради hot reload — мгновенного обновления приложения без перезапуска.',
    example: 'Версия SDK фиксируется в pubspec.yaml (например ^3.11.0); знаки ? (nullable) и ! (утверждение non-null) встречаются по всему коду твоих проектов.',
    related: ['flt-flutter'],
  },
  {
    id: 'flt-widget',
    categoryId: 'flutter',
    term: 'Виджет: StatelessWidget и StatefulWidget',
    short: 'Во Flutter «всё — виджет»: кнопка, отступ, экран. StatelessWidget не хранит состояние, StatefulWidget хранит и умеет перерисовываться через setState().',
    detail:
      'Виджеты складываются в дерево — родитель содержит детей. StatelessWidget рисуется только из переданных ему параметров и не меняется сам по себе — он легче и предсказуемее. StatefulWidget состоит из двух классов: самого виджета и объекта State, где хранятся изменяемые данные; вызов setState(() {...}) говорит фреймворку перестроить (build) этот кусок дерева заново. Это ядро реактивного UI: меняешь данные — интерфейс сам подстраивается.',
    example: 'В spatial_memory_game экран меню — StatefulWidget с setState при тапах по логотипу; экран истории игр — простой StatelessWidget, отображающий список без своего состояния.',
    related: ['flt-flutter'],
  },
  {
    id: 'flt-pubspec',
    categoryId: 'flutter',
    term: 'pubspec.yaml и pub',
    short: 'Файл-манифест Flutter/Dart-проекта — имя, версия, зависимости. Аналог package.json в мире JS.',
    detail:
      'pubspec.yaml описывает зависимости (dependencies), зависимости только для разработки (dev_dependencies — линтеры, генераторы кода, тесты) и подключаемые ассеты. Пакеты качаются менеджером pub из реестра pub.dev командой flutter pub get, а точные версии фиксируются в pubspec.lock — чтобы сборка была одинаковой у всех разработчиков (аналог package-lock.json). Зависимости можно подключать и по локальному пути (path:), а не только из интернета.',
    example: 'Во всех твоих Flutter-проектах локальные модули подключены через path: — например shapes: path: modules/shapes в sybols_gitlab.',
    related: ['flt-dart', 'flt-monorepo'],
  },
  {
    id: 'flt-monorepo',
    categoryId: 'flutter',
    term: 'Модульный монорепозиторий (локальные Dart-пакеты)',
    short: 'Приложение разбито на несколько независимых Dart-пакетов внутри одного репозитория вместо одной большой папки lib/.',
    detail:
      'Каждый модуль (core, shapes, speech, authorization и т.п.) — полноценный локальный пакет со своим pubspec.yaml, подключаемый в главное приложение через path:. Это форсирует чёткие границы: модуль видит только публичный API другого модуля, а не его внутренности. Плюсы — переиспользование кода, возможность параллельной разработки несколькими людьми и более быстрая сборка отдельных частей.',
    example: 'В sybols_gitlab и gitlab-mobile-app — папка modules/ с независимыми пакетами (core, shapes, authorization, design_system и др.), каждый со своим pubspec.yaml.',
    related: ['flt-pubspec', 'pat-clean-arch'],
  },
  {
    id: 'flt-bloc',
    categoryId: 'flutter',
    term: 'BLoC / Cubit (flutter_bloc)',
    short: 'Паттерн управления состоянием: UI отправляет события, BLoC отвечает новыми неизменяемыми состояниями, которые UI просто отражает.',
    detail:
      'BLoC (Business Logic Component) — по сути машина состояний: на вход Events (действия пользователя), на выход — поток (Stream) State. Виджет подписывается на состояние через BlocBuilder и просто рисует его, не храня логику сам. Cubit — упрощённая версия без событий, с прямыми методами. Такой подход отделяет бизнес-логику от виджетов, делает её тестируемой отдельно от UI, а состояние — единый неизменяемый объект (обычно сгенерированный через freezed).',
    example: 'В gitlab-mobile-app и sybols_gitlab — BLoC-и вроде videos_bloc.dart и words_game_bloc.dart с отдельными файлами событий и состояний.',
    related: ['flt-freezed', 'flt-codegen'],
  },
  {
    id: 'flt-freezed',
    categoryId: 'flutter',
    term: 'freezed (неизменяемые модели и sealed-типы)',
    short: 'Генератор, создающий неизменяемые Dart-классы с copyWith, сравнением по значению и «union»-типами вместо ручного boilerplate.',
    detail:
      'Неизменяемость (immutability) значит, что объект нельзя поменять после создания — вместо этого делают копию с изменёнными полями через copyWith. Freezed генерирует такие классы автоматически, а также sealed/union-типы — например состояние Loading | Loaded | Error, — и компилятор заставляет обработать все варианты через when/map, так что забыть один случай физически невозможно. Это убирает целый класс багов «неожиданно изменившегося» состояния.',
    example: 'Состояния BLoC во всех твоих Flutter-проектах — freezed-классы; по правилам gitlab-mobile-app freezed используют только для State, а Events — обычные sealed-классы.',
    related: ['flt-bloc', 'flt-codegen'],
  },
  {
    id: 'flt-codegen',
    categoryId: 'flutter',
    term: 'Кодогенерация (build_runner)',
    short: 'В Dart нет рантайм-рефлексии, поэтому рутинный код (DI, роуты, сравнение объектов) генерируется заранее из аннотаций специальным инструментом.',
    detail:
      'Пакеты вроде freezed, injectable, auto_route не пишут код руками, а генерируют его по аннотациям (@injectable, @RoutePage, @freezed). build_runner — раннер, который запускает все генераторы и создаёт файлы *.g.dart, *.freezed.dart, *.gr.dart. Команда: dart run build_runner build --delete-conflicting-outputs. Сгенерированные файлы нельзя редактировать вручную — их перезапишет следующий запуск.',
    example: 'dev-зависимости build_runner, freezed, injectable_generator, auto_route_generator есть во всех трёх твоих Flutter-проектах.',
    related: ['flt-freezed', 'flt-di'],
  },
  {
    id: 'flt-di',
    categoryId: 'flutter',
    term: 'Dependency Injection (get_it + injectable)',
    short: 'Классы получают свои зависимости извне (через конструктор), а не создают их сами; выдаёт их единый контейнер-реестр.',
    detail:
      'Dependency Injection (DI) — принцип, при котором класс принимает зависимости через конструктор вместо создания их внутри себя (new Repository()) — это упрощает тесты (можно подставить заглушку) и замену деталей. get_it — Service Locator: глобальный контейнер, у которого «просят» готовый объект. injectable по аннотациям (@injectable, @lazySingleton) генерирует код регистрации в get_it автоматически. Constructor injection (для бизнес-логики) считается «чище», чем service locator (используемый обычно в UI-коде ради удобства).',
    example: 'В sybols_gitlab и gitlab-mobile-app доступ из UI идёт через context.di<T>() — расширение BuildContext, возвращающее GetIt.instance.',
    related: ['flt-codegen', 'pat-repository'],
  },
  {
    id: 'flt-autoroute',
    categoryId: 'flutter',
    term: 'AutoRoute и Route Guard (навигация)',
    short: 'Маршруты между экранами описываются декларативно и генерируются из аннотаций; Guard решает, пускать ли на маршрут.',
    detail:
      'Вместо ручного Navigator.push экран помечается @RoutePage(), а генератор создаёт типобезопасные классы маршрутов, проверяемые компилятором. Переход делают через context.router.push(...). Guard — перехватчик, который до открытия экрана проверяет условие (обычно авторизацию) и либо пускает дальше, либо перенаправляет — например на экран логина. Guard вешается на узел дерева маршрутов, и все вложенные маршруты автоматически попадают под защиту.',
    example: 'AuthGuard, читающий состояние авторизации и редиректящий на LoginRoute, есть и в gitlab-mobile-app, и в sybols_gitlab.',
    related: ['flt-codegen'],
  },
  {
    id: 'flt-navigator',
    categoryId: 'flutter',
    term: 'Navigator и стек маршрутов',
    short: 'Более простой встроенный способ навигации Flutter — экраны складываются в стопку (стек), как история браузера.',
    detail:
      'Navigator.push кладёт новый экран поверх текущего, Navigator.pop снимает верхний и возвращает назад — в том числе с результатом, который можно дождаться через await. MaterialPageRoute создаёт стандартный переход с анимацией, привычной для платформы. Это более простая альтернатива AutoRoute — подходит для небольших приложений без генерации кода.',
    example: 'В spatial_memory_game переход на игровой экран сделан именно так: Navigator.push(context, MaterialPageRoute(builder: (context) => GameScreen(...))).',
    related: ['flt-autoroute'],
  },
  {
    id: 'flt-storage',
    categoryId: 'flutter',
    term: 'Локальное хранилище: shared_preferences и Hive',
    short: 'shared_preferences — простое хранилище пар «ключ-значение» для настроек; Hive — более быстрая NoSQL-база на устройстве для больших данных.',
    detail:
      'shared_preferences хранит примитивы (числа, строки, флаги) так, что они переживают перезапуск приложения — на Android это системный SharedPreferences, на iOS NSUserDefaults, пакет прячет разницу. Сложные объекты сериализуют в JSON-строку под ключом. Hive — более полноценная встроенная key-value NoSQL-база, данные лежат в «боксах» (Box), подходит для списков/истории/кэша, когда данных больше и нужен более удобный доступ, чем строка настроек.',
    example: 'В spatial_memory_game весь прогресс — на shared_preferences (история игр как список JSON-строк); в gitlab-mobile-app для списков треков и кэша используется Hive (Hive.openBox(\'tracks\')).',
    related: ['flt-widget'],
  },
  {
    id: 'flt-async',
    categoryId: 'flutter',
    term: 'Асинхронность в Dart: Future, async/await',
    short: 'Способ выполнять долгие операции (диск, сеть, звук), не «замораживая» интерфейс.',
    detail:
      'Future<T> — обещание значения, которое появится позже. Функция с async может внутри await-ить такие обещания, читаясь как обычный последовательный код, но не блокируя UI-поток. Flutter однопоточен для отрисовки интерфейса, поэтому чтение файлов, сеть и работа с хранилищем обязаны быть асинхронными — иначе экран «зависнет» на время операции.',
    example: 'В spatial_memory_game main() объявлен async и await-ит настройку аудио и загрузку сохранённых данных перед запуском приложения.',
  },
  {
    id: 'flt-material',
    categoryId: 'flutter',
    term: 'Material Design и тема (ThemeData, InheritedWidget)',
    short: 'Готовый визуальный язык Google (карточки, кнопки, диалоги) плюс механизм раздачи темы всему дереву виджетов.',
    detail:
      'Material — набор готовых виджетов (Scaffold — каркас экрана, AppBar, Card, ElevatedButton, AlertDialog) и правил оформления. Material 3 — актуальная версия с обновлённой системой цветов; ColorScheme.fromSeed генерирует целую согласованную палитру из одного «зернового» цвета. Чтобы не хардкодить цвета по всему коду, их выносят в токены (именованные значения) и раздают через ThemeData.extensions или InheritedWidget — специальный виджет, который передаёт данные вниз по дереву так, что любой потомок достаёт их через context, а перерисовываются только реально зависимые виджеты.',
    example: 'gitlab-mobile-app использует ThemeExtension и context.colors.primary вместо хардкода; sybols_gitlab и spatial_memory_game — ColorScheme.fromSeed и useMaterial3: true.',
    related: ['flt-widget'],
  },
  {
    id: 'flt-l10n',
    categoryId: 'flutter',
    term: 'Локализация (intl / l10n / ARB)',
    short: 'Вынос текстов интерфейса в отдельные файлы переводов вместо строк, зашитых прямо в код.',
    detail:
      'i18n (internationalization) — подготовка приложения к нескольким языкам. Тексты хранят в ARB-файлах (JSON-подобный формат с ключами и переводами, например app_ru.arb, app_en.arb), а генератор создаёт типобезопасный класс доступа к переводам. В UI строку берут по ключу (context.locale.appTitle), а не пишут напрямую — это правило действует во всех разобранных Flutter-проектах.',
    example: 'modules/core/l10n.yaml в sybols_gitlab и gitlab-mobile-app настраивает шаблонный язык и генерацию AppLocalizations.',
  },
  {
    id: 'flt-fvm',
    categoryId: 'flutter',
    term: 'FVM (Flutter Version Management)',
    short: 'Инструмент, закрепляющий за конкретным проектом свою версию Flutter SDK.',
    detail:
      'Разные проекты могут требовать разные версии Flutter, а установлена обычно одна глобальная. FVM позволяет зафиксировать версию для каждого проекта (файл .fvmrc) и хранит несколько версий SDK параллельно, переключаясь автоматически между проектами. Это устраняет классическую проблему «на моей машине собирается, на твоей — нет» из-за расхождения версий инструментов.',
    example: '.fvmrc в sybols_gitlab закрепляет Flutter 3.38.6.',
    related: ['flt-dart'],
  },
]
