# EmlakOS Türkiye 🏠🇹🇷

Türkiye'nin gayrimenkul piyasası için merkezi "işletim sistemi" - ev arama, kiralama, satın alma, satma ve yönetme süreçlerinin tamamını tek bir çatı altında toplayan platform.

## 🎯 Proje Vizyonu

EmlakOS Türkiye, parçalı ve verimsiz gayrimenkul piyasası için veri odaklı, kullanıcı merkezli ve Türkiye'nin yasal düzenlemeleriyle tam uyumlu merkezi bir platform oluşturmayı hedeflemektedir.

## 🏗️ Mimari

- **Mikroservis Mimarisi** ile ölçeklenebilir yapı
- **Go (Golang)** ile yüksek performanslı backend servisleri
- **Python** ile AI/ML tabanlı değerleme servisleri
- **Next.js + TypeScript** ile modern frontend
- **PostgreSQL + PostGIS** ile konum tabanlı veri yönetimi
- **Docker + Kubernetes** ile konteyner orkestrasyonu

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Docker & Docker Compose
- Go 1.21+
- Node.js 18+
- Python 3.11+

### Geliştirme Ortamı Kurulumu
```bash
# Projeyi klonla
git clone <repository-url>
cd emlakos-turkiye

# Geliştirme ortamını başlat
docker-compose up -d

# Frontend geliştirme sunucusunu başlat
cd frontend/web-app
npm install
npm run dev
```

## 📁 Proje Yapısı

```
emlakos-turkiye/
├── services/                 # Mikroservisler
│   ├── api-gateway/         # API Gateway (Go)
│   ├── user-service/        # Kullanıcı Yönetimi (Go)
│   ├── listing-service/     # İlan Yönetimi (Go)
│   ├── valuation-service/   # Değerleme AI (Python)
│   └── notification-service/ # Bildirim Servisi (Go)
├── frontend/                 # Web Uygulaması
│   └── web-app/             # Next.js + TypeScript
├── infrastructure/           # DevOps ve Deployment
│   ├── docker/              # Docker konfigürasyonları
│   └── k8s/                 # Kubernetes manifestleri
├── docs/                    # API Dokümantasyonu
└── scripts/                 # Yardımcı scriptler
```

## 🔧 Teknoloji Yığını

### Backend
- **Go (Golang)** - Ana API servisleri
- **Python (FastAPI)** - AI/ML servisleri
- **PostgreSQL + PostGIS** - Ana veritabanı
- **Redis** - Önbellekleme
- **Elasticsearch** - Arama motoru
- **Apache Kafka** - Asenkron iletişim

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil framework
- **Mapbox/Google Maps** - Harita entegrasyonu

### DevOps
- **Docker** - Konteynerizasyon
- **Kubernetes** - Orchestration
- **GitHub Actions** - CI/CD

## 📚 API Dokümantasyonu

API dokümantasyonu için `/docs` klasörüne bakın veya geliştirme ortamında `http://localhost:8080/docs` adresini ziyaret edin.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Lideri:** [İsim]
- **Email:** [email]
- **Website:** [website]

---

**EmlakOS Türkiye** - Türkiye'nin Gayrimenkul Geleceği 🚀
