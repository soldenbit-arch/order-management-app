@echo off
echo Исправление ошибок линтера...

echo.
echo 1. Установка зависимостей...
call npm install

echo.
echo 2. Запуск линтера с автоматическим исправлением...
call npm run lint -- --fix

echo.
echo 3. Проверка сборки...
call npm run build

echo.
echo Готово! Нажмите любую клавишу для выхода...
pause >nul 