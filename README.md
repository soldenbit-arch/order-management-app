# Order Management App

Приложение для управления заказами и партнерскими услугами.

## Технологии

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшн версии
npm start
```

## Деплой на Render

### Через GitHub (рекомендуется)

1. Создайте репозиторий на GitHub
2. Загрузите код в репозиторий
3. В Render создайте новый Web Service
4. Подключите GitHub репозиторий
5. Настройки:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Port**: `10000`

### Переменные окружения

- `NODE_ENV`: `production`
- `PORT`: `10000`

## Структура проекта

- `/src/app` - страницы приложения (App Router)
- `/src/components` - переиспользуемые компоненты
- `/src/types` - TypeScript типы
- `/public` - статические файлы
- `/data` - JSON данные для разработки

## Особенности

- Адаптивный дизайн
- Поддержка мобильных устройств
- Интеграция с платежными системами
- Партнерская панель
- Система заказов 