# 🏠 EmlakOS Türkiye - Modern Gayrimenkul Platformu

Türkiye pazarı için tasarlanmış, yeni nesil gayrimenkul "super-app" platformu. Ev arama, kiralama, satın alma ve yönetim süreçlerini tek çatı altında toplayan, veri odaklı ve kullanıcı merkezli platform.

## ✨ Özellikler

- 🏡 **Gayrimenkul Arama**: Gelişmiş filtreleme ve arama özellikleri
- 🗺️ **Harita Tabanlı Arama**: OpenStreetMap + Leaflet entegrasyonu
- 💬 **Güvenli Mesajlaşma**: Signal Protocol ile end-to-end şifreleme
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- 🎨 **Modern UI/UX**: Tailwind CSS ve Framer Motion animasyonları
- 🔐 **Güvenlik**: JWT authentication ve KVKK uyumluluğu

## 🚀 Teknoloji Yığını

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Maps**: Leaflet, OpenStreetMap
- **State Management**: Zustand
- **Authentication**: JWT, TweetNaCl
- **Build Tool**: Next.js App Router

## 📋 Gereksinimler

- Node.js 18+ 
- npm veya yarn

## 🛠️ Kurulum

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/emlakos-turkiye.git
cd emlakos-turkiye/frontend/web-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📜 Kullanılabilir Scriptler

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucusu
- `npm run lint` - ESLint kontrolü
- `npm run type-check` - TypeScript tip kontrolü

## 🌐 Deployment

### GitHub Pages

1. **Repository'yi GitHub'a push edin:**
```bash
git remote add origin https://github.com/kullaniciadi/emlakos-turkiye.git
git branch -M main
git push -u origin main
```

2. **GitHub Pages'i etkinleştirin:**
   - Repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: main, folder: / (root)

3. **GitHub Actions ile otomatik deployment:**
   - `.github/workflows/deploy.yml` dosyası otomatik olarak çalışacak
   - Her push'ta otomatik olarak deploy edilecek

### Vercel (Önerilen)

1. **Vercel'e deploy edin:**
```bash
npm install -g vercel
vercel
```

2. **Veya GitHub entegrasyonu ile:**
   - Vercel Dashboard > New Project
   - GitHub repository'yi seçin
   - Otomatik deployment

## 🏗️ Proje Yapısı

```
web-app/
├── app/                    # Next.js App Router
│   ├── giris/            # Giriş sayfası
│   ├── kayit/            # Kayıt sayfası
│   ├── ilanlar/          # İlan listesi
│   ├── ilan/[id]/        # İlan detay
│   ├── harita/           # Harita görünümü
│   ├── panel/            # Kullanıcı paneli
│   └── mesajlar/         # Mesajlaşma
├── components/            # React bileşenleri
│   ├── map/              # Harita bileşenleri
│   ├── messaging/        # Mesajlaşma bileşenleri
│   └── ui/               # UI bileşenleri
├── styles/               # CSS dosyaları
├── types/                # TypeScript tip tanımları
└── public/               # Statik dosyalar
```

## 🔧 Konfigürasyon

### Environment Variables

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Next.js Config

`next.config.js` dosyasında:

```javascript
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/emlakos-turkiye' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/emlakos-turkiye' : '',
}
```

## 📱 Responsive Tasarım

- **Mobile First**: Mobil cihazlar için optimize edilmiş
- **Breakpoints**: Tailwind CSS responsive breakpoint'leri
- **Touch Friendly**: Dokunmatik cihazlar için optimize edilmiş

## 🔐 Güvenlik

- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Signal Protocol**: End-to-end şifreli mesajlaşma
- **HTTPS**: Tüm iletişim şifreli
- **KVKK Uyumlu**: Türkiye veri koruma kanunu uyumlu

## 🧪 Test

```bash
# TypeScript tip kontrolü
npm run type-check

# ESLint kontrolü
npm run lint

# Build test
npm run build
```

## 📈 Performance

- **Code Splitting**: Otomatik sayfa bazlı kod bölme
- **Image Optimization**: Next.js Image bileşeni
- **Lazy Loading**: Görünür olmayan bileşenler için lazy loading
- **Bundle Analysis**: Webpack bundle analizi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje**: [EmlakOS Türkiye](https://github.com/kullaniciadi/emlakos-turkiye)
- **E-posta**: info@emlakos-turkiye.com
- **Website**: https://emlakos-turkiye.com

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animasyon kütüphanesi
- [Leaflet](https://leafletjs.com/) - Harita kütüphanesi
- [OpenStreetMap](https://www.openstreetmap.org/) - Açık kaynak harita verisi

---

**EmlakOS Türkiye** - Türkiye'nin en modern gayrimenkul platformu 🏠✨
