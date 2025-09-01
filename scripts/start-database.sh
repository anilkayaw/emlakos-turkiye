#!/bin/bash

# EmlakOS Türkiye - Veritabanı Başlatma Scripti
# En güvenli ve hızlı PostgreSQL + PostGIS kurulumu

set -e

echo "🗄️  EmlakOS Türkiye Veritabanı Başlatılıyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker bulunamadı. Lütfen Docker'ı yükleyin.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose bulunamadı. Lütfen Docker Compose'u yükleyin.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Docker ve Docker Compose kontrolü başarılı${NC}"

# Proje dizinine git
cd "$(dirname "$0")/.."

# Veritabanı dizinlerini oluştur
echo -e "${YELLOW}📁 Veritabanı dizinleri oluşturuluyor...${NC}"
mkdir -p database/data/postgres
mkdir -p database/data/redis
mkdir -p database/data/pgadmin
mkdir -p database/backups
mkdir -p database/logs

# İzinleri ayarla
chmod 755 database/data/postgres
chmod 755 database/data/redis
chmod 755 database/data/pgadmin

echo -e "${GREEN}✅ Dizinler oluşturuldu${NC}"

# Environment dosyasını oluştur
if [ ! -f database/.env ]; then
    echo -e "${YELLOW}🔧 Environment dosyası oluşturuluyor...${NC}"
    cat > database/.env << EOF
# EmlakOS Türkiye Database Environment Variables

# PostgreSQL Configuration
POSTGRES_DB=emlakos_turkiye
POSTGRES_USER=emlakos_admin
POSTGRES_PASSWORD=EmlakOS2024!SecureDB
POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=tr_TR.UTF-8 --lc-ctype=tr_TR.UTF-8

# Redis Configuration
REDIS_PASSWORD=EmlakOS2024!RedisPass

# pgAdmin Configuration
PGADMIN_DEFAULT_EMAIL=admin@emlakos.com
PGADMIN_DEFAULT_PASSWORD=EmlakOS2024!Admin

# Network Configuration
NETWORK_NAME=emlakos-network
NETWORK_SUBNET=172.20.0.0/16
EOF
    echo -e "${GREEN}✅ Environment dosyası oluşturuldu${NC}"
fi

# Docker network oluştur
echo -e "${YELLOW}🌐 Docker network oluşturuluyor...${NC}"
docker network create emlakos-network --subnet=172.20.0.0/16 2>/dev/null || echo "Network zaten mevcut"

# Veritabanı servislerini başlat
echo -e "${YELLOW}🚀 Veritabanı servisleri başlatılıyor...${NC}"
cd database
docker-compose -f docker-compose.db.yml up -d

# Servislerin başlamasını bekle
echo -e "${YELLOW}⏳ Servislerin başlaması bekleniyor...${NC}"
sleep 10

# Health check
echo -e "${YELLOW}🔍 Servis durumu kontrol ediliyor...${NC}"

# PostgreSQL health check
if docker exec emlakos-postgres pg_isready -U emlakos_admin -d emlakos_turkiye > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL başarıyla çalışıyor${NC}"
else
    echo -e "${RED}❌ PostgreSQL başlatılamadı${NC}"
    exit 1
fi

# Redis health check
if docker exec emlakos-redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis başarıyla çalışıyor${NC}"
else
    echo -e "${RED}❌ Redis başlatılamadı${NC}"
    exit 1
fi

# pgAdmin health check
if curl -s http://localhost:5050 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ pgAdmin başarıyla çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  pgAdmin henüz hazır değil (normal)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Veritabanı sistemi başarıyla başlatıldı!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📊 Servis Bilgileri:${NC}"
echo -e "  • PostgreSQL: ${GREEN}localhost:5432${NC}"
echo -e "  • Redis: ${GREEN}localhost:6379${NC}"
echo -e "  • pgAdmin: ${GREEN}http://localhost:5050${NC}"
echo ""
echo -e "${BLUE}🔐 Bağlantı Bilgileri:${NC}"
echo -e "  • Database: ${YELLOW}emlakos_turkiye${NC}"
echo -e "  • Username: ${YELLOW}emlakos_admin${NC}"
echo -e "  • Password: ${YELLOW}EmlakOS2024!SecureDB${NC}"
echo ""
echo -e "${BLUE}🛠️  pgAdmin Bilgileri:${NC}"
echo -e "  • Email: ${YELLOW}admin@emlakos.com${NC}"
echo -e "  • Password: ${YELLOW}EmlakOS2024!Admin${NC}"
echo ""
echo -e "${YELLOW}💡 Sonraki Adımlar:${NC}"
echo -e "  1. pgAdmin'e giriş yapın: http://localhost:5050"
echo -e "  2. PostgreSQL sunucusuna bağlanın"
echo -e "  3. Auth service'i başlatın: ./scripts/start-auth-service.sh"
echo -e "  4. Frontend'i başlatın: npm run dev"
echo ""
echo -e "${GREEN}✨ Veritabanı hazır! Artık uygulamanızı kullanabilirsiniz.${NC}"
