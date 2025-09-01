package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Environment variables yükle
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// Gin router'ı oluştur
	router := gin.Default()

	// CORS middleware ekle
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API routes tanımla
	api := router.Group("/api")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "OK",
				"service": "EmlakOS Türkiye API Gateway",
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
		}

		// Listing routes
		listings := api.Group("/listings")
		{
			listings.GET("", handleListingsSearch)
			listings.GET("/:id", handleListingDetail)
			listings.POST("", authMiddleware(), handleListingCreate)
			listings.PUT("/:id", authMiddleware(), handleListingUpdate)
			listings.DELETE("/:id", authMiddleware(), handleListingDelete)
		}

		// Valuation routes
		valuation := api.Group("/valuation")
		{
			valuation.POST("/estimate", handleValuationEstimate)
		}

		// Contract routes
		contracts := api.Group("/contracts")
		{
			contracts.POST("/rent", authMiddleware(), handleRentContractCreate)
		}

		// Search routes
		search := api.Group("/search")
		{
			search.GET("/properties", handlePropertySearch)
			search.GET("/suggestions", handleSearchSuggestions)
		}
	}

	// Port'u environment variable'dan al, varsayılan 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 EmlakOS Türkiye API Gateway başlatılıyor... Port: %s", port)
	log.Printf("📚 API Dokümantasyonu: http://localhost:%s/docs", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("API Gateway başlatılamadı:", err)
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

// Handler functions - şimdilik placeholder
func handleUserRegister(c *gin.Context) {
	c.JSON(200, gin.H{"message": "User registration endpoint - User Service'e yönlendirilecek"})
}

func handleUserLogin(c *gin.Context) {
	c.JSON(200, gin.H{"message": "User login endpoint - User Service'e yönlendirilecek"})
}

func handleUserProfile(c *gin.Context) {
	c.JSON(200, gin.H{"message": "User profile endpoint - User Service'e yönlendirilecek"})
}

func handleUserUpdate(c *gin.Context) {
	c.JSON(200, gin.H{"message": "User update endpoint - User Service'e yönlendirilecek"})
}

func handleListingsSearch(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Listings search endpoint - Listing Service'e yönlendirilecek"})
}

func handleListingDetail(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Listing detail endpoint - Listing Service'e yönlendirilecek"})
}

func handleListingCreate(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Listing create endpoint - Listing Service'e yönlendirilecek"})
}

func handleListingUpdate(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Listing update endpoint - Listing Service'e yönlendirilecek"})
}

func handleListingDelete(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Listing delete endpoint - Listing Service'e yönlendirilecek"})
}

func handleValuationEstimate(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Valuation estimate endpoint - Valuation Service'e yönlendirilecek"})
}

func handleRentContractCreate(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Rent contract create endpoint - Listing Service'e yönlendirilecek"})
}

func handlePropertySearch(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Property search endpoint - Elasticsearch'e yönlendirilecek"})
}

func handleSearchSuggestions(c *gin.Context) {
	c.JSON(200, gin.H{"message": "Search suggestions endpoint - Elasticsearch'e yönlendirilecek"})
}
