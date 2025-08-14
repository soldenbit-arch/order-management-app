# Инструкции по деплою на Render

## 🚀 Подготовка проекта

Проект уже подготовлен к деплою! Все необходимые файлы созданы:

- ✅ `.gitignore` - исключает ненужные файлы
- ✅ `render.yaml` - конфигурация для Render
- ✅ `Dockerfile` - для контейнеризации (опционально)
- ✅ `next.config.ts` - настроен для продакшена
- ✅ `.eslintrc.json` - отключены строгие правила для сборки

## 📋 Пошаговый деплой

### 1. Создание GitHub репозитория

1. Перейдите на [GitHub](https://github.com)
2. Создайте новый репозиторий (например, `order-management-app`)
3. НЕ инициализируйте с README, .gitignore или лицензией

### 2. Загрузка кода в GitHub

```bash
# В папке проекта выполните:
git init
git add .
git commit -m "Initial commit - готово к деплою на Render"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/order-management-app.git
git push -u origin main
```

### 3. Настройка Render

1. Перейдите на [Render](https://render.com)
2. Войдите в аккаунт или создайте новый
3. Нажмите "New +" → "Web Service"
4. Подключите GitHub репозиторий
5. Выберите репозиторий `order-management-app`

### 4. Настройки Render

**Основные настройки:**
- **Name**: `order-management-app` (или любое другое)
- **Environment**: `Node`
- **Region**: выберите ближайший к вашим пользователям
- **Branch**: `main`
- **Root Directory**: оставьте пустым

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (для начала)

**Environment Variables:**
- `NODE_ENV`: `production`
- `PORT`: `10000`

### 5. Деплой

1. Нажмите "Create Web Service"
2. Render автоматически начнет сборку
3. Дождитесь завершения (обычно 5-10 минут)
4. Приложение будет доступно по URL вида: `https://your-app-name.onrender.com`

## 🔧 Возможные проблемы

### Ошибка сборки
- Проверьте логи в Render Dashboard
- Убедитесь, что все зависимости указаны в `package.json`

### Ошибка запуска
- Проверьте переменные окружения
- Убедитесь, что порт 10000 доступен

### Проблемы с API
- API роуты работают автоматически
- Проверьте логи в Render Dashboard

## 📱 Проверка работы

После успешного деплоя проверьте:

1. **Главная страница** - загружается ли
2. **Навигация** - работают ли все ссылки
3. **API** - тестовые запросы к `/api/services`
4. **Формы** - отправляются ли данные
5. **Адаптивность** - проверьте на мобильных устройствах

## 🔄 Автоматический деплой

Render автоматически пересобирает и деплоит приложение при каждом push в main ветку GitHub.

## 💰 Стоимость

- **Free план**: 750 часов в месяц, автоматическое засыпание
- **Paid план**: от $7/месяц, всегда активен

## 📞 Поддержка

При проблемах:
1. Проверьте логи в Render Dashboard
2. Обратитесь в [Render Support](https://render.com/docs/help)
3. Проверьте [Next.js документацию](https://nextjs.org/docs)

---

**Удачи с деплоем! 🎉** 