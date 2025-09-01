-- EmlakOS Türkiye - Güvenli Veritabanı Şeması
-- PostgreSQL + PostGIS
-- En güvenli ve hızlı konfigürasyon

-- PostGIS eklentilerini etkinleştir
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- UUID eklentisini etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Şifreleme eklentileri
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Full-text search eklentisi
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Performans için indeksler
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Güvenlik için RLS (Row Level Security) etkinleştir
ALTER DATABASE emlakos_turkiye SET row_security = on;

-- Kullanıcı rolleri oluştur
DO $$
BEGIN
    -- Uygulama kullanıcısı
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'emlakos_app') THEN
        CREATE ROLE emlakos_app WITH LOGIN PASSWORD 'EmlakOS2024!AppPass';
    END IF;
    
    -- Read-only kullanıcı
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'emlakos_readonly') THEN
        CREATE ROLE emlakos_readonly WITH LOGIN PASSWORD 'EmlakOS2024!ReadOnly';
    END IF;
    
    -- Backup kullanıcısı
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'emlakos_backup') THEN
        CREATE ROLE emlakos_backup WITH LOGIN PASSWORD 'EmlakOS2024!Backup';
    END IF;
END
$$;

-- Veritabanı izinleri
GRANT CONNECT ON DATABASE emlakos_turkiye TO emlakos_app;
GRANT CONNECT ON DATABASE emlakos_turkiye TO emlakos_readonly;
GRANT CONNECT ON DATABASE emlakos_turkiye TO emlakos_backup;

-- Schema oluştur
CREATE SCHEMA IF NOT EXISTS emlakos;
GRANT USAGE ON SCHEMA emlakos TO emlakos_app;
GRANT USAGE ON SCHEMA emlakos TO emlakos_readonly;

-- Audit schema
CREATE SCHEMA IF NOT EXISTS audit;
GRANT USAGE ON SCHEMA audit TO emlakos_app;
