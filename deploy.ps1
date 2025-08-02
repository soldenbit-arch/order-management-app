# Скрипт для развертывания на Vercel
Write-Host "🚀 Начинаем развертывание на Vercel..." -ForegroundColor Green

# Проверяем, установлен ли Vercel CLI
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI найден: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI не найден. Устанавливаем..." -ForegroundColor Yellow
    npm install -g vercel
}

# Проверяем, залогинен ли пользователь
Write-Host "🔐 Проверяем авторизацию..." -ForegroundColor Yellow
vercel whoami

# Собираем проект
Write-Host "🔨 Собираем проект..." -ForegroundColor Yellow
npm run build

# Развертываем
Write-Host "🚀 Развертываем на Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Развертывание завершено!" -ForegroundColor Green
Write-Host "📋 Проверьте URL в терминале выше" -ForegroundColor Cyan 