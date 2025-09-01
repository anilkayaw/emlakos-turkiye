-- EmlakOS Türkiye Database Schema
-- PostgreSQL

-- Enable PostGIS extension for location-based queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    user_type VARCHAR(20) NOT NULL DEFAULT 'buyer', -- buyer, seller, agent, admin
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER,
    license_number VARCHAR(100), -- For real estate agents
    company_name VARCHAR(255),
    website VARCHAR(500),
    social_media JSONB,
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property categories
CREATE TABLE property_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- Property types
CREATE TABLE property_types (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES property_categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Cities and districts
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(city_id, slug)
);

-- Neighborhoods
CREATE TABLE neighborhoods (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(district_id, slug)
);

-- Property listings
CREATE TABLE property_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES users(id), -- Can be NULL if owner is selling directly
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type_id INTEGER REFERENCES property_types(id),
    transaction_type VARCHAR(20) NOT NULL, -- sale, rent, daily_rent
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    price_per_sqm DECIMAL(10, 2),
    
    -- Location
    city_id INTEGER REFERENCES cities(id),
    district_id INTEGER REFERENCES districts(id),
    neighborhood_id INTEGER REFERENCES neighborhoods(id),
    address TEXT,
    location GEOMETRY(POINT, 4326), -- PostGIS point for coordinates
    
    -- Property details
    total_area DECIMAL(8, 2), -- m²
    living_area DECIMAL(8, 2), -- m²
    land_area DECIMAL(10, 2), -- m² for land properties
    rooms INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    floors INTEGER,
    floor_number INTEGER,
    building_age INTEGER,
    
    -- Features
    features JSONB, -- Array of feature strings
    amenities JSONB, -- Array of amenity strings
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, pending, sold, rented, inactive
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property images
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property features
CREATE TABLE property_features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- interior, exterior, security, etc.
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- Property amenities
CREATE TABLE property_amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- transportation, shopping, education, etc.
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- Property feature mappings
CREATE TABLE property_feature_mappings (
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES property_features(id),
    PRIMARY KEY (property_id, feature_id)
);

-- Property amenity mappings
CREATE TABLE property_amenity_mappings (
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES property_amenities(id),
    PRIMARY KEY (property_id, amenity_id)
);

-- Favorites
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- Search history
CREATE TABLE user_search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property views tracking
CREATE TABLE property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- Can be NULL for anonymous views
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact requests
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES property_listings(id) ON DELETE CASCADE,
    requester_id UUID REFERENCES users(id),
    requester_name VARCHAR(200) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(20),
    message TEXT,
    request_type VARCHAR(20) DEFAULT 'inquiry', -- inquiry, viewing, offer
    status VARCHAR(20) DEFAULT 'pending', -- pending, responded, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50), -- message, favorite, view, etc.
    related_id UUID, -- ID of related entity (property, message, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL, -- page_view, search, contact, etc.
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES user_sessions(id),
    property_id UUID REFERENCES property_listings(id),
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_property_listings_status ON property_listings(status);
CREATE INDEX idx_property_listings_location ON property_listings USING GIST(location);
CREATE INDEX idx_property_listings_price ON property_listings(price);
CREATE INDEX idx_property_listings_created_at ON property_listings(created_at);
CREATE INDEX idx_property_listings_owner_id ON property_listings(owner_id);
CREATE INDEX idx_property_listings_city_district ON property_listings(city_id, district_id);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON user_favorites(property_id);

CREATE INDEX idx_property_views_property_id ON property_views(property_id);
CREATE INDEX idx_property_views_created_at ON property_views(created_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_listings_updated_at BEFORE UPDATE ON property_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO property_categories (name, slug, description) VALUES
('Konut', 'konut', 'Ev, daire, villa gibi konut türleri'),
('İş Yeri', 'is-yeri', 'Ofis, dükkan, depo gibi ticari gayrimenkuller'),
('Arsa', 'arsa', 'Yapılaşmaya uygun arsalar'),
('Proje', 'proje', 'Yeni yapım projeleri');

INSERT INTO property_types (category_id, name, slug, description) VALUES
(1, 'Daire', 'daire', 'Apartman dairesi'),
(1, 'Villa', 'villa', 'Müstakil villa'),
(1, 'Müstakil Ev', 'mustakil-ev', 'Tek katlı müstakil ev'),
(2, 'Ofis', 'ofis', 'Ofis alanı'),
(2, 'Dükkan', 'dukkan', 'Ticari dükkan'),
(3, 'Konut Arsa', 'konut-arsa', 'Konut yapımına uygun arsa'),
(4, 'Konut Projesi', 'konut-projesi', 'Yeni konut projesi');

INSERT INTO cities (name, slug, latitude, longitude) VALUES
('İstanbul', 'istanbul', 41.0082, 28.9784),
('Ankara', 'ankara', 39.9334, 32.8597),
('İzmir', 'izmir', 38.4192, 27.1287),
('Bursa', 'bursa', 40.1885, 29.0610),
('Antalya', 'antalya', 36.8969, 30.7133);

-- Sample districts for Istanbul
INSERT INTO districts (city_id, name, slug, latitude, longitude) VALUES
(1, 'Beşiktaş', 'besiktas', 41.0422, 29.0083),
(1, 'Kadıköy', 'kadikoy', 40.9909, 29.0303),
(1, 'Şişli', 'sisli', 41.0602, 28.9877),
(1, 'Sarıyer', 'sariyer', 41.1667, 29.0500);

-- Sample neighborhoods
INSERT INTO neighborhoods (district_id, name, slug, latitude, longitude) VALUES
(1, 'Levent', 'levent', 41.0789, 29.0167),
(1, 'Etiler', 'etiler', 41.0819, 29.0333),
(2, 'Moda', 'moda', 40.9878, 29.0278),
(2, 'Fenerbahçe', 'fenerbahce', 40.9889, 29.0367);

-- Sample features
INSERT INTO property_features (name, category, icon) VALUES
('Asansör', 'interior', 'elevator'),
('Otopark', 'exterior', 'parking'),
('Güvenlik', 'security', 'security'),
('Merkezi Isıtma', 'interior', 'heating'),
('Havuz', 'exterior', 'pool'),
('Bahçe', 'exterior', 'garden'),
('Balkon', 'interior', 'balcony'),
('Eşyalı', 'interior', 'furniture');

-- Sample amenities
INSERT INTO property_amenities (name, category, icon) VALUES
('Metro', 'transportation', 'subway'),
('Otobüs Durağı', 'transportation', 'bus'),
('Market', 'shopping', 'shopping-cart'),
('Okul', 'education', 'school'),
('Hastane', 'health', 'hospital'),
('Park', 'recreation', 'tree'),
('Restoran', 'food', 'utensils'),
('Spor Salonu', 'recreation', 'dumbbell');
