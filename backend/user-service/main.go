package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// Database connection
var db *sql.DB

// User struct
type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Phone     string `json:"phone"`
	UserType  string `json:"user_type"`
	IsVerified bool  `json:"is_verified"`
	IsActive  bool   `json:"is_active"`
	CreatedAt string `json:"created_at"`
}

func main() {
	// Database bağlantısı
	initDB()

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

	// API routes
	api := router.Group("/api/users")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "OK",
				"service": "EmlakOS Türkiye User Service",
				"version": "1.0.0",
			})
		})

		// User routes
		api.GET("/profile", handleGetProfile)
		api.PUT("/profile", handleUpdateProfile)
		api.POST("/change-password", handleChangePassword)
		api.GET("/dashboard", handleGetDashboard)
		api.GET("/views", handleGetViews)
	}

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("👤 EmlakOS Türkiye User Service başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("User Service başlatılamadı:", err)
	}
}

// Database initialization
func initDB() {
	var err error
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "5432"
	}
	
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "emlakos_admin"
	}
	
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "EmlakOS2024!SecureDB"
	}
	
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "emlakos_turkiye"
	}

	dsn := "host=" + dbHost + " port=" + dbPort + " user=" + dbUser + " password=" + dbPassword + " dbname=" + dbName + " sslmode=disable"

	db, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Database bağlantısı kurulamadı:", err)
	}

	// Connection test
	if err = db.Ping(); err != nil {
		log.Fatal("Database ping başarısız:", err)
	}

	log.Println("✅ Database bağlantısı başarılı")
}

// Handler functions
func handleGetProfile(c *gin.Context) {
	// Şimdilik mock data
	user := User{
		ID:         "user-123",
		Email:      "test@example.com",
		FirstName:  "Test",
		LastName:   "User",
		Phone:      "+90 555 123 4567",
		UserType:   "buyer",
		IsVerified: true,
		IsActive:   true,
		CreatedAt:  "2025-09-01T20:00:00Z",
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func handleUpdateProfile(c *gin.Context) {
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Profil başarıyla güncellendi",
		"user": gin.H{
			"first_name": req.FirstName,
			"last_name":  req.LastName,
			"phone":      req.Phone,
		},
	})
}

func handleChangePassword(c *gin.Context) {
	var req struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Şifre başarıyla değiştirildi",
	})
}

func handleGetDashboard(c *gin.Context) {
	// Mock dashboard data
	dashboard := gin.H{
		"stats": gin.H{
			"total_listings":    15,
			"active_listings":   12,
			"total_views":       1250,
			"total_contacts":    45,
			"favorite_count":    8,
		},
		"recent_activity": []gin.H{
			{
				"type":      "view",
				"message":   "İlanınız görüntülendi",
				"timestamp": "2025-09-01T20:30:00Z",
			},
			{
				"type":      "contact",
				"message":   "Yeni mesaj aldınız",
				"timestamp": "2025-09-01T20:25:00Z",
			},
		},
	}

	c.JSON(http.StatusOK, dashboard)
}

func handleGetViews(c *gin.Context) {
	// Mock views data
	views := gin.H{
		"total_views": 1250,
		"daily_views": []gin.H{
			{"date": "2025-09-01", "views": 45},
			{"date": "2025-08-31", "views": 38},
			{"date": "2025-08-30", "views": 52},
		},
		"listing_views": []gin.H{
			{
				"listing_id": "listing-1",
				"title":      "Merkezi Konumda 3+1 Daire",
				"views":      125,
			},
			{
				"listing_id": "listing-2", 
				"title":      "Deniz Manzaralı Villa",
				"views":      98,
			},
		},
	}

	c.JSON(http.StatusOK, views)
}
