# Инструкции по развертыванию на Render

## Проблемы, которые были исправлены:

1. **Несовместимость React 19** - понижена версия до React 18.3.1
2. **Проблемная библиотека react-indiana-drag-scroll** - заменена на CSS-решение
3. **Устаревшие библиотеки** - удалены react-spring, react-swipeable-views и другие
4. **Конфигурация Next.js** - переименован next.config.ts в next.config.js
5. **PostCSS зависимости** - добавлены autoprefixer и tailwindcss
6. **TypeScript конфигурация** - обновлена для поддержки ES2015+

## Текущие зависимости:

- React 18.3.1
- Next.js 14.2.5
- Tailwind CSS 3.4.1
- Framer Motion 12.4.7

## Развертывание:

1. Загрузите код в GitHub репозиторий
2. В Render создайте новый Web Service
3. Подключите GitHub репозиторий
4. Используйте следующие настройки:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

## Примечания:

- Проект успешно собирается локально
- Есть предупреждение о useSearchParams() в /functions-steps (не критично)
- Все основные функции работают корректно 