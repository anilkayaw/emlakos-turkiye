-- EmlakOS Türkiye Veritabanı Başlatma Scripti
-- PostgreSQL + PostGIS

-- PostGIS eklentisini etkinleştir
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- UUID eklentisini etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Kullanıcılar tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('kiracı', 'mülk_sahibi', 'emlak_danışmanı')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    profile_picture_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mülkler tablosu
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    coordinates GEOGRAPHY(POINT, 4326),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('daire', 'villa', 'dükkan', 'ofis', 'arsa')),
    status VARCHAR(20) NOT NULL DEFAULT 'satılık' CHECK (status IN ('satılık', 'kiralık', 'satıldı', 'kiralandı')),
    price_tl DECIMAL(15,2) NOT NULL,
    sq_meters DECIMAL(8,2) NOT NULL,
    room_count INTEGER,
    building_age INTEGER,
    floor INTEGER,
    total_floors INTEGER,
    heating_type VARCHAR(50),
    has_parking BOOLEAN DEFAULT FALSE,
    has_balcony BOOLEAN DEFAULT FALSE,
    is_furnished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mülk resimleri tablosu
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kira sözleşmeleri tablosu
CREATE TABLE rent_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent_tl DECIMAL(10,2) NOT NULL,
    deposit_tl DECIMAL(10,2) NOT NULL,
    contract_document_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'sona_erdi', 'iptal_edildi')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Favoriler tablosu
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Arama geçmişi tablosu
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    filters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Değerleme geçmişi tablosu
CREATE TABLE valuation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    estimated_price_tl DECIMAL(15,2) NOT NULL,
    valuation_factors JSONB NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İletişim mesajları tablosu
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price_tl);
CREATE INDEX idx_properties_coordinates ON properties USING GIST(coordinates);
CREATE INDEX idx_properties_created_at ON properties(created_at);

CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_property_images_is_primary ON property_images(is_primary);

CREATE INDEX idx_rent_contracts_property_id ON rent_contracts(property_id);
CREATE INDEX idx_rent_contracts_landlord_id ON rent_contracts(landlord_id);
CREATE INDEX idx_rent_contracts_tenant_id ON rent_contracts(tenant_id);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

CREATE INDEX idx_contact_messages_from_user_id ON contact_messages(from_user_id);
CREATE INDEX idx_contact_messages_to_user_id ON contact_messages(to_user_id);
CREATE INDEX idx_contact_messages_property_id ON contact_messages(property_id);

-- Trigger fonksiyonu - updated_at alanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rent_contracts_updated_at BEFORE UPDATE ON rent_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veri ekle (geliştirme ortamı için)
INSERT INTO users (id, user_type, name, email, password_hash, phone_number) VALUES
    (uuid_generate_v4(), 'mülk_sahibi', 'Ahmet Yılmaz', 'ahmet@example.com', '$2a$10$hashedpassword', '+90 555 123 4567'),
    (uuid_generate_v4(), 'kiracı', 'Ayşe Demir', 'ayse@example.com', '$2a$10$hashedpassword', '+90 555 987 6543'),
    (uuid_generate_v4(), 'emlak_danışmanı', 'Mehmet Kaya', 'mehmet@example.com', '$2a$10$hashedpassword', '+90 555 456 7890');

-- Veritabanı oluşturuldu mesajı
SELECT 'EmlakOS Türkiye veritabanı başarıyla oluşturuldu!' as message;
