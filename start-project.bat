@echo off
chcp 65001 >nul
title Запуск проекта Кворк

echo.
echo ========================================
echo    ЗАПУСК ПРОЕКТА КВОРК
echo ========================================
echo.

:: Проверяем наличие Node.js
echo [1/5] Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: Node.js не установлен!
    echo.
    echo Для установки Node.js:
    echo 1. Перейдите на https://nodejs.org/
    echo 2. Скачайте и установите LTS версию
    echo 3. Перезапустите компьютер
    echo 4. Запустите этот батник снова
    echo.
    pause
    exit /b 1
)

:: Проверяем версию Node.js
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js найден: %NODE_VERSION%

:: Проверяем наличие npm
echo [2/5] Проверка npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: npm не найден!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm найден: %NPM_VERSION%

:: Проверяем наличие package.json
echo [3/5] Проверка файлов проекта...
if not exist "package.json" (
    echo ❌ ОШИБКА: package.json не найден!
    echo Убедитесь, что вы находитесь в папке проекта.
    pause
    exit /b 1
)
echo ✅ package.json найден

:: Проверяем node_modules
echo [4/5] Проверка зависимостей...
if not exist "node_modules" (
    echo 📦 Установка зависимостей...
    echo Это может занять несколько минут...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ ОШИБКА при установке зависимостей!
        echo Попробуйте запустить: npm install --legacy-peer-deps
        pause
        exit /b 1
    )
    echo ✅ Зависимости установлены
) else (
    echo ✅ Зависимости уже установлены
)

:: Запускаем проект
echo [5/5] Запуск проекта...
echo.
echo 🚀 Запускаю сервер разработки...
echo 📱 Откройте браузер и перейдите по адресу: http://localhost:3000
echo.
echo Для остановки сервера нажмите Ctrl+C
echo.
echo ========================================
echo.

npm run dev

pause 