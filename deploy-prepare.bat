@echo off
echo Подготовка проекта к деплою на Render...

echo.
echo 1. Очистка предыдущих сборок...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

echo.
echo 2. Установка зависимостей...
call npm install

echo.
echo 3. Проверка сборки...
call npm run build

echo.
echo 4. Проверка продакшн версии...
call npm start

echo.
echo Проект готов к деплою!
echo Теперь выполните следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Загрузите код в репозиторий
echo 3. В Render создайте новый Web Service
echo 4. Подключите GitHub репозиторий
echo 5. Настройте переменные окружения
echo.
echo Нажмите любую клавишу для выхода...
pause >nul 