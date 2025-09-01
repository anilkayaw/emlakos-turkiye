package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// Database connection
var db *sql.DB

// PropertyListing struct
type PropertyListing struct {
	ID              string  `json:"id"`
	Title           string  `json:"title"`
	Description     string  `json:"description"`
	Price           float64 `json:"price"`
	Currency        string  `json:"currency"`
	TransactionType string  `json:"transaction_type"`
	PropertyType    string  `json:"property_type"`
	Location        struct {
		City        string     `json:"city"`
		District    string     `json:"district"`
		Address     string     `json:"address"`
		Coordinates [2]float64 `json:"coordinates"`
	} `json:"location"`
	Details struct {
		TotalArea   float64 `json:"total_area"`
		LivingArea  float64 `json:"living_area"`
		Rooms       int     `json:"rooms"`
		Bedrooms    int     `json:"bedrooms"`
		Bathrooms   int     `json:"bathrooms"`
		Floor       int     `json:"floor"`
		BuildingAge int     `json:"building_age"`
	} `json:"details"`
	Features  []string `json:"features"`
	Amenities []string `json:"amenities"`
	Images    []string `json:"images"`
	Owner     struct {
		ID        string `json:"id"`
		Name      string `json:"name"`
		Phone     string `json:"phone"`
		Email     string `json:"email"`
		AvatarURL string `json:"avatar_url"`
	} `json:"owner"`
	Status         string `json:"status"`
	IsFeatured     bool   `json:"is_featured"`
	IsPremium      bool   `json:"is_premium"`
	ViewsCount     int    `json:"views_count"`
	FavoritesCount int    `json:"favorites_count"`
	ContactCount   int    `json:"contact_count"`
	CreatedAt      string `json:"created_at"`
	UpdatedAt      string `json:"updated_at"`
	PublishedAt    string `json:"published_at"`
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
	api := router.Group("/api/listings")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "OK",
				"service": "EmlakOS Türkiye Listing Service",
				"version": "1.0.0",
			})
		})

		// Listing routes
		api.GET("", handleGetListings)
		api.GET("/:id", handleGetListing)
		api.POST("", handleCreateListing)
		api.PUT("/:id", handleUpdateListing)
		api.DELETE("/:id", handleDeleteListing)
		api.POST("/:id/favorite", handleToggleFavorite)
		api.GET("/search", handleSearchListings)
		api.GET("/properties", handleGetMapProperties)
		api.GET("/nearby", handleGetNearbyProperties)
	}

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	log.Printf("🏠 EmlakOS Türkiye Listing Service başlatılıyor... Port: %s", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Listing Service başlatılamadı:", err)
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

// Mock data
func getMockListings() []PropertyListing {
	return []PropertyListing{
		{
			ID:              "listing-1",
			Title:           "Merkezi Konumda 3+1 Daire",
			Description:     "Şehrin merkezinde, ulaşım imkanlarına yakın, modern 3+1 daire.",
			Price:           2500000,
			Currency:        "TRY",
			TransactionType: "sale",
			PropertyType:    "apartment",
			Location: struct {
				City        string     `json:"city"`
				District    string     `json:"district"`
				Address     string     `json:"address"`
				Coordinates [2]float64 `json:"coordinates"`
			}{
				City:        "İstanbul",
				District:    "Beşiktaş",
				Address:     "Etiler Mahallesi, No: 123",
				Coordinates: [2]float64{41.0766, 29.0227},
			},
			Details: struct {
				TotalArea   float64 `json:"total_area"`
				LivingArea  float64 `json:"living_area"`
				Rooms       int     `json:"rooms"`
				Bedrooms    int     `json:"bedrooms"`
				Bathrooms   int     `json:"bathrooms"`
				Floor       int     `json:"floor"`
				BuildingAge int     `json:"building_age"`
			}{
				TotalArea:   120,
				LivingArea:  100,
				Rooms:       4,
				Bedrooms:    3,
				Bathrooms:   2,
				Floor:       5,
				BuildingAge: 10,
			},
			Features:  []string{"Balkon", "Asansör", "Güvenlik", "Otopark"},
			Amenities: []string{"Market", "Okul", "Hastane", "Metro"},
			Images:    []string{"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"},
			Owner: struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				Phone     string `json:"phone"`
				Email     string `json:"email"`
				AvatarURL string `json:"avatar_url"`
			}{
				ID:        "user-1",
				Name:      "Ahmet Yılmaz",
				Phone:     "+90 555 123 4567",
				Email:     "ahmet@example.com",
				AvatarURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
			},
			Status:         "active",
			IsFeatured:     true,
			IsPremium:      false,
			ViewsCount:     125,
			FavoritesCount: 8,
			ContactCount:   12,
			CreatedAt:      "2025-09-01T20:00:00Z",
			UpdatedAt:      "2025-09-01T20:00:00Z",
			PublishedAt:    "2025-09-01T20:00:00Z",
		},
		{
			ID:              "listing-2",
			Title:           "Deniz Manzaralı Villa",
			Description:     "Bodrum'da deniz manzaralı, havuzlu, lüks villa.",
			Price:           8500000,
			Currency:        "TRY",
			TransactionType: "sale",
			PropertyType:    "villa",
			Location: struct {
				City        string     `json:"city"`
				District    string     `json:"district"`
				Address     string     `json:"address"`
				Coordinates [2]float64 `json:"coordinates"`
			}{
				City:        "Muğla",
				District:    "Bodrum",
				Address:     "Yalıkavak Mahallesi, No: 456",
				Coordinates: [2]float64{37.1028, 27.2582},
			},
			Details: struct {
				TotalArea   float64 `json:"total_area"`
				LivingArea  float64 `json:"living_area"`
				Rooms       int     `json:"rooms"`
				Bedrooms    int     `json:"bedrooms"`
				Bathrooms   int     `json:"bathrooms"`
				Floor       int     `json:"floor"`
				BuildingAge int     `json:"building_age"`
			}{
				TotalArea:   350,
				LivingArea:  280,
				Rooms:       6,
				Bedrooms:    4,
				Bathrooms:   3,
				Floor:       2,
				BuildingAge: 5,
			},
			Features:  []string{"Havuz", "Bahçe", "Güvenlik", "Deniz Manzarası"},
			Amenities: []string{"Plaj", "Marina", "Restoran", "Alışveriş"},
			Images:    []string{"https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"},
			Owner: struct {
				ID        string `json:"id"`
				Name      string `json:"name"`
				Phone     string `json:"phone"`
				Email     string `json:"email"`
				AvatarURL string `json:"avatar_url"`
			}{
				ID:        "user-2",
				Name:      "Ayşe Demir",
				Phone:     "+90 555 987 6543",
				Email:     "ayse@example.com",
				AvatarURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
			},
			Status:         "active",
			IsFeatured:     true,
			IsPremium:      true,
			ViewsCount:     98,
			FavoritesCount: 15,
			ContactCount:   8,
			CreatedAt:      "2025-09-01T19:30:00Z",
			UpdatedAt:      "2025-09-01T19:30:00Z",
			PublishedAt:    "2025-09-01T19:30:00Z",
		},
	}
}

// Handler functions
func handleGetListings(c *gin.Context) {
	// Query parameters
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	city := c.Query("city")
	propertyType := c.Query("property_type")
	transactionType := c.Query("transaction_type")
	minPrice := c.Query("min_price")
	maxPrice := c.Query("max_price")

	// Convert to integers
	pageInt, _ := strconv.Atoi(page)
	limitInt, _ := strconv.Atoi(limit)

	// Mock filtering (in real app, this would be database query)
	listings := getMockListings()

	// Apply filters
	filteredListings := []PropertyListing{}
	for _, listing := range listings {
		if city != "" && listing.Location.City != city {
			continue
		}
		if propertyType != "" && listing.PropertyType != propertyType {
			continue
		}
		if transactionType != "" && listing.TransactionType != transactionType {
			continue
		}
		if minPrice != "" {
			if minPriceFloat, err := strconv.ParseFloat(minPrice, 64); err == nil {
				if listing.Price < minPriceFloat {
					continue
				}
			}
		}
		if maxPrice != "" {
			if maxPriceFloat, err := strconv.ParseFloat(maxPrice, 64); err == nil {
				if listing.Price > maxPriceFloat {
					continue
				}
			}
		}
		filteredListings = append(filteredListings, listing)
	}

	// Pagination
	start := (pageInt - 1) * limitInt
	end := start + limitInt
	if start >= len(filteredListings) {
		filteredListings = []PropertyListing{}
	} else if end > len(filteredListings) {
		filteredListings = filteredListings[start:]
	} else {
		filteredListings = filteredListings[start:end]
	}

	c.JSON(http.StatusOK, gin.H{
		"listings": filteredListings,
		"pagination": gin.H{
			"page":        pageInt,
			"limit":       limitInt,
			"total":       len(getMockListings()),
			"total_pages": (len(getMockListings()) + limitInt - 1) / limitInt,
		},
	})
}

func handleGetListing(c *gin.Context) {
	id := c.Param("id")

	// Find listing by ID
	listings := getMockListings()
	for _, listing := range listings {
		if listing.ID == id {
			// Increment view count
			listing.ViewsCount++
			c.JSON(http.StatusOK, gin.H{
				"listing": listing,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{
		"error": "İlan bulunamadı",
	})
}

func handleCreateListing(c *gin.Context) {
	var listing PropertyListing
	if err := c.ShouldBindJSON(&listing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Mock creation
	listing.ID = "listing-" + strconv.Itoa(len(getMockListings())+1)
	listing.Status = "active"
	listing.ViewsCount = 0
	listing.FavoritesCount = 0
	listing.ContactCount = 0

	c.JSON(http.StatusCreated, gin.H{
		"message": "İlan başarıyla oluşturuldu",
		"listing": listing,
	})
}

func handleUpdateListing(c *gin.Context) {
	id := c.Param("id")

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "İlan başarıyla güncellendi",
		"listing_id": id,
	})
}

func handleDeleteListing(c *gin.Context) {
	id := c.Param("id")

	c.JSON(http.StatusOK, gin.H{
		"message":    "İlan başarıyla silindi",
		"listing_id": id,
	})
}

func handleToggleFavorite(c *gin.Context) {
	id := c.Param("id")

	c.JSON(http.StatusOK, gin.H{
		"message":     "Favori durumu güncellendi",
		"listing_id":  id,
		"is_favorite": true,
	})
}

func handleSearchListings(c *gin.Context) {
	query := c.Query("q")

	// Mock search
	listings := getMockListings()
	results := []PropertyListing{}

	for _, listing := range listings {
		if query == "" ||
			contains(listing.Title, query) ||
			contains(listing.Description, query) ||
			contains(listing.Location.City, query) ||
			contains(listing.Location.District, query) {
			results = append(results, listing)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"listings": results,
		"query":    query,
		"total":    len(results),
	})
}

func handleGetMapProperties(c *gin.Context) {
	// Mock map properties
	listings := getMockListings()

	c.JSON(http.StatusOK, gin.H{
		"properties": listings,
	})
}

func handleGetNearbyProperties(c *gin.Context) {
	lat := c.Query("lat")
	lng := c.Query("lng")
	radius := c.DefaultQuery("radius", "5")

	// Mock nearby search
	listings := getMockListings()

	c.JSON(http.StatusOK, gin.H{
		"properties": listings,
		"center": gin.H{
			"lat": lat,
			"lng": lng,
		},
		"radius": radius,
	})
}

// Helper function
func contains(s, substr string) bool {
	return len(s) >= len(substr) && s[:len(substr)] == substr
}
