-- EmlakOS Türkiye - Güvenlik Konfigürasyonları
-- En güvenli ve kapsamlı güvenlik ayarları

-- Güvenlik fonksiyonları
CREATE OR REPLACE FUNCTION emlakos.generate_secure_token(length INTEGER DEFAULT 32)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Password validation fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.validate_password(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- En az 8 karakter
    IF length(password) < 8 THEN
        RETURN FALSE;
    END IF;
    
    -- En az 1 büyük harf
    IF password !~ '[A-Z]' THEN
        RETURN FALSE;
    END IF;
    
    -- En az 1 küçük harf
    IF password !~ '[a-z]' THEN
        RETURN FALSE;
    END IF;
    
    -- En az 1 rakam
    IF password !~ '[0-9]' THEN
        RETURN FALSE;
    END IF;
    
    -- En az 1 özel karakter
    IF password !~ '[!@#$%^&*(),.?":{}|<>]' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Email validation fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phone validation fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.validate_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Türkiye telefon numarası formatı
    RETURN phone ~* '^(\+90|0)?[5][0-9]{9}$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Güvenli password hash fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.hash_password(password TEXT, salt TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(password || salt, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Session cleanup fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM emlakos.user_sessions 
    WHERE expires_at < NOW() OR is_active = FALSE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Token cleanup fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Expired password reset tokens
    DELETE FROM emlakos.password_reset_tokens 
    WHERE expires_at < NOW() OR used_at IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Expired email verification tokens
    DELETE FROM emlakos.email_verification_tokens 
    WHERE expires_at < NOW() OR verified_at IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    -- Expired phone verification codes
    DELETE FROM emlakos.phone_verification_codes 
    WHERE expires_at < NOW() OR verified_at IS NOT NULL;
    
    GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Brute force protection fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.check_brute_force_protection(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    failed_attempts INTEGER;
    locked_until TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT failed_login_attempts, locked_until 
    INTO failed_attempts, locked_until
    FROM emlakos.users 
    WHERE email = user_email;
    
    -- Hesap kilitli mi?
    IF locked_until IS NOT NULL AND locked_until > NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Çok fazla başarısız deneme var mı?
    IF failed_attempts >= 5 THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Güvenlik event logging fonksiyonu
CREATE OR REPLACE FUNCTION emlakos.log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO emlakos.security_events (
        user_id, event_type, ip_address, user_agent, details
    ) VALUES (
        p_user_id, p_event_type, p_ip_address, p_user_agent, p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otomatik cleanup job'ları için fonksiyonlar
CREATE OR REPLACE FUNCTION emlakos.daily_cleanup()
RETURNS VOID AS $$
DECLARE
    sessions_cleaned INTEGER;
    tokens_cleaned INTEGER;
BEGIN
    -- Expired session'ları temizle
    SELECT emlakos.cleanup_expired_sessions() INTO sessions_cleaned;
    
    -- Expired token'ları temizle
    SELECT emlakos.cleanup_expired_tokens() INTO tokens_cleaned;
    
    -- Log the cleanup
    INSERT INTO emlakos.security_events (event_type, details)
    VALUES ('daily_cleanup', jsonb_build_object(
        'sessions_cleaned', sessions_cleaned,
        'tokens_cleaned', tokens_cleaned,
        'cleanup_time', NOW()
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Güvenlik view'ları
CREATE OR REPLACE VIEW emlakos.user_security_summary AS
SELECT 
    u.id,
    u.email,
    u.is_verified,
    u.is_active,
    u.failed_login_attempts,
    u.locked_until,
    u.last_login_at,
    COUNT(s.id) as active_sessions,
    MAX(s.last_used_at) as last_session_activity
FROM emlakos.users u
LEFT JOIN emlakos.user_sessions s ON u.id = s.user_id AND s.is_active = TRUE
GROUP BY u.id, u.email, u.is_verified, u.is_active, 
         u.failed_login_attempts, u.locked_until, u.last_login_at;

-- Güvenlik istatistikleri view'ı
CREATE OR REPLACE VIEW emlakos.security_stats AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT ip_address) as unique_ips
FROM emlakos.security_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, event_count DESC;

-- Güvenlik indeksleri
CREATE INDEX IF NOT EXISTS idx_security_events_date_type ON emlakos.security_events(created_at, event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON emlakos.security_events(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_user_date ON emlakos.security_events(user_id, created_at);

-- Güvenlik constraint'leri
ALTER TABLE emlakos.users 
ADD CONSTRAINT users_password_length CHECK (length(password_hash) = 60),
ADD CONSTRAINT users_salt_length CHECK (length(salt) = 64);

-- Güvenlik trigger'ları
CREATE OR REPLACE FUNCTION emlakos.security_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Login attempt logging
    IF TG_OP = 'UPDATE' AND OLD.failed_login_attempts != NEW.failed_login_attempts THEN
        PERFORM emlakos.log_security_event(
            NEW.id,
            'login_attempt',
            NULL,
            NULL,
            jsonb_build_object(
                'failed_attempts', NEW.failed_login_attempts,
                'locked_until', NEW.locked_until
            )
        );
    END IF;
    
    -- Account lockout logging
    IF TG_OP = 'UPDATE' AND OLD.locked_until IS NULL AND NEW.locked_until IS NOT NULL THEN
        PERFORM emlakos.log_security_event(
            NEW.id,
            'account_locked',
            NULL,
            NULL,
            jsonb_build_object(
                'locked_until', NEW.locked_until,
                'failed_attempts', NEW.failed_login_attempts
            )
        );
    END IF;
    
    -- Account unlock logging
    IF TG_OP = 'UPDATE' AND OLD.locked_until IS NOT NULL AND NEW.locked_until IS NULL THEN
        PERFORM emlakos.log_security_event(
            NEW.id,
            'account_unlocked',
            NULL,
            NULL,
            jsonb_build_object(
                'failed_attempts', NEW.failed_login_attempts
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security audit trigger'ı ekle
DROP TRIGGER IF EXISTS users_security_audit_trigger ON emlakos.users;
CREATE TRIGGER users_security_audit_trigger
    AFTER UPDATE ON emlakos.users
    FOR EACH ROW EXECUTE FUNCTION emlakos.security_audit_trigger();

-- Güvenlik fonksiyonları için izinler
GRANT EXECUTE ON FUNCTION emlakos.generate_secure_token(INTEGER) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.validate_password(TEXT) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.validate_email(TEXT) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.validate_phone(TEXT) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.hash_password(TEXT, TEXT) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.cleanup_expired_sessions() TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.cleanup_expired_tokens() TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.check_brute_force_protection(TEXT) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.log_security_event(UUID, TEXT, INET, TEXT, JSONB) TO emlakos_app;
GRANT EXECUTE ON FUNCTION emlakos.daily_cleanup() TO emlakos_app;

-- View'lar için izinler
GRANT SELECT ON emlakos.user_security_summary TO emlakos_app;
GRANT SELECT ON emlakos.security_stats TO emlakos_app;

-- Güvenlik konfigürasyonu tamamlandı
INSERT INTO emlakos.security_events (event_type, details)
VALUES ('security_config_completed', jsonb_build_object(
    'config_time', NOW(),
    'version', '1.0.0',
    'features', jsonb_build_array(
        'password_validation',
        'email_validation',
        'phone_validation',
        'brute_force_protection',
        'session_management',
        'token_management',
        'audit_logging',
        'security_monitoring'
    )
));
