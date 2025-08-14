# Order Management Application

Веб-приложение для управления заказами и партнерскими услугами.

## Технологии

- Next.js 15.1.7
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Деплой на Render

1. Загрузите код на GitHub
2. Подключите репозиторий к Render
3. Render автоматически определит настройки из `render.yaml`
4. Приложение будет доступно по адресу: https://your-app-name.onrender.com

## Структура проекта

- `src/app/` - страницы и API роуты
- `src/components/` - React компоненты
- `public/images/` - изображения и иконки
- `data/` - JSON файлы с данными

## API Endpoints

- `/api/services` - получение услуг
- `/api/orders` - управление заказами
- `/api/partners` - управление партнерами
- `/api/users` - управление пользователями 