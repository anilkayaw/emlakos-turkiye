package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWT Secret
var jwtSecret []byte

// JWT Claims
type Claims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	UserType string `json:"user_type"`
	jwt.RegisteredClaims
}

// Service URLs
var (
	AuthServiceURL    = "http://localhost:8082"
	UserServiceURL    = "http://localhost:8083"
	ListingServiceURL = "http://localhost:8084"
	MessageServiceURL = "http://localhost:8085"
)

func main() {
	// JWT Secret
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		jwtSecret = []byte("EmlakOS2024!SuperSecretJWTKey")
	}

	// Gin router
	router := gin.Default()

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Health check
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "OK",
			"service": "EmlakOS Türkiye API Gateway",
			"version": "1.0.0",
			"time":    time.Now().UTC(),
		})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		// Auth routes (proxy to auth service)
		auth := api.Group("/auth")
		{
			auth.POST("/register", proxyToAuthService)
			auth.POST("/login", proxyToAuthService)
			auth.POST("/logout", authMiddleware(), proxyToAuthService)
			auth.GET("/me", authMiddleware(), proxyToAuthService)
			auth.PUT("/me", authMiddleware(), proxyToAuthService)
			auth.POST("/refresh", proxyToAuthService)
			auth.POST("/forgot-password", proxyToAuthService)
			auth.POST("/reset-password", proxyToAuthService)
		}

		// User routes
		users := api.Group("/users")
		users.Use(authMiddleware())
		{
			users.GET("/profile", proxyToUserService)
			users.PUT("/profile", proxyToUserService)
			users.POST("/change-password", proxyToUserService)
		}

		// Listing routes
		listings := api.Group("/listings")
		{
			listings.GET("", proxyToListingService)
			listings.GET("/:id", proxyToListingService)
			listings.POST("", authMiddleware(), proxyToListingService)
			listings.PUT("/:id", authMiddleware(), proxyToListingService)
			listings.DELETE("/:id", authMiddleware(), proxyToListingService)
			listings.POST("/:id/favorite", authMiddleware(), proxyToListingService)
			listings.GET("/search", proxyToListingService)
		}

		// Map routes
		mapRoutes := api.Group("/map")
		{
			mapRoutes.GET("/properties", proxyToListingService)
			mapRoutes.GET("/nearby", proxyToListingService)
		}

		// Message routes
		messages := api.Group("/messages")
		messages.Use(authMiddleware())
		{
			messages.GET("/conversations", proxyToMessageService)
			messages.GET("", proxyToMessageService)
			messages.POST("", proxyToMessageService)
		}

		// Analytics routes
		analytics := api.Group("/analytics")
		analytics.Use(authMiddleware())
		{
			analytics.GET("/dashboard", proxyToUserService)
			analytics.GET("/views", proxyToUserService)
		}
	}

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🌐 EmlakOS Türkiye API Gateway başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("API Gateway başlatılamadı:", err)
	}
}

// Auth middleware
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header gerekli"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Bearer token gerekli"})
			c.Abort()
			return
		}

		claims, err := validateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz token"})
			c.Abort()
			return
		}

		// User bilgilerini context'e ekle
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_type", claims.UserType)

		c.Next()
	}
}

// JWT token doğrula
func validateJWT(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}

// Proxy to Auth Service
func proxyToAuthService(c *gin.Context) {
	proxyRequest(c, AuthServiceURL+"/api/auth"+strings.TrimPrefix(c.Request.URL.Path, "/api/v1/auth"))
}

// Proxy to User Service
func proxyToUserService(c *gin.Context) {
	proxyRequest(c, UserServiceURL+"/api/users"+strings.TrimPrefix(c.Request.URL.Path, "/api/v1/users"))
}

// Proxy to Listing Service
func proxyToListingService(c *gin.Context) {
	proxyRequest(c, ListingServiceURL+"/api/listings"+strings.TrimPrefix(c.Request.URL.Path, "/api/v1/listings"))
}

// Proxy to Message Service
func proxyToMessageService(c *gin.Context) {
	proxyRequest(c, MessageServiceURL+"/api/messages"+strings.TrimPrefix(c.Request.URL.Path, "/api/v1/messages"))
}

// Generic proxy function
func proxyRequest(c *gin.Context, targetURL string) {
	// Create new request
	req, err := http.NewRequest(c.Request.Method, targetURL+c.Request.URL.RawQuery, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Proxy request oluşturulamadı"})
		return
	}

	// Copy headers
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Make request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "Backend servisi erişilemiyor"})
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Response okunamadı"})
		return
	}

	// Set response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Return response
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}