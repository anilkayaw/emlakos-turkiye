#!/bin/bash

# EmlakOS Türkiye - Tüm Servisleri Başlatma Scripti
# Tam sürüm - Tüm microservices

set -e

echo "🚀 EmlakOS Türkiye - Tüm Servisleri Başlatılıyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Proje dizinine git
cd "$(dirname "$0")/.."

# Mevcut servisleri durdur
echo -e "${YELLOW}🛑 Mevcut servisleri durduruluyor...${NC}"
pkill -f "go run main.go" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Docker servislerini kontrol et
echo -e "${YELLOW}🐳 Docker servisleri kontrol ediliyor...${NC}"
if ! docker ps | grep -q "emlakos-postgres"; then
    echo -e "${RED}❌ PostgreSQL çalışmıyor! Önce veritabanını başlatın.${NC}"
    echo -e "${BLUE}💡 Komut: ./scripts/start-database.sh${NC}"
    exit 1
fi

if ! docker ps | grep -q "emlakos-redis"; then
    echo -e "${RED}❌ Redis çalışmıyor! Önce veritabanını başlatın.${NC}"
    echo -e "${BLUE}💡 Komut: ./scripts/start-database.sh${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker servisleri çalışıyor${NC}"

# Auth Service başlat
echo -e "${YELLOW}🔐 Auth Service başlatılıyor...${NC}"
cd backend/auth-service
nohup go run main.go > ../../logs/auth-service.log 2>&1 &
AUTH_PID=$!
echo "Auth Service PID: $AUTH_PID"
cd ../..

# User Service başlat
echo -e "${YELLOW}👤 User Service başlatılıyor...${NC}"
cd backend/user-service
nohup go run main.go > ../../logs/user-service.log 2>&1 &
USER_PID=$!
echo "User Service PID: $USER_PID"
cd ../..

# Listing Service başlat
echo -e "${YELLOW}🏠 Listing Service başlatılıyor...${NC}"
cd backend/listing-service
nohup go run main.go > ../../logs/listing-service.log 2>&1 &
LISTING_PID=$!
echo "Listing Service PID: $LISTING_PID"
cd ../..

# Message Service başlat
echo -e "${YELLOW}💬 Message Service başlatılıyor...${NC}"
cd backend/message-service
nohup go run main.go > ../../logs/message-service.log 2>&1 &
MESSAGE_PID=$!
echo "Message Service PID: $MESSAGE_PID"
cd ../..

# API Gateway başlat
echo -e "${YELLOW}🌐 API Gateway başlatılıyor...${NC}"
cd backend/api-gateway
nohup go run main.go > ../../logs/api-gateway.log 2>&1 &
GATEWAY_PID=$!
echo "API Gateway PID: $GATEWAY_PID"
cd ../..

# Frontend başlat
echo -e "${YELLOW}🎨 Frontend başlatılıyor...${NC}"
cd frontend/web-app
nohup npm run dev > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ../..

# Log dizinini oluştur
mkdir -p logs

# Servislerin başlamasını bekle
echo -e "${YELLOW}⏳ Servislerin başlaması bekleniyor...${NC}"
sleep 15

# Health check
echo -e "${YELLOW}🔍 Servis durumu kontrol ediliyor...${NC}"

# Auth Service health check
if curl -s http://localhost:8082/api/auth/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth Service (8082) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ Auth Service (8082) - Başlamadı${NC}"
fi

# User Service health check
if curl -s http://localhost:8083/api/users/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ User Service (8083) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ User Service (8083) - Başlamadı${NC}"
fi

# Listing Service health check
if curl -s http://localhost:8084/api/listings/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Listing Service (8084) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ Listing Service (8084) - Başlamadı${NC}"
fi

# Message Service health check
if curl -s http://localhost:8085/api/messages/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Message Service (8085) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ Message Service (8085) - Başlamadı${NC}"
fi

# API Gateway health check
if curl -s http://localhost:8080/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway (8080) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ API Gateway (8080) - Başlamadı${NC}"
fi

# Frontend health check
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend (3000) - Çalışıyor${NC}"
else
    echo -e "${RED}❌ Frontend (3000) - Başlamadı${NC}"
fi

# PID'leri kaydet
echo "$AUTH_PID" > logs/auth-service.pid
echo "$USER_PID" > logs/user-service.pid
echo "$LISTING_PID" > logs/listing-service.pid
echo "$MESSAGE_PID" > logs/message-service.pid
echo "$GATEWAY_PID" > logs/api-gateway.pid
echo "$FRONTEND_PID" > logs/frontend.pid

echo ""
echo -e "${GREEN}🎉 Tüm servisler başlatıldı!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📊 Servis Bilgileri:${NC}"
echo -e "  • Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  • API Gateway: ${GREEN}http://localhost:8080${NC}"
echo -e "  • Auth Service: ${GREEN}http://localhost:8082${NC}"
echo -e "  • User Service: ${GREEN}http://localhost:8083${NC}"
echo -e "  • Listing Service: ${GREEN}http://localhost:8084${NC}"
echo -e "  • Message Service: ${GREEN}http://localhost:8085${NC}"
echo -e "  • PostgreSQL: ${GREEN}localhost:5432${NC}"
echo -e "  • Redis: ${GREEN}localhost:6379${NC}"
echo -e "  • pgAdmin: ${GREEN}http://localhost:5050${NC}"
echo ""
echo -e "${BLUE}📋 Test Endpoints:${NC}"
echo -e "  • Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  • API Health: ${GREEN}http://localhost:8080/api/health${NC}"
echo -e "  • Auth Health: ${GREEN}http://localhost:8082/api/auth/health${NC}"
echo -e "  • Listings: ${GREEN}http://localhost:8080/api/v1/listings${NC}"
echo -e "  • Messages: ${GREEN}http://localhost:8080/api/v1/messages/conversations${NC}"
echo ""
echo -e "${BLUE}📁 Log Dosyaları:${NC}"
echo -e "  • Auth Service: ${GREEN}logs/auth-service.log${NC}"
echo -e "  • User Service: ${GREEN}logs/user-service.log${NC}"
echo -e "  • Listing Service: ${GREEN}logs/listing-service.log${NC}"
echo -e "  • Message Service: ${GREEN}logs/message-service.log${NC}"
echo -e "  • API Gateway: ${GREEN}logs/api-gateway.log${NC}"
echo -e "  • Frontend: ${GREEN}logs/frontend.log${NC}"
echo ""
echo -e "${YELLOW}💡 Servisleri durdurmak için:${NC}"
echo -e "  ${BLUE}./scripts/stop-all-services.sh${NC}"
echo ""
echo -e "${GREEN}✨ EmlakOS Türkiye tam sürüm hazır!${NC}"
