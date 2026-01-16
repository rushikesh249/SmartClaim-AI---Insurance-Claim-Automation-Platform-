# SmartClaim AI - Quick Start Script (Windows)
# This script helps you get started with the backend

Write-Host "🚀 SmartClaim AI - Backend Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Navigate to backend directory
Set-Location $PSScriptRoot

# Check if .env exists, if not copy from .env.example
if (-Not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🏗️  Building and starting containers..." -ForegroundColor Yellow
Write-Host ""

# Build and start containers
docker-compose up --build -d

Write-Host ""
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Available services:" -ForegroundColor Cyan
Write-Host "   - API Docs:     http://localhost:8000/docs"
Write-Host "   - Root:         http://localhost:8000"
Write-Host "   - Health Check: http://localhost:8000/api/v1/health"
Write-Host "   - PostgreSQL:   localhost:5432"
Write-Host ""
Write-Host "📊 View logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f backend"
Write-Host ""
Write-Host "🛑 Stop services:" -ForegroundColor Cyan
Write-Host "   docker-compose down"
Write-Host ""
