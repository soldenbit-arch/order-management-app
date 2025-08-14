@echo off
chcp 65001 >nul
title Установка зависимостей Кворк

echo.
echo ========================================
echo    УСТАНОВКА ЗАВИСИМОСТЕЙ КВОРК
echo ========================================
echo.

:: Проверяем наличие Node.js
echo [1/3] Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ОШИБКА: Node.js не установлен!
    echo Установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js найден: %NODE_VERSION%

:: Проверяем наличие package.json
echo [2/3] Проверка файлов проекта...
if not exist "package.json" (
    echo ❌ ОШИБКА: package.json не найден!
    echo Убедитесь, что вы находитесь в папке проекта.
    pause
    exit /b 1
)
echo ✅ package.json найден

:: Устанавливаем зависимости
echo [3/3] Установка зависимостей...
echo.
echo 📦 Устанавливаю зависимости с флагом --legacy-peer-deps...
echo Это может занять несколько минут...
echo.

npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo.
    echo ❌ ОШИБКА при установке зависимостей!
    echo.
    echo Попробуйте следующие команды:
    echo 1. npm cache clean --force
    echo 2. npm install --legacy-peer-deps
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Зависимости успешно установлены!
echo.
echo Теперь можете запустить проект командой:
echo npm run dev
echo.
echo Или используйте батник: start-project.bat
echo.
pause 