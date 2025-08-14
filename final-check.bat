@echo off
echo ========================================
echo ФИНАЛЬНАЯ ПРОВЕРКА ГОТОВНОСТИ К ДЕПЛОЮ
echo ========================================

echo.
echo 1. Проверка критических файлов...
if exist next.config.js (
    echo ✅ next.config.js найден (исправлено для Render)
) else (
    echo ❌ next.config.js не найден
    exit /b 1
)

if exist package.json (
    echo ✅ package.json найден
) else (
    echo ❌ package.json не найден
    exit /b 1
)

echo.
echo 2. Проверка версий зависимостей...
findstr "react.*18" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ React 18 настроен (совместимо с зависимостями)
) else (
    echo ❌ React 18 не настроен
    exit /b 1
)

echo.
echo 3. Очистка и переустановка зависимостей...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
call npm install --legacy-peer-deps

echo.
echo 4. Финальная сборка...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Сборка успешна!
) else (
    echo ❌ Ошибка сборки
    echo Проверьте логи выше
    pause
    exit /b 1
)

echo.
echo ========================================
echo ПРОЕКТ ГОТОВ К ДЕПЛОЮ НА RENDER! 🎉
echo ========================================
echo.
echo Исправленные проблемы:
echo ✅ Конфликт версий React (React 18 вместо React 19)
echo ✅ Конфигурация Next.js (next.config.js вместо next.config.ts)
echo ✅ Совместимость с Render
echo.
echo Следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Загрузите код: git push -u origin main
echo 3. В Render создайте Web Service
echo 4. Подключите GitHub репозиторий
echo.
echo Нажмите любую клавишу для выхода...
pause >nul 