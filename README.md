# Система управления заказами услуг

Современное веб-приложение для управления заказами услуг с админ-панелью и интеграцией форм.

## Функциональность

### Для пользователей:
- ✅ Просмотр категорий услуг
- ✅ Детальная информация об услугах
- ✅ Регистрация и верификация
- ✅ Отправка заявок через формы
- ✅ Настройка функций услуг
- ✅ Оформление заказов

### Для администраторов:
- ✅ Админ-панель для управления услугами
- ✅ Создание, редактирование и удаление услуг
- ✅ Управление категориями и ценами
- ✅ Просмотр заявок от пользователей

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Framer Motion, React Spring
- **Forms**: React OTP Input, React Form Stepper
- **Deployment**: Vercel

## Установка и запуск

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd кворк
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере

### Сборка для продакшена

```bash
npm run build
npm start
```

## Деплой

### На Vercel (рекомендуется)

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт Vercel:
```bash
vercel login
```

3. Деплойте проект:
```bash
vercel
```

4. Для продакшн деплоя:
```bash
vercel --prod
```

### Альтернативные хостинги

#### Netlify
1. Подключите репозиторий к Netlify
2. Настройте build команду: `npm run build`
3. Настройте publish directory: `.next`

#### Railway
1. Подключите репозиторий к Railway
2. Настройте переменные окружения
3. Деплой произойдет автоматически

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── contact/       # Формы обратной связи
│   │   └── services/      # CRUD для услуг
│   ├── admin/             # Админ-панель
│   ├── functions-steps/   # Настройка функций
│   ├── order-created/     # Подтверждение заказа
│   ├── signup/           # Регистрация
│   └── verification/     # Верификация
├── components/            # React компоненты
│   └── common/           # Общие компоненты
└── types/                # TypeScript типы
```

## API Endpoints

### POST /api/contact
Отправка контактных форм
```json
{
  "name": "Имя",
  "email": "email@example.com", 
  "phone": "+7 (999) 999-99-99",
  "message": "Сообщение",
  "service": 1
}
```

### GET /api/services
Получение списка услуг

### POST /api/services
Создание новой услуги
```json
{
  "name": "Название услуги",
  "category": "Категория",
  "price": "100 000 ₽ +",
  "description": "Описание",
  "image": "/images/service.png",
  "features": ["Функция 1", "Функция 2"]
}
```

### PUT /api/services
Обновление услуги

### DELETE /api/services?id=1
Удаление услуги

## Админ-панель

Доступна по адресу `/admin`

Возможности:
- Просмотр всех услуг
- Создание новых услуг
- Редактирование существующих услуг
- Удаление услуг
- Управление категориями и ценами

## Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшн сервера
- `npm run lint` - Проверка кода

## Поддержка

Для вопросов и предложений создавайте issues в репозитории.

## Лицензия

MIT License
