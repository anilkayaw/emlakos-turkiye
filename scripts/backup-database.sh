#!/bin/bash

# EmlakOS Türkiye - Veritabanı Backup Scripti
# Güvenli ve otomatik backup sistemi

set -e

echo "💾 EmlakOS Türkiye Veritabanı Backup Başlatılıyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfigürasyon
BACKUP_DIR="database/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="emlakos_backup_${DATE}.sql"
COMPRESSED_FILE="emlakos_backup_${DATE}.tar.gz"
RETENTION_DAYS=30

# Veritabanı bilgileri
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="emlakos_turkiye"
DB_USER="emlakos_admin"
DB_PASSWORD="EmlakOS2024!SecureDB"

# Backup dizinini oluştur
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📁 Backup dizini: ${BACKUP_DIR}${NC}"

# Veritabanı bağlantısını test et
echo -e "${YELLOW}🔍 Veritabanı bağlantısı test ediliyor...${NC}"
if ! PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
    echo -e "${RED}❌ Veritabanı bağlantısı başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Veritabanı bağlantısı başarılı${NC}"

# Backup oluştur
echo -e "${YELLOW}💾 Veritabanı backup'ı oluşturuluyor...${NC}"
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --clean \
    --create \
    --if-exists \
    --format=plain \
    --file="$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup başarıyla oluşturuldu: ${BACKUP_FILE}${NC}"
else
    echo -e "${RED}❌ Backup oluşturulamadı!${NC}"
    exit 1
fi

# Backup'ı sıkıştır
echo -e "${YELLOW}🗜️  Backup sıkıştırılıyor...${NC}"
cd "$BACKUP_DIR"
tar -czf "$COMPRESSED_FILE" "$BACKUP_FILE"
rm "$BACKUP_FILE"
cd - > /dev/null

echo -e "${GREEN}✅ Backup sıkıştırıldı: ${COMPRESSED_FILE}${NC}"

# Backup boyutunu göster
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$COMPRESSED_FILE" | cut -f1)
echo -e "${BLUE}📊 Backup boyutu: ${BACKUP_SIZE}${NC}"

# Eski backup'ları temizle
echo -e "${YELLOW}🧹 Eski backup'lar temizleniyor...${NC}"
find "$BACKUP_DIR" -name "emlakos_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

echo -e "${GREEN}✅ ${RETENTION_DAYS} günden eski backup'lar temizlendi${NC}"

# Backup listesini göster
echo ""
echo -e "${BLUE}📋 Mevcut Backup'lar:${NC}"
ls -lh "$BACKUP_DIR"/emlakos_backup_*.tar.gz 2>/dev/null | awk '{print "  • " $9 " (" $5 ", " $6 " " $7 " " $8 ")"}' || echo "  • Henüz backup yok"

# Backup doğrulama
echo -e "${YELLOW}🔍 Backup doğrulanıyor...${NC}"
if tar -tzf "$BACKUP_DIR/$COMPRESSED_FILE" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backup dosyası geçerli${NC}"
else
    echo -e "${RED}❌ Backup dosyası bozuk!${NC}"
    exit 1
fi

# Backup özeti
echo ""
echo -e "${GREEN}🎉 Backup işlemi tamamlandı!${NC}"
echo "=================================================="
echo -e "${BLUE}📊 Backup Özeti:${NC}"
echo -e "  • Dosya: ${GREEN}${BACKUP_DIR}/${COMPRESSED_FILE}${NC}"
echo -e "  • Boyut: ${GREEN}${BACKUP_SIZE}${NC}"
echo -e "  • Tarih: ${GREEN}$(date)${NC}"
echo -e "  • Saklama: ${GREEN}${RETENTION_DAYS} gün${NC}"
echo ""
echo -e "${YELLOW}💡 Restore Komutu:${NC}"
echo -e "  ${BLUE}tar -xzf ${BACKUP_DIR}/${COMPRESSED_FILE} && psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f ${BACKUP_FILE}${NC}"
echo ""
echo -e "${GREEN}✨ Backup sistemi aktif!${NC}"
