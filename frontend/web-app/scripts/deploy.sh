#!/bin/bash

# EmlakOS Türkiye - Deployment Script
# This script handles the deployment of the frontend application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="emlakos-turkiye"
DOCKER_REGISTRY="your-registry.com"
DOCKER_IMAGE="$DOCKER_REGISTRY/$APP_NAME"
VERSION=${1:-latest}
ENVIRONMENT=${2:-production}

echo -e "${BLUE}🚀 Starting deployment for $APP_NAME${NC}"
echo -e "${BLUE}Version: $VERSION${NC}"
echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DOCKER_REGISTRY" ] || [ "$DOCKER_REGISTRY" = "your-registry.com" ]; then
    print_error "Please set DOCKER_REGISTRY environment variable"
    exit 1
fi

# Build the application
print_status "Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

# Run tests
print_status "Running tests..."
npm run test

if [ $? -ne 0 ]; then
    print_error "Tests failed"
    exit 1
fi

# Run linting
print_status "Running linting..."
npm run lint

if [ $? -ne 0 ]; then
    print_error "Linting failed"
    exit 1
fi

# Build Docker image
print_status "Building Docker image..."
docker build -t $DOCKER_IMAGE:$VERSION .

if [ $? -ne 0 ]; then
    print_error "Docker build failed"
    exit 1
fi

# Tag image for latest if this is production
if [ "$ENVIRONMENT" = "production" ]; then
    docker tag $DOCKER_IMAGE:$VERSION $DOCKER_IMAGE:latest
fi

# Push to registry
print_status "Pushing image to registry..."
docker push $DOCKER_IMAGE:$VERSION

if [ $? -ne 0 ]; then
    print_error "Failed to push image to registry"
    exit 1
fi

if [ "$ENVIRONMENT" = "production" ]; then
    docker push $DOCKER_IMAGE:latest
fi

# Deploy to environment
case $ENVIRONMENT in
    "production")
        print_status "Deploying to production..."
        # Add your production deployment commands here
        # Example: kubectl apply -f k8s/production/
        # Example: docker-compose -f docker-compose.prod.yml up -d
        ;;
    "staging")
        print_status "Deploying to staging..."
        # Add your staging deployment commands here
        # Example: kubectl apply -f k8s/staging/
        # Example: docker-compose -f docker-compose.staging.yml up -d
        ;;
    "development")
        print_status "Deploying to development..."
        # Add your development deployment commands here
        # Example: docker-compose up -d
        ;;
    *)
        print_error "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac

# Health check
print_status "Performing health check..."
sleep 30

# Add your health check logic here
# Example: curl -f http://localhost:3000/api/health

print_status "Deployment completed successfully!"
print_status "Application is running at: https://emlakos.com"

# Cleanup old images (keep last 5 versions)
print_status "Cleaning up old Docker images..."
docker images $DOCKER_IMAGE --format "table {{.Tag}}\t{{.CreatedAt}}" | tail -n +6 | awk '{print $1}' | xargs -r docker rmi $DOCKER_IMAGE

print_status "Deployment script completed!"
