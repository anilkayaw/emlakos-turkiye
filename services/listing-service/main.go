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
				"service": "EmlakOS Türkiye Listing Service",
				"version": "1.0.0",
			})
		})

		// Listing routes
		listings := api.Group("/listings")
		{
			listings.GET("", handleListingsSearch)
			listings.GET("/:id", handleListingDetail)
			listings.POST("", authMiddleware(), handleListingCreate)
			listings.PUT("/:id", authMiddleware(), handleListingUpdate)
			listings.DELETE("/:id", authMiddleware(), handleListingDelete)
			listings.GET("/search/suggestions", handleSearchSuggestions)
		}

		// Contract routes
		contracts := api.Group("/contracts")
		{
			contracts.POST("/rent", authMiddleware(), handleRentContractCreate)
			contracts.GET("/:id", authMiddleware(), handleContractDetail)
			contracts.PUT("/:id/status", authMiddleware(), handleContractStatusUpdate)
		}

		// Favorite routes
		favorites := api.Group("/favorites")
		{
			favorites.GET("", authMiddleware(), handleFavoritesList)
			favorites.POST("/:listing_id", authMiddleware(), handleFavoriteAdd)
			favorites.DELETE("/:listing_id", authMiddleware(), handleFavoriteRemove)
		}
	}

	// Port'u environment variable'dan al, varsayılan 8082
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("🏠 EmlakOS Türkiye Listing Service başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Listing Service başlatılamadı:", err)
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
func handleListingsSearch(c *gin.Context) {
	// Query parameters
	city := c.Query("city")
	district := c.Query("district")
	propertyType := c.Query("property_type")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")
	roomCount := c.Query("room_count")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "20")

	// Şimdilik placeholder response
	c.JSON(200, gin.H{
		"message": "Listings search endpoint",
		"filters": gin.H{
			"city":         city,
			"district":     district,
			"property_type": propertyType,
			"min_price":    minPrice,
			"max_price":    maxPrice,
			"room_count":   roomCount,
			"page":         page,
			"limit":        limit,
		},
		"results": []gin.H{
			{
				"id":          "listing-1",
				"title":       "Modern 3+1 Daire",
				"city":        city,
				"district":    district,
				"price":       "2.450.000",
				"property_type": propertyType,
			},
		},
		"pagination": gin.H{
			"page":   page,
			"limit":  limit,
			"total":  150,
			"pages":  8,
		},
	})
}

func handleListingDetail(c *gin.Context) {
	listingID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "Listing detail endpoint",
		"listing": gin.H{
			"id":            listingID,
			"title":         "Modern 3+1 Daire",
			"description":   "Kadıköy'de yeni yapılan projede satılık daire",
			"price":         "2.450.000 TL",
			"property_type": "Daire",
			"rooms":         "3+1",
			"sqm":           125,
			"city":          "İstanbul",
			"district":      "Kadıköy",
			"features":      []string{"Asansör", "Otopark", "Güvenlik"},
			"images":        []string{"image1.jpg", "image2.jpg"},
		},
	})
}

func handleListingCreate(c *gin.Context) {
	var req struct {
		Title        string  `json:"title" binding:"required"`
		Description  string  `json:"description"`
		Price        float64 `json:"price" binding:"required"`
		PropertyType string  `json:"property_type" binding:"required"`
		City         string  `json:"city" binding:"required"`
		District     string  `json:"district" binding:"required"`
		SqMeters     float64 `json:"sq_meters" binding:"required"`
		RoomCount    string  `json:"room_count"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{
		"message": "İlan başarıyla oluşturuldu",
		"listing": gin.H{
			"id":            "new-listing-id",
			"title":         req.Title,
			"price":         req.Price,
			"property_type": req.PropertyType,
			"city":          req.City,
			"district":      req.District,
		},
	})
}

func handleListingUpdate(c *gin.Context) {
	listingID := c.Param("id")
	
	var req struct {
		Title       string  `json:"title"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "İlan başarıyla güncellendi",
		"listing_id": listingID,
		"updated_fields": req,
	})
}

func handleListingDelete(c *gin.Context) {
	listingID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "İlan başarıyla silindi",
		"listing_id": listingID,
	})
}

func handleSearchSuggestions(c *gin.Context) {
	query := c.Query("q")
	
	c.JSON(200, gin.H{
		"message": "Search suggestions endpoint",
		"query":   query,
		"suggestions": []gin.H{
			{"type": "city", "value": "İstanbul", "count": 15000},
			{"type": "district", "value": "Kadıköy", "count": 2500},
			{"type": "property", "value": "3+1 Daire", "count": 8000},
		},
	})
}

func handleRentContractCreate(c *gin.Context) {
	var req struct {
		PropertyID     string  `json:"property_id" binding:"required"`
		TenantID       string  `json:"tenant_id" binding:"required"`
		StartDate      string  `json:"start_date" binding:"required"`
		EndDate        string  `json:"end_date" binding:"required"`
		MonthlyRent    float64 `json:"monthly_rent" binding:"required"`
		Deposit        float64 `json:"deposit" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{
		"message": "Kira sözleşmesi başarıyla oluşturuldu",
		"contract": gin.H{
			"id":            "contract-id",
			"property_id":   req.PropertyID,
			"tenant_id":     req.TenantID,
			"monthly_rent":  req.MonthlyRent,
			"deposit":       req.Deposit,
			"status":        "beklemede",
		},
	})
}

func handleContractDetail(c *gin.Context) {
	contractID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "Contract detail endpoint",
		"contract_id": contractID,
		"contract": gin.H{
			"id":            contractID,
			"property_id":   "property-123",
			"tenant_id":     "tenant-456",
			"monthly_rent":  5000,
			"deposit":       10000,
			"status":        "aktif",
		},
	})
}

func handleContractStatusUpdate(c *gin.Context) {
	contractID := c.Param("id")
	
	var req struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Sözleşme durumu güncellendi",
		"contract_id": contractID,
		"new_status": req.Status,
	})
}

func handleFavoritesList(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Favorites list endpoint",
		"favorites": []gin.H{
			{
				"id":          "fav-1",
				"listing_id":  "listing-123",
				"title":       "Modern 3+1 Daire",
				"price":       "2.450.000 TL",
				"added_at":    "2024-01-15T10:30:00Z",
			},
		},
	})
}

func handleFavoriteAdd(c *gin.Context) {
	listingID := c.Param("listing_id")
	
	c.JSON(200, gin.H{
		"message": "Favorilere eklendi",
		"listing_id": listingID,
	})
}

func handleFavoriteRemove(c *gin.Context) {
	listingID := c.Param("listing_id")
	
	c.JSON(200, gin.H{
		"message": "Favorilerden çıkarıldı",
		"listing_id": listingID,
	})
}
