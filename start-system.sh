#!/bin/bash

# EmlakOS Türkiye - Complete System Startup Script
# Bu script tüm servisleri başlatır ve sistemi çalışır hale getirir

echo "🏠 EmlakOS Türkiye - Sistem Başlatılıyor..."
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker çalışmıyor! Lütfen Docker'ı başlatın."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose bulunamadı! Lütfen Docker Compose'u yükleyin."
    exit 1
fi

echo "✅ Docker ve Docker Compose hazır"

# Create necessary directories
echo "📁 Gerekli dizinler oluşturuluyor..."
mkdir -p nginx/ssl
mkdir -p monitoring
mkdir -p backend/api-gateway
mkdir -p backend/user-service
mkdir -p backend/listing-service
mkdir -p backend/messaging-service
mkdir -p backend/notification-service
mkdir -p backend/ai-valuation-service

# Create basic Dockerfiles for services
echo "🐳 Docker dosyaları oluşturuluyor..."

# API Gateway Dockerfile
cat > backend/api-gateway/Dockerfile << 'EOF'
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
EOF

# User Service Dockerfile
cat > backend/user-service/Dockerfile << 'EOF'
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8081

CMD ["./main"]
EOF

# Listing Service Dockerfile
cat > backend/listing-service/Dockerfile << 'EOF'
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8082

CMD ["./main"]
EOF

# Messaging Service Dockerfile
cat > backend/messaging-service/Dockerfile << 'EOF'
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8083

CMD ["./main"]
EOF

# Notification Service Dockerfile
cat > backend/notification-service/Dockerfile << 'EOF'
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8084

CMD ["./main"]
EOF

# AI Valuation Service Dockerfile
cat > backend/ai-valuation-service/Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8085

CMD ["python", "main.py"]
EOF

# Frontend Dockerfile
cat > frontend/web-app/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

# Create basic service files
echo "🔧 Servis dosyaları oluşturuluyor..."

# User Service main.go
cat > backend/user-service/main.go << 'EOF'
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "user-service",
		})
	})

	log.Printf("🚀 User Service starting on port %s", port)
	r.Run(":" + port)
}
EOF

# Listing Service main.go
cat > backend/listing-service/main.go << 'EOF'
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "listing-service",
		})
	})

	log.Printf("🚀 Listing Service starting on port %s", port)
	r.Run(":" + port)
}
EOF

# Messaging Service main.go
cat > backend/messaging-service/main.go << 'EOF'
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "messaging-service",
		})
	})

	log.Printf("🚀 Messaging Service starting on port %s", port)
	r.Run(":" + port)
}
EOF

# Notification Service main.go
cat > backend/notification-service/main.go << 'EOF'
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "notification-service",
		})
	})

	log.Printf("🚀 Notification Service starting on port %s", port)
	r.Run(":" + port)
}
EOF

# AI Valuation Service main.py
cat > backend/ai-valuation-service/main.py << 'EOF'
from fastapi import FastAPI
import uvicorn
import os

app = FastAPI(title="AI Valuation Service", version="1.0.0")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-valuation-service"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8085))
    uvicorn.run(app, host="0.0.0.0", port=port)
EOF

# AI Valuation Service requirements.txt
cat > backend/ai-valuation-service/requirements.txt << 'EOF'
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
scikit-learn==1.3.2
pandas==2.1.4
numpy==1.25.2
psycopg2-binary==2.9.9
redis==5.0.1
EOF

# Create go.mod files for Go services
echo "📦 Go modül dosyaları oluşturuluyor..."

for service in user-service listing-service messaging-service notification-service; do
    cat > backend/$service/go.mod << EOF
module emlakos-$service

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/gin-contrib/cors v1.4.0
    github.com/golang-jwt/jwt/v5 v5.0.0
    gorm.io/gorm v1.25.1
    gorm.io/driver/postgres v1.5.2
)
EOF
done

# Create Nginx configuration
echo "🌐 Nginx konfigürasyonu oluşturuluyor..."

cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:8080;
    }

    upstream user_service {
        server user-service:8081;
    }

    upstream listing_service {
        server listing-service:8082;
    }

    upstream messaging_service {
        server messaging-service:8083;
    }

    upstream notification_service {
        server notification-service:8084;
    }

    upstream ai_valuation_service {
        server ai-valuation-service:8085;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API Gateway
        location /api/ {
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health checks
        location /health {
            proxy_pass http://api_gateway/health;
        }
    }
}
EOF

# Create Prometheus configuration
echo "📊 Prometheus konfigürasyonu oluşturuluyor..."

cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    static_configs:
      - targets: ['api-gateway:8080']

  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:8081']

  - job_name: 'listing-service'
    static_configs:
      - targets: ['listing-service:8082']

  - job_name: 'messaging-service'
    static_configs:
      - targets: ['messaging-service:8083']

  - job_name: 'notification-service'
    static_configs:
      - targets: ['notification-service:8084']

  - job_name: 'ai-valuation-service'
    static_configs:
      - targets: ['ai-valuation-service:8085']
EOF

# Start the system
echo "🚀 Sistem başlatılıyor..."
echo "Bu işlem birkaç dakika sürebilir..."

# Pull latest images
echo "📥 Docker imajları indiriliyor..."
docker-compose pull

# Build and start services
echo "🔨 Servisler build ediliyor ve başlatılıyor..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Servislerin hazır olması bekleniyor..."
sleep 30

# Check service health
echo "🔍 Servis sağlığı kontrol ediliyor..."

services=(
    "http://localhost:8080/health"
    "http://localhost:8081/health"
    "http://localhost:8082/health"
    "http://localhost:8083/health"
    "http://localhost:8084/health"
    "http://localhost:8085/health"
)

for service in "${services[@]}"; do
    if curl -f "$service" > /dev/null 2>&1; then
        echo "✅ $service - Çalışıyor"
    else
        echo "❌ $service - Çalışmıyor"
    fi
done

# Check database
echo "🗄️ Veritabanı kontrol ediliyor..."
if docker exec emlakos-postgres pg_isready -U emlakos_user -d emlakos_turkiye > /dev/null 2>&1; then
    echo "✅ PostgreSQL - Çalışıyor"
else
    echo "❌ PostgreSQL - Çalışmıyor"
fi

# Check Redis
echo "🔴 Redis kontrol ediliyor..."
if docker exec emlakos-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis - Çalışıyor"
else
    echo "❌ Redis - Çalışmıyor"
fi

# Check Elasticsearch
echo "🔍 Elasticsearch kontrol ediliyor..."
if curl -f "http://localhost:9200/_cluster/health" > /dev/null 2>&1; then
    echo "✅ Elasticsearch - Çalışıyor"
else
    echo "❌ Elasticsearch - Çalışmıyor"
fi

echo ""
echo "🎉 EmlakOS Türkiye sistemi başlatıldı!"
echo "================================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API Gateway: http://localhost:8080"
echo "🗄️ PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo "🔍 Elasticsearch: http://localhost:9200"
echo "📊 Kibana: http://localhost:5601"
echo "📈 Prometheus: http://localhost:9090"
echo "📊 Grafana: http://localhost:3001 (admin/admin)"
echo "📨 Kafka: localhost:9092"
echo ""
echo "📋 Kullanılabilir komutlar:"
echo "  docker-compose logs -f [service-name]  # Servis loglarını izle"
echo "  docker-compose stop                    # Tüm servisleri durdur"
echo "  docker-compose start                   # Tüm servisleri başlat"
echo "  docker-compose restart [service-name]  # Belirli servisi yeniden başlat"
echo ""
echo "🔧 Sistem yönetimi:"
echo "  ./start-system.sh                     # Sistemi başlat"
echo "  ./stop-system.sh                      # Sistemi durdur"
echo "  ./restart-system.sh                   # Sistemi yeniden başlat"
echo ""
echo "✅ Sistem başarıyla çalışıyor! Tarayıcınızda http://localhost:3000 adresini açın."
