-- EmlakOS Türkiye - Kullanıcı Tabloları ve Güvenlik Şemaları
-- En güvenli ve hızlı yapılandırma

-- Audit tablosu (tüm değişiklikleri takip etmek için)
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit trigger fonksiyonu
CREATE OR REPLACE FUNCTION audit.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit.audit_log (table_name, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), current_setting('app.current_user_id', true)::UUID);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.audit_log (table_name, operation, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true)::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit.audit_log (table_name, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), current_setting('app.current_user_id', true)::UUID);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Kullanıcılar tablosu (Ana tablo)
CREATE TABLE IF NOT EXISTS emlakos.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    user_type VARCHAR(20) NOT NULL DEFAULT 'buyer' CHECK (user_type IN ('buyer', 'seller', 'agent', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Güvenlik indeksleri
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$'),
    CONSTRAINT users_name_length CHECK (length(first_name) >= 2 AND length(last_name) >= 2)
);

-- Kullanıcı profilleri tablosu
CREATE TABLE IF NOT EXISTS emlakos.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES emlakos.users(id) ON DELETE CASCADE,
    bio TEXT,
    experience_years INTEGER CHECK (experience_years >= 0),
    license_number VARCHAR(100), -- Emlak danışmanları için
    company_name VARCHAR(255),
    website VARCHAR(500),
    social_media JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    location_preferences JSONB DEFAULT '{}',
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    property_types JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcı oturumları tablosu
CREATE TABLE IF NOT EXISTS emlakos.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES emlakos.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Şifre sıfırlama tokenları
CREATE TABLE IF NOT EXISTS emlakos.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES emlakos.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email doğrulama tokenları
CREATE TABLE IF NOT EXISTS emlakos.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES emlakos.users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Telefon doğrulama kodları
CREATE TABLE IF NOT EXISTS emlakos.phone_verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES emlakos.users(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcı güvenlik olayları
CREATE TABLE IF NOT EXISTS emlakos.security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES emlakos.users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- login_success, login_failed, password_change, etc.
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performans için indeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON emlakos.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON emlakos.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON emlakos.users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON emlakos.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON emlakos.users(created_at);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON emlakos.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON emlakos.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON emlakos.user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON emlakos.user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON emlakos.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON emlakos.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON emlakos.password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON emlakos.email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token_hash ON emlakos.email_verification_tokens(token_hash);

CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_user_id ON emlakos.phone_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_phone ON emlakos.phone_verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_expires_at ON emlakos.phone_verification_codes(expires_at);

CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON emlakos.security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON emlakos.security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON emlakos.security_events(created_at);

-- Audit trigger'ları
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON emlakos.users
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

CREATE TRIGGER user_profiles_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON emlakos.user_profiles
    FOR EACH ROW EXECUTE FUNCTION audit.audit_trigger_function();

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated_at trigger'ları
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON emlakos.users
    FOR EACH ROW EXECUTE FUNCTION emlakos.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON emlakos.user_profiles
    FOR EACH ROW EXECUTE FUNCTION emlakos.update_updated_at_column();

-- İzinler
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA emlakos TO emlakos_app;
GRANT SELECT ON ALL TABLES IN SCHEMA emlakos TO emlakos_readonly;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA emlakos TO emlakos_app;

-- RLS (Row Level Security) politikaları
ALTER TABLE emlakos.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emlakos.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emlakos.user_sessions ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY users_own_data ON emlakos.users
    FOR ALL TO emlakos_app
    USING (id = current_setting('app.current_user_id', true)::UUID);

CREATE POLICY user_profiles_own_data ON emlakos.user_profiles
    FOR ALL TO emlakos_app
    USING (user_id = current_setting('app.current_user_id', true)::UUID);

CREATE POLICY user_sessions_own_data ON emlakos.user_sessions
    FOR ALL TO emlakos_app
    USING (user_id = current_setting('app.current_user_id', true)::UUID);
