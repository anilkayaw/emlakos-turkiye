package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Environment variables yükle
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Gin router'ı oluştur
	router := gin.Default()

	// API routes tanımla
	api := router.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "OK",
				"service": "EmlakOS Türkiye User Service",
				"version": "1.0.0",
			})
		})

		// User routes
		users := api.Group("/users")
		{
			users.POST("/register", handleUserRegister)
			users.POST("/login", handleUserLogin)
			users.GET("/me", authMiddleware(), handleUserProfile)
			users.PUT("/me", authMiddleware(), handleUserUpdate)
			users.GET("/:id", handleUserGet)
		}
	}

	// Port'u environment variable'dan al, varsayılan 8081
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("👤 EmlakOS Türkiye User Service başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("User Service başlatılamadı:", err)
	}
}

// Auth middleware placeholder
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// JWT token validation burada yapılacak
		// Şimdilik placeholder olarak bırakıyoruz
		c.Next()
	}
}

// Handler functions
func handleUserRegister(c *gin.Context) {
	var req struct {
		UserType string `json:"user_type" binding:"required"`
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Phone    string `json:"phone_number"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	// Şimdilik placeholder response
	c.JSON(201, gin.H{
		"message": "Kullanıcı başarıyla kaydedildi",
		"user": gin.H{
			"user_type": req.UserType,
			"name":      req.Name,
			"email":     req.Email,
			"phone":     req.Phone,
		},
	})
}

func handleUserLogin(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	// Şimdilik placeholder response
	c.JSON(200, gin.H{
		"message": "Giriş başarılı",
		"token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Placeholder JWT token
		"user": gin.H{
			"email": req.Email,
		},
	})
}

func handleUserProfile(c *gin.Context) {
	// Şimdilik placeholder response
	c.JSON(200, gin.H{
		"message": "Kullanıcı profili",
		"user": gin.H{
			"id":         "user-uuid-here",
			"user_type":  "kiracı",
			"name":       "Ayşe Demir",
			"email":      "ayse@example.com",
			"phone":      "+90 555 987 6543",
			"is_verified": true,
		},
	})
}

func handleUserUpdate(c *gin.Context) {
	var req struct {
		Name  string `json:"name"`
		Phone string `json:"phone_number"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	// Şimdilik placeholder response
	c.JSON(200, gin.H{
		"message": "Profil başarıyla güncellendi",
		"user": gin.H{
			"name":  req.Name,
			"phone": req.Phone,
		},
	})
}

func handleUserGet(c *gin.Context) {
	userID := c.Param("id")
	
	// Şimdilik placeholder response
	c.JSON(200, gin.H{
		"message": "Kullanıcı bilgileri",
		"user": gin.H{
			"id":        userID,
			"user_type": "mülk_sahibi",
			"name":      "Ahmet Yılmaz",
			"email":     "ahmet@example.com",
			"phone":     "+90 555 123 4567",
		},
	})
}
