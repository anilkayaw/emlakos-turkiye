#!/bin/bash

# EmlakOS Türkiye - SSL Sertifika Oluşturma Scripti
# En güvenli SSL sertifikaları

set -e

echo "🔐 EmlakOS Türkiye SSL Sertifikaları Oluşturuluyor..."
echo "=================================================="

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# SSL dizinini oluştur
mkdir -p database/ssl/certs
mkdir -p database/ssl/private
mkdir -p database/ssl/ca

# İzinleri ayarla
chmod 700 database/ssl/private
chmod 700 database/ssl/ca

echo -e "${YELLOW}📁 SSL dizinleri oluşturuldu${NC}"

# CA Private Key oluştur
echo -e "${YELLOW}🔑 CA Private Key oluşturuluyor...${NC}"
openssl genrsa -out database/ssl/ca/ca-key.pem 4096
chmod 600 database/ssl/ca/ca-key.pem

# CA Certificate oluştur
echo -e "${YELLOW}📜 CA Certificate oluşturuluyor...${NC}"
openssl req -new -x509 -days 3650 -key database/ssl/ca/ca-key.pem -out database/ssl/ca/ca-cert.pem -config database/ssl/openssl.conf -extensions v3_ca

# Server Private Key oluştur
echo -e "${YELLOW}🔑 Server Private Key oluşturuluyor...${NC}"
openssl genrsa -out database/ssl/private/server-key.pem 4096
chmod 600 database/ssl/private/server-key.pem

# Server Certificate Signing Request oluştur
echo -e "${YELLOW}📝 Server CSR oluşturuluyor...${NC}"
openssl req -new -key database/ssl/private/server-key.pem -out database/ssl/certs/server.csr -config database/ssl/openssl.conf

# Server Certificate oluştur
echo -e "${YELLOW}📜 Server Certificate oluşturuluyor...${NC}"
openssl x509 -req -in database/ssl/certs/server.csr -CA database/ssl/ca/ca-cert.pem -CAkey database/ssl/ca/ca-key.pem -CAcreateserial -out database/ssl/certs/server-cert.pem -days 365 -extensions v3_req -extfile database/ssl/openssl.conf

# Client Private Key oluştur
echo -e "${YELLOW}🔑 Client Private Key oluşturuluyor...${NC}"
openssl genrsa -out database/ssl/private/client-key.pem 4096
chmod 600 database/ssl/private/client-key.pem

# Client Certificate Signing Request oluştur
echo -e "${YELLOW}📝 Client CSR oluşturuluyor...${NC}"
openssl req -new -key database/ssl/private/client-key.pem -out database/ssl/certs/client.csr -config database/ssl/openssl.conf

# Client Certificate oluştur
echo -e "${YELLOW}📜 Client Certificate oluşturuluyor...${NC}"
openssl x509 -req -in database/ssl/certs/client.csr -CA database/ssl/ca/ca-cert.pem -CAkey database/ssl/ca/ca-key.pem -CAcreateserial -out database/ssl/certs/client-cert.pem -days 365 -extensions v3_req -extfile database/ssl/openssl.conf

# Certificate Bundle oluştur
echo -e "${YELLOW}📦 Certificate Bundle oluşturuluyor...${NC}"
cat database/ssl/certs/server-cert.pem database/ssl/ca/ca-cert.pem > database/ssl/certs/server-bundle.pem

# Geçici dosyaları temizle
rm database/ssl/certs/server.csr
rm database/ssl/certs/client.csr

# Sertifika bilgilerini göster
echo ""
echo -e "${GREEN}✅ SSL Sertifikaları başarıyla oluşturuldu!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📊 Sertifika Bilgileri:${NC}"
echo -e "  • CA Certificate: ${GREEN}database/ssl/ca/ca-cert.pem${NC}"
echo -e "  • Server Certificate: ${GREEN}database/ssl/certs/server-cert.pem${NC}"
echo -e "  • Server Private Key: ${GREEN}database/ssl/private/server-key.pem${NC}"
echo -e "  • Client Certificate: ${GREEN}database/ssl/certs/client-cert.pem${NC}"
echo -e "  • Client Private Key: ${GREEN}database/ssl/private/client-key.pem${NC}"
echo ""
echo -e "${BLUE}🔍 Sertifika Detayları:${NC}"
openssl x509 -in database/ssl/certs/server-cert.pem -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:|DNS:|IP Address:)"
echo ""
echo -e "${YELLOW}💡 Sonraki Adımlar:${NC}"
echo -e "  1. Veritabanını SSL ile başlatın"
echo -e "  2. Client sertifikalarını uygulamalara yükleyin"
echo -e "  3. SSL bağlantılarını test edin"
echo ""
echo -e "${GREEN}🔐 SSL güvenliği aktif!${NC}"
