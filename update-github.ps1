Write-Host "========================================" -ForegroundColor Green
Write-Host "Обновление GitHub репозитория" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""

# Шаг 1: Проверка Git
Write-Host "Шаг 1: Проверка Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git найден: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Git не установлен!" -ForegroundColor Red
    Write-Host "Скачайте Git с: https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "После установки перезапустите этот скрипт" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""

# Шаг 2: Клонирование репозитория
Write-Host "Шаг 2: Клонирование репозитория..." -ForegroundColor Yellow
if (Test-Path "order-management-app") {
    Write-Host "Удаление старой папки..." -ForegroundColor Yellow
    Remove-Item -Path "order-management-app" -Recurse -Force
}

try {
    git clone https://github.com/soldenbit-arch/order-management-app.git
    Write-Host "Репозиторий успешно клонирован" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Не удалось клонировать репозиторий!" -ForegroundColor Red
    Write-Host "Проверьте URL и права доступа" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""

# Шаг 3: Копирование новых файлов
Write-Host "Шаг 3: Копирование новых файлов..." -ForegroundColor Yellow
Set-Location "order-management-app"

Write-Host "Копирование src..." -ForegroundColor Cyan
Copy-Item -Path "..\src" -Destination "." -Recurse -Force

Write-Host "Копирование public..." -ForegroundColor Cyan
Copy-Item -Path "..\public" -Destination "." -Recurse -Force

Write-Host "Копирование data..." -ForegroundColor Cyan
Copy-Item -Path "..\data" -Destination "." -Recurse -Force

Write-Host "Копирование конфигурационных файлов..." -ForegroundColor Cyan
Copy-Item -Path "..\package.json" -Destination "." -Force
Copy-Item -Path "..\next.config.ts" -Destination "." -Force
Copy-Item -Path "..\tailwind.config.ts" -Destination "." -Force
Copy-Item -Path "..\tsconfig.json" -Destination "." -Force
Copy-Item -Path "..\postcss.config.mjs" -Destination "." -Force
Copy-Item -Path "..\eslint.config.mjs" -Destination "." -Force
Copy-Item -Path "..\render.yaml" -Destination "." -Force
Copy-Item -Path "..\README.md" -Destination "." -Force
Copy-Item -Path "..\DEPLOY.md" -Destination "." -Force
Copy-Item -Path "..\GITHUB_SETUP.md" -Destination "." -Force
Copy-Item -Path "..\QUICK_START.md" -Destination "." -Force

Write-Host ""

# Шаг 4: Загрузка на GitHub
Write-Host "Шаг 4: Загрузка на GitHub..." -ForegroundColor Yellow
try {
    git add .
    git commit -m "Complete project update: working images, Render deployment, fixed dependencies"
    git push origin main
    Write-Host "Изменения успешно загружены на GitHub!" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Не удалось загрузить на GitHub!" -ForegroundColor Red
    Write-Host "Проверьте настройки Git и права доступа" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "ГОТОВО! Репозиторий обновлен!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь можете подключить его к Render:" -ForegroundColor Cyan
Write-Host "1. Зайдите на https://render.com" -ForegroundColor White
Write-Host "2. Создайте новый Web Service" -ForegroundColor White
Write-Host "3. Подключите GitHub репозиторий" -ForegroundColor White
Write-Host "4. Render автоматически настроится!" -ForegroundColor White
Write-Host ""

Read-Host "Нажмите Enter для выхода" 