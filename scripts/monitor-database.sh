#!/bin/bash

# EmlakOS Türkiye - Veritabanı Monitoring Scripti
# Kapsamlı güvenlik ve performans izleme

set -e

echo "📊 EmlakOS Türkiye Veritabanı Monitoring Başlatılıyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfigürasyon
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="emlakos_turkiye"
DB_USER="emlakos_admin"
DB_PASSWORD="EmlakOS2024!SecureDB"
LOG_FILE="database/logs/monitoring_$(date +%Y%m%d).log"

# Log dizinini oluştur
mkdir -p database/logs

# Log fonksiyonu
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Veritabanı bağlantısını test et
test_connection() {
    echo -e "${YELLOW}🔍 Veritabanı bağlantısı test ediliyor...${NC}"
    if docker exec emlakos-postgres pg_isready -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Veritabanı bağlantısı başarılı${NC}"
        log_message "Database connection: SUCCESS"
        return 0
    else
        echo -e "${RED}❌ Veritabanı bağlantısı başarısız!${NC}"
        log_message "Database connection: FAILED"
        return 1
    fi
}

# Veritabanı durumunu kontrol et
check_database_status() {
    echo -e "${YELLOW}📊 Veritabanı durumu kontrol ediliyor...${NC}"
    
    # Aktif bağlantı sayısı
    CONNECTIONS=$(docker exec emlakos-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | tr -d ' ')
    
    # Toplam bağlantı sayısı
    TOTAL_CONNECTIONS=$(docker exec emlakos-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ')
    
    # Veritabanı boyutu
    DB_SIZE=$(docker exec emlakos-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | tr -d ' ')
    
    # Cache hit ratio
    CACHE_HIT=$(docker exec emlakos-postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT round(100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2) FROM pg_stat_database WHERE datname = '$DB_NAME';" 2>/dev/null | tr -d ' ')
    
    echo -e "${BLUE}📈 Veritabanı İstatistikleri:${NC}"
    echo -e "  • Aktif Bağlantılar: ${GREEN}${CONNECTIONS}${NC}"
    echo -e "  • Toplam Bağlantılar: ${GREEN}${TOTAL_CONNECTIONS}${NC}"
    echo -e "  • Veritabanı Boyutu: ${GREEN}${DB_SIZE}${NC}"
    echo -e "  • Cache Hit Ratio: ${GREEN}${CACHE_HIT}%${NC}"
    
    log_message "Database Status - Active: $CONNECTIONS, Total: $TOTAL_CONNECTIONS, Size: $DB_SIZE, Cache Hit: $CACHE_HIT%"
}

# Güvenlik olaylarını kontrol et
check_security_events() {
    echo -e "${YELLOW}🔒 Güvenlik olayları kontrol ediliyor...${NC}"
    
    # Son 24 saatteki güvenlik olayları
    SECURITY_EVENTS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM emlakos.security_events WHERE created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    
    # Başarısız giriş denemeleri
    FAILED_LOGINS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM emlakos.security_events WHERE event_type = 'login_failed' AND created_at >= NOW() - INTERVAL '24 hours';" 2>/dev/null | tr -d ' ')
    
    # Kilitli hesaplar
    LOCKED_ACCOUNTS=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM emlakos.users WHERE locked_until > NOW();" 2>/dev/null | tr -d ' ')
    
    echo -e "${BLUE}🔐 Güvenlik İstatistikleri:${NC}"
    echo -e "  • Son 24 Saat Güvenlik Olayları: ${GREEN}${SECURITY_EVENTS}${NC}"
    echo -e "  • Başarısız Giriş Denemeleri: ${GREEN}${FAILED_LOGINS}${NC}"
    echo -e "  • Kilitli Hesaplar: ${GREEN}${LOCKED_ACCOUNTS}${NC}"
    
    log_message "Security Events - Total: $SECURITY_EVENTS, Failed Logins: $FAILED_LOGINS, Locked Accounts: $LOCKED_ACCOUNTS"
    
    # Uyarılar
    if [ "$FAILED_LOGINS" -gt 10 ]; then
        echo -e "${RED}⚠️  UYARI: Çok fazla başarısız giriş denemesi!${NC}"
        log_message "WARNING: High number of failed login attempts: $FAILED_LOGINS"
    fi
    
    if [ "$LOCKED_ACCOUNTS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  UYARI: Kilitli hesaplar mevcut!${NC}"
        log_message "WARNING: Locked accounts detected: $LOCKED_ACCOUNTS"
    fi
}

# Performans metriklerini kontrol et
check_performance_metrics() {
    echo -e "${YELLOW}⚡ Performans metrikleri kontrol ediliyor...${NC}"
    
    # Yavaş sorgular
    SLOW_QUERIES=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT count(*) FROM pg_stat_statements WHERE mean_time > 1000;" 2>/dev/null | tr -d ' ')
    
    # En yavaş sorgu
    SLOWEST_QUERY=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT query FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 1;" 2>/dev/null | tr -d ' ')
    
    # Disk kullanımı
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
    
    echo -e "${BLUE}⚡ Performans İstatistikleri:${NC}"
    echo -e "  • Yavaş Sorgular (>1s): ${GREEN}${SLOW_QUERIES}${NC}"
    echo -e "  • Disk Kullanımı: ${GREEN}${DISK_USAGE}%${NC}"
    
    log_message "Performance Metrics - Slow Queries: $SLOW_QUERIES, Disk Usage: $DISK_USAGE%"
    
    # Uyarılar
    if [ "$SLOW_QUERIES" -gt 5 ]; then
        echo -e "${RED}⚠️  UYARI: Çok fazla yavaş sorgu!${NC}"
        log_message "WARNING: High number of slow queries: $SLOW_QUERIES"
    fi
    
    if [ "$DISK_USAGE" -gt 80 ]; then
        echo -e "${RED}⚠️  UYARI: Disk kullanımı yüksek!${NC}"
        log_message "WARNING: High disk usage: $DISK_USAGE%"
    fi
}

# Backup durumunu kontrol et
check_backup_status() {
    echo -e "${YELLOW}💾 Backup durumu kontrol ediliyor...${NC}"
    
    # Son backup tarihi
    LAST_BACKUP=$(find database/backups -name "emlakos_backup_*.tar.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [ -n "$LAST_BACKUP" ]; then
        BACKUP_DATE=$(stat -c %y "$LAST_BACKUP" 2>/dev/null | cut -d' ' -f1)
        BACKUP_SIZE=$(du -h "$LAST_BACKUP" | cut -f1)
        
        echo -e "${BLUE}💾 Backup İstatistikleri:${NC}"
        echo -e "  • Son Backup: ${GREEN}${BACKUP_DATE}${NC}"
        echo -e "  • Backup Boyutu: ${GREEN}${BACKUP_SIZE}${NC}"
        
        log_message "Backup Status - Last: $BACKUP_DATE, Size: $BACKUP_SIZE"
    else
        echo -e "${RED}❌ Hiç backup bulunamadı!${NC}"
        log_message "WARNING: No backup found"
    fi
}

# Sistem kaynaklarını kontrol et
check_system_resources() {
    echo -e "${YELLOW}🖥️  Sistem kaynakları kontrol ediliyor...${NC}"
    
    # CPU kullanımı
    CPU_USAGE=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | tr -d '%')
    
    # Memory kullanımı
    MEMORY_USAGE=$(top -l 1 | grep "PhysMem" | awk '{print $2}' | tr -d 'M')
    
    # Disk kullanımı
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
    
    echo -e "${BLUE}🖥️  Sistem İstatistikleri:${NC}"
    echo -e "  • CPU Kullanımı: ${GREEN}${CPU_USAGE}%${NC}"
    echo -e "  • Memory Kullanımı: ${GREEN}${MEMORY_USAGE}MB${NC}"
    echo -e "  • Disk Kullanımı: ${GREEN}${DISK_USAGE}%${NC}"
    
    log_message "System Resources - CPU: $CPU_USAGE%, Memory: $MEMORY_USAGE MB, Disk: $DISK_USAGE%"
}

# Ana monitoring fonksiyonu
main() {
    echo -e "${BLUE}📊 EmlakOS Türkiye Veritabanı Monitoring${NC}"
    echo "=================================================="
    
    # Bağlantı testi
    if ! test_connection; then
        echo -e "${RED}❌ Veritabanı bağlantısı başarısız! Monitoring durduruluyor.${NC}"
        exit 1
    fi
    
    echo ""
    
    # Tüm kontrolleri çalıştır
    check_database_status
    echo ""
    
    check_security_events
    echo ""
    
    check_performance_metrics
    echo ""
    
    check_backup_status
    echo ""
    
    check_system_resources
    echo ""
    
    echo -e "${GREEN}🎉 Monitoring tamamlandı!${NC}"
    echo "=================================================="
    echo -e "${BLUE}📋 Özet:${NC}"
    echo -e "  • Log dosyası: ${GREEN}${LOG_FILE}${NC}"
    echo -e "  • Monitoring zamanı: ${GREEN}$(date)${NC}"
    echo ""
    echo -e "${YELLOW}💡 Otomatik monitoring için cron job ekleyin:${NC}"
    echo -e "  ${BLUE}*/5 * * * * /path/to/monitor-database.sh${NC}"
    echo ""
    echo -e "${GREEN}✨ Monitoring sistemi aktif!${NC}"
}

# Script'i çalıştır
main "$@"
