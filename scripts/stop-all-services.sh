#!/bin/bash

# EmlakOS Türkiye - Tüm Servisleri Durdurma Scripti

set -e

echo "🛑 EmlakOS Türkiye - Tüm Servisleri Durduruluyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Proje dizinine git
cd "$(dirname "$0")/.."

# PID dosyalarından servisleri durdur
if [ -f logs/auth-service.pid ]; then
    AUTH_PID=$(cat logs/auth-service.pid)
    if kill -0 $AUTH_PID 2>/dev/null; then
        echo -e "${YELLOW}🔐 Auth Service durduruluyor...${NC}"
        kill $AUTH_PID
        echo -e "${GREEN}✅ Auth Service durduruldu${NC}"
    fi
    rm logs/auth-service.pid
fi

if [ -f logs/user-service.pid ]; then
    USER_PID=$(cat logs/user-service.pid)
    if kill -0 $USER_PID 2>/dev/null; then
        echo -e "${YELLOW}👤 User Service durduruluyor...${NC}"
        kill $USER_PID
        echo -e "${GREEN}✅ User Service durduruldu${NC}"
    fi
    rm logs/user-service.pid
fi

if [ -f logs/listing-service.pid ]; then
    LISTING_PID=$(cat logs/listing-service.pid)
    if kill -0 $LISTING_PID 2>/dev/null; then
        echo -e "${YELLOW}🏠 Listing Service durduruluyor...${NC}"
        kill $LISTING_PID
        echo -e "${GREEN}✅ Listing Service durduruldu${NC}"
    fi
    rm logs/listing-service.pid
fi

if [ -f logs/message-service.pid ]; then
    MESSAGE_PID=$(cat logs/message-service.pid)
    if kill -0 $MESSAGE_PID 2>/dev/null; then
        echo -e "${YELLOW}💬 Message Service durduruluyor...${NC}"
        kill $MESSAGE_PID
        echo -e "${GREEN}✅ Message Service durduruldu${NC}"
    fi
    rm logs/message-service.pid
fi

if [ -f logs/api-gateway.pid ]; then
    GATEWAY_PID=$(cat logs/api-gateway.pid)
    if kill -0 $GATEWAY_PID 2>/dev/null; then
        echo -e "${YELLOW}🌐 API Gateway durduruluyor...${NC}"
        kill $GATEWAY_PID
        echo -e "${GREEN}✅ API Gateway durduruldu${NC}"
    fi
    rm logs/api-gateway.pid
fi

if [ -f logs/frontend.pid ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}🎨 Frontend durduruluyor...${NC}"
        kill $FRONTEND_PID
        echo -e "${GREEN}✅ Frontend durduruldu${NC}"
    fi
    rm logs/frontend.pid
fi

# Kalan process'leri temizle
echo -e "${YELLOW}🧹 Kalan process'ler temizleniyor...${NC}"
pkill -f "go run main.go" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo ""
echo -e "${GREEN}🎉 Tüm servisler durduruldu!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}💡 Servisleri tekrar başlatmak için:${NC}"
echo -e "  ${GREEN}./scripts/start-all-services.sh${NC}"
echo ""
echo -e "${BLUE}💡 Sadece veritabanını durdurmak için:${NC}"
echo -e "  ${GREEN}cd database && docker-compose -f docker-compose.db.yml down${NC}"
echo ""
echo -e "${GREEN}✨ Temizlik tamamlandı!${NC}"
