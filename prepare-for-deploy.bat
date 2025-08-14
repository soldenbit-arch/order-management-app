@echo off
echo ========================================
echo ПОДГОТОВКА ПРОЕКТА К ДЕПЛОЮ НА RENDER
echo ========================================

echo.
echo 1. Проверка структуры проекта...
if exist src\app (
    echo ✅ Структура src/app найдена
) else (
    echo ❌ Структура src/app не найдена
    exit /b 1
)

if exist package.json (
    echo ✅ package.json найден
) else (
    echo ❌ package.json не найден
    exit /b 1
)

echo.
echo 2. Очистка предыдущих сборок...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules rmdir /s /q node_modules

echo.
echo 3. Установка зависимостей...
call npm install

echo.
echo 4. Проверка сборки...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Сборка успешна!
) else (
    echo ❌ Ошибка сборки
    echo Проверьте логи выше и исправьте ошибки
    pause
    exit /b 1
)

echo.
echo 5. Проверка продакшн версии...
start /B npm start
timeout /t 5 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo.
echo ========================================
echo ПРОЕКТ ГОТОВ К ДЕПЛОЮ! 🎉
echo ========================================
echo.
echo Следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Загрузите код в репозиторий
echo 3. В Render создайте новый Web Service
echo 4. Подключите GitHub репозиторий
echo 5. Настройте переменные окружения
echo.
echo Подробные инструкции в файле DEPLOY_INSTRUCTIONS.md
echo.
echo Нажмите любую клавишу для выхода...
pause >nul 