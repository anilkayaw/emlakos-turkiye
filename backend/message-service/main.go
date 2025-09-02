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

// Message struct
type Message struct {
	ID             string `json:"id"`
	ConversationID string `json:"conversation_id"`
	SenderID       string `json:"sender_id"`
	MessageText    string `json:"message_text"`
	MessageType    string `json:"message_type"`
	IsRead         bool   `json:"is_read"`
	CreatedAt      string `json:"created_at"`
}

// Conversation struct
type Conversation struct {
	ID         string `json:"id"`
	PropertyID string `json:"property_id"`
	BuyerID    string `json:"buyer_id"`
	SellerID   string `json:"seller_id"`
	Property   struct {
		ID       string `json:"id"`
		Title    string `json:"title"`
		ImageURL string `json:"image_url"`
	} `json:"property"`
	Buyer struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	} `json:"buyer"`
	Seller struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	} `json:"seller"`
	LastMessage *Message `json:"last_message"`
	UnreadCount int      `json:"unread_count"`
	CreatedAt   string   `json:"created_at"`
	UpdatedAt   string   `json:"updated_at"`
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
	api := router.Group("/api/messages")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":  "OK",
				"service": "EmlakOS Türkiye Message Service",
				"version": "1.0.0",
			})
		})

		// Message routes
		api.GET("/conversations", handleGetConversations)
		api.GET("", handleGetMessages)
		api.POST("", handleSendMessage)
	}

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	log.Printf("💬 EmlakOS Türkiye Message Service başlatılıyor... Port: %s", port)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Message Service başlatılamadı:", err)
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
		dbUser = "emlakos_user"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "emlakos_password_2024"
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
func getMockConversations() []Conversation {
	return []Conversation{
		{
			ID:         "conv-1",
			PropertyID: "listing-1",
			BuyerID:    "user-1",
			SellerID:   "user-2",
			Property: struct {
				ID       string `json:"id"`
				Title    string `json:"title"`
				ImageURL string `json:"image_url"`
			}{
				ID:       "listing-1",
				Title:    "Merkezi Konumda 3+1 Daire",
				ImageURL: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
			},
			Buyer: struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			}{
				ID:   "user-1",
				Name: "Ahmet Yılmaz",
			},
			Seller: struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			}{
				ID:   "user-2",
				Name: "Ayşe Demir",
			},
			LastMessage: &Message{
				ID:             "msg-1",
				ConversationID: "conv-1",
				SenderID:       "user-1",
				MessageText:    "Merhaba, bu daire hakkında daha fazla bilgi alabilir miyim?",
				MessageType:    "text",
				IsRead:         true,
				CreatedAt:      "2025-09-01T20:30:00Z",
			},
			UnreadCount: 0,
			CreatedAt:   "2025-09-01T20:00:00Z",
			UpdatedAt:   "2025-09-01T20:30:00Z",
		},
		{
			ID:         "conv-2",
			PropertyID: "listing-2",
			BuyerID:    "user-3",
			SellerID:   "user-2",
			Property: struct {
				ID       string `json:"id"`
				Title    string `json:"title"`
				ImageURL string `json:"image_url"`
			}{
				ID:       "listing-2",
				Title:    "Deniz Manzaralı Villa",
				ImageURL: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
			},
			Buyer: struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			}{
				ID:   "user-3",
				Name: "Mehmet Kaya",
			},
			Seller: struct {
				ID   string `json:"id"`
				Name string `json:"name"`
			}{
				ID:   "user-2",
				Name: "Ayşe Demir",
			},
			LastMessage: &Message{
				ID:             "msg-2",
				ConversationID: "conv-2",
				SenderID:       "user-3",
				MessageText:    "Villa için görüşme yapabilir miyiz?",
				MessageType:    "text",
				IsRead:         false,
				CreatedAt:      "2025-09-01T21:00:00Z",
			},
			UnreadCount: 1,
			CreatedAt:   "2025-09-01T20:45:00Z",
			UpdatedAt:   "2025-09-01T21:00:00Z",
		},
	}
}

func getMockMessages(conversationID string) []Message {
	allMessages := []Message{
		{
			ID:             "msg-1",
			ConversationID: "conv-1",
			SenderID:       "user-1",
			MessageText:    "Merhaba, bu daire hakkında daha fazla bilgi alabilir miyim?",
			MessageType:    "text",
			IsRead:         true,
			CreatedAt:      "2025-09-01T20:00:00Z",
		},
		{
			ID:             "msg-2",
			ConversationID: "conv-1",
			SenderID:       "user-2",
			MessageText:    "Tabii ki! Hangi konularda bilgi almak istiyorsunuz?",
			MessageType:    "text",
			IsRead:         true,
			CreatedAt:      "2025-09-01T20:15:00Z",
		},
		{
			ID:             "msg-3",
			ConversationID: "conv-1",
			SenderID:       "user-1",
			MessageText:    "Otopark durumu ve aidat bilgisi alabilir miyim?",
			MessageType:    "text",
			IsRead:         true,
			CreatedAt:      "2025-09-01T20:30:00Z",
		},
		{
			ID:             "msg-4",
			ConversationID: "conv-2",
			SenderID:       "user-3",
			MessageText:    "Villa için görüşme yapabilir miyiz?",
			MessageType:    "text",
			IsRead:         false,
			CreatedAt:      "2025-09-01T21:00:00Z",
		},
	}

	// Filter messages by conversation ID
	var filteredMessages []Message
	for _, msg := range allMessages {
		if msg.ConversationID == conversationID {
			filteredMessages = append(filteredMessages, msg)
		}
	}

	return filteredMessages
}

// Handler functions
func handleGetConversations(c *gin.Context) {
	conversations := getMockConversations()

	c.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})
}

func handleGetMessages(c *gin.Context) {
	conversationID := c.Query("conversation")
	if conversationID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Conversation ID gerekli"})
		return
	}

	messages := getMockMessages(conversationID)

	c.JSON(http.StatusOK, gin.H{
		"messages":        messages,
		"conversation_id": conversationID,
	})
}

func handleSendMessage(c *gin.Context) {
	var req struct {
		ConversationID string `json:"conversation_id" binding:"required"`
		MessageText    string `json:"message_text" binding:"required"`
		MessageType    string `json:"message_type"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Mock message creation
	message := Message{
		ID:             "msg-" + req.ConversationID + "-" + "new",
		ConversationID: req.ConversationID,
		SenderID:       "current-user", // In real app, get from JWT
		MessageText:    req.MessageText,
		MessageType:    req.MessageType,
		IsRead:         false,
		CreatedAt:      "2025-09-01T21:30:00Z",
	}

	if message.MessageType == "" {
		message.MessageType = "text"
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Mesaj başarıyla gönderildi",
		"data":    message,
	})
}
