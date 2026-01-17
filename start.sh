#!/bin/bash

# SmartClaim AI - Quick Start Script
# This script helps you get started with the backend

echo "🚀 SmartClaim AI - Backend Setup"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Building and starting containers..."
echo ""

# Build and start containers
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📍 Available services:"
echo "   - API Docs:     http://localhost:8000/docs"
echo "   - Root:         http://localhost:8000"
echo "   - Health Check: http://localhost:8000/api/v1/health"
echo "   - PostgreSQL:   localhost:5432"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f backend"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
