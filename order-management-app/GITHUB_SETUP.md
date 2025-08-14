# Настройка GitHub репозитория

## Шаг 1: Установка Git

1. Скачайте Git для Windows: https://git-scm.com/download/win
2. Установите Git, используя настройки по умолчанию
3. Перезапустите PowerShell/командную строку

## Шаг 2: Настройка Git

После установки Git выполните команды:

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

## Шаг 3: Создание GitHub репозитория

1. Зайдите на https://github.com
2. Нажмите "New repository"
3. Введите название репозитория (например: `order-management-app`)
4. Оставьте репозиторий публичным
5. НЕ создавайте README, .gitignore или лицензию
6. Нажмите "Create repository"

## Шаг 4: Загрузка проекта на GitHub

После установки Git выполните команды:

```bash
git init
git add .
git commit -m "Initial commit: Order Management Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Замените `YOUR_USERNAME` и `YOUR_REPO_NAME` на ваши данные.

## Шаг 5: Подключение к Render

1. Зайдите на https://render.com
2. Создайте аккаунт или войдите
3. Нажмите "New +" → "Web Service"
4. Подключите ваш GitHub репозиторий
5. Render автоматически определит настройки из `render.yaml`
6. Нажмите "Create Web Service"

## Структура файлов для GitHub

✅ **Включены в репозиторий:**
- `src/` - исходный код
- `public/` - статические файлы
- `package.json` - зависимости
- `next.config.ts` - конфигурация Next.js
- `tailwind.config.ts` - конфигурация Tailwind
- `tsconfig.json` - конфигурация TypeScript
- `render.yaml` - конфигурация Render
- `README.md` - описание проекта
- `DEPLOY.md` - инструкции по деплою

❌ **Исключены из репозитория:**
- `node_modules/` - зависимости (устанавливаются автоматически)
- `.next/` - временные файлы сборки
- `package-lock.json` - можно включить для точности версий 