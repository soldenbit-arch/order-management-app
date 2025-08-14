@echo off
echo ========================================
echo Обновление GitHub репозитория
echo ========================================

echo.
echo Шаг 1: Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Git не установлен!
    echo Скачайте Git с: https://git-scm.com/download/win
    echo После установки перезапустите этот скрипт
    pause
    exit /b 1
)

echo Git найден: 
git --version

echo.
echo Шаг 2: Клонирование репозитория...
if exist "order-management-app" (
    echo Удаление старой папки...
    rmdir /s /q "order-management-app"
)

git clone https://github.com/soldenbit-arch/order-management-app.git
if errorlevel 1 (
    echo ОШИБКА: Не удалось клонировать репозиторий!
    echo Проверьте URL и права доступа
    pause
    exit /b 1
)

echo.
echo Шаг 3: Копирование новых файлов...
cd order-management-app

echo Копирование src...
xcopy /e /y "..\src" "src\"

echo Копирование public...
xcopy /e /y "..\public" "public\"

echo Копирование data...
xcopy /e /y "..\data" "data\"

echo Копирование конфигурационных файлов...
copy "..\package.json" "package.json"
copy "..\next.config.ts" "next.config.ts"
copy "..\tailwind.config.ts" "tailwind.config.ts"
copy "..\tsconfig.json" "tsconfig.json"
copy "..\postcss.config.mjs" "postcss.config.mjs"
copy "..\eslint.config.mjs" "eslint.config.mjs"
copy "..\render.yaml" "render.yaml"
copy "..\README.md" "README.md"
copy "..\DEPLOY.md" "DEPLOY.md"
copy "..\GITHUB_SETUP.md" "GITHUB_SETUP.md"
copy "..\QUICK_START.md" "QUICK_START.md"

echo.
echo Шаг 4: Загрузка на GitHub...
git add .
git commit -m "Complete project update: working images, Render deployment, fixed dependencies"
git push origin main

if errorlevel 1 (
    echo ОШИБКА: Не удалось загрузить на GitHub!
    echo Проверьте настройки Git и права доступа
    pause
    exit /b 1
)

echo.
echo ========================================
echo ГОТОВО! Репозиторий обновлен!
echo ========================================
echo.
echo Теперь можете подключить его к Render:
echo 1. Зайдите на https://render.com
echo 2. Создайте новый Web Service
echo 3. Подключите GitHub репозиторий
echo 4. Render автоматически настроится!
echo.
pause 