# 🚀 Gerçek Çalışan Sistem Kurulumu

## 📧 Email Servisi (Resend)

### 1. Resend Hesabı Oluşturun
- [resend.com](https://resend.com) adresine gidin
- Ücretsiz hesap oluşturun
- API key'inizi alın

### 2. Environment Variables
`.env.local` dosyası oluşturun:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 3. Domain Doğrulama
- Resend dashboard'da domain'inizi doğrulayın
- DNS kayıtlarını ekleyin

## 🔐 Google OAuth

### 1. Google Cloud Console
- [console.cloud.google.com](https://console.cloud.google.com) gidin
- Yeni proje oluşturun
- "APIs & Services" > "Credentials" bölümüne gidin

### 2. OAuth 2.0 Client ID
- "Create Credentials" > "OAuth 2.0 Client ID"
- Application type: "Web application"
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://yourdomain.com/api/auth/callback/google`

### 3. Environment Variables
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📘 Facebook OAuth

### 1. Facebook Developers
- [developers.facebook.com](https://developers.facebook.com) gidin
- Yeni uygulama oluşturun
- "Facebook Login" ürününü ekleyin

### 2. OAuth Redirect URIs
- Valid OAuth Redirect URIs:
  - `http://localhost:3000/api/auth/callback/facebook`
  - `https://yourdomain.com/api/auth/callback/facebook`

### 3. Environment Variables
```bash
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
```

## 🍎 Apple OAuth (Opsiyonel)

### 1. Apple Developer
- [developer.apple.com](https://developer.apple.com) gidin
- Apple ID ile giriş yapın
- "Certificates, Identifiers & Profiles" bölümüne gidin

### 2. Services ID
- "Identifiers" > "Services IDs" > "+"
- Description: "Emlakos Türkiye"
- Identifier: `com.emlakos.turkiye`
- "Sign In with Apple" seçeneğini etkinleştirin

## 🗄️ Veritabanı (PostgreSQL)

### 1. PostgreSQL Kurulumu
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Veritabanı Oluşturma
```sql
CREATE DATABASE emlakos_db;
CREATE USER emlakos_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE emlakos_db TO emlakos_user;
```

### 3. Environment Variables
```bash
DATABASE_URL=postgresql://emlakos_user:your_password@localhost:5432/emlakos_db
```

## 🔑 NextAuth Secret

### 1. Secret Oluşturma
```bash
openssl rand -base64 32
```

### 2. Environment Variables
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

## 🚀 Kurulum Adımları

### 1. Environment Dosyası
```bash
cp .env.example .env.local
# .env.local dosyasını düzenleyin
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Veritabanı Migrasyonları
```bash
# Prisma kullanıyorsanız
npx prisma migrate dev
npx prisma generate
```

### 4. Development Server
```bash
npm run dev
```

## ✅ Test Etme

### 1. Email Doğrulama
- Kayıt sayfasında gerçek email adresi girin
- Email'inizi kontrol edin
- Doğrulama kodunu girin

### 2. Google Girişi
- "Google ile Devam Et" butonuna tıklayın
- Google hesabınızla giriş yapın
- Panel sayfasına yönlendirileceksiniz

### 3. Facebook Girişi
- "Facebook ile Devam Et" butonuna tıklayın
- Facebook hesabınızla giriş yapın
- Panel sayfasına yönlendirileceksiniz

## 🔧 Sorun Giderme

### Email Gönderilmiyor
- Resend API key'inizi kontrol edin
- Domain doğrulamasını tamamlayın
- Spam klasörünü kontrol edin

### OAuth Hataları
- Redirect URI'lerin doğru olduğundan emin olun
- Client ID ve Secret'ları kontrol edin
- Domain'in production'da HTTPS olduğundan emin olun

### Veritabanı Bağlantısı
- PostgreSQL servisinin çalıştığından emin olun
- Connection string'i kontrol edin
- Kullanıcı izinlerini kontrol edin

## 📝 Notlar

- Development'ta `http://localhost:3000` kullanın
- Production'da HTTPS zorunludur
- Tüm API key'leri güvenli tutun
- Environment variables'ları `.gitignore`'a ekleyin
