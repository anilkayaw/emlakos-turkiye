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
				"service": "EmlakOS Türkiye Notification Service",
				"version": "1.0.0",
			})
		})

		// Notification routes
		notifications := api.Group("/notifications")
		{
			notifications.GET("", authMiddleware(), handleNotificationsList)
			notifications.GET("/:id", authMiddleware(), handleNotificationDetail)
			notifications.POST("/send", authMiddleware(), handleSendNotification)
			notifications.PUT("/:id/read", authMiddleware(), handleMarkAsRead)
			notifications.DELETE("/:id", authMiddleware(), handleDeleteNotification)
		}

		// Email routes
		emails := api.Group("/emails")
		{
			emails.POST("/send", authMiddleware(), handleSendEmail)
			emails.POST("/template", authMiddleware(), handleSendTemplateEmail)
			emails.GET("/templates", handleGetEmailTemplates)
		}

		// SMS routes
		sms := api.Group("/sms")
		{
			sms.POST("/send", authMiddleware(), handleSendSMS)
			sms.POST("/bulk", authMiddleware(), handleSendBulkSMS)
		}

		// Push notification routes
		push := api.Group("/push")
		{
			push.POST("/send", authMiddleware(), handleSendPushNotification)
			push.POST("/broadcast", authMiddleware(), handleBroadcastPush)
			push.GET("/devices", authMiddleware(), handleGetDevices)
		}
	}

	// Port'u environment variable'dan al, varsayılan 8084
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	log.Printf("🔔 EmlakOS Türkiye Notification Service başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Notification Service başlatılamadı:", err)
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
func handleNotificationsList(c *gin.Context) {
	userID := c.Query("user_id")
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "20")
	
	c.JSON(200, gin.H{
		"message": "Notifications list endpoint",
		"user_id": userID,
		"notifications": []gin.H{
			{
				"id":        "notif-1",
				"type":      "email",
				"title":     "Yeni İlan Bildirimi",
				"message":   "Favori listenizdeki bir mülkün fiyatı güncellendi",
				"is_read":   false,
				"created_at": "2024-01-15T10:30:00Z",
			},
			{
				"id":        "notif-2",
				"type":      "push",
				"title":     "Değerleme Tamamlandı",
				"message":   "Mülkünüzün değerleme raporu hazır",
				"is_read":   true,
				"created_at": "2024-01-15T09:15:00Z",
			},
		},
		"pagination": gin.H{
			"page":  page,
			"limit": limit,
			"total": 25,
			"pages": 2,
		},
	})
}

func handleNotificationDetail(c *gin.Context) {
	notificationID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "Notification detail endpoint",
		"notification": gin.H{
			"id":          notificationID,
			"type":        "email",
			"title":       "Yeni İlan Bildirimi",
			"message":     "Favori listenizdeki bir mülkün fiyatı güncellendi",
			"is_read":     false,
			"created_at":  "2024-01-15T10:30:00Z",
			"metadata":    gin.H{"property_id": "prop-123", "old_price": "2.400.000", "new_price": "2.350.000"},
		},
	})
}

func handleSendNotification(c *gin.Context) {
	var req struct {
		UserID    string `json:"user_id" binding:"required"`
		Type      string `json:"type" binding:"required"`
		Title     string `json:"title" binding:"required"`
		Message   string `json:"message" binding:"required"`
		Priority  string `json:"priority"`
		Metadata  map[string]interface{} `json:"metadata"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(201, gin.H{
		"message": "Bildirim başarıyla gönderildi",
		"notification": gin.H{
			"id":         "new-notif-id",
			"user_id":    req.UserID,
			"type":       req.Type,
			"title":      req.Title,
			"message":    req.Message,
			"priority":   req.Priority,
			"status":     "sent",
			"created_at": "2024-01-15T10:30:00Z",
		},
	})
}

func handleMarkAsRead(c *gin.Context) {
	notificationID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "Bildirim okundu olarak işaretlendi",
		"notification_id": notificationID,
		"status": "read",
	})
}

func handleDeleteNotification(c *gin.Context) {
	notificationID := c.Param("id")
	
	c.JSON(200, gin.H{
		"message": "Bildirim başarıyla silindi",
		"notification_id": notificationID,
	})
}

func handleSendEmail(c *gin.Context) {
	var req struct {
		To      string `json:"to" binding:"required,email"`
		Subject string `json:"subject" binding:"required"`
		Body    string `json:"body" binding:"required"`
		From    string `json:"from"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Email başarıyla gönderildi",
		"email": gin.H{
			"to":      req.To,
			"subject": req.Subject,
			"from":    req.From,
			"status":  "sent",
			"message_id": "email-123",
		},
	})
}

func handleSendTemplateEmail(c *gin.Context) {
	var req struct {
		To       string `json:"to" binding:"required,email"`
		Template string `json:"template" binding:"required"`
		Data     map[string]interface{} `json:"data"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Template email başarıyla gönderildi",
		"email": gin.H{
			"to":       req.To,
			"template": req.Template,
			"data":     req.Data,
			"status":   "sent",
			"message_id": "template-email-123",
		},
	})
}

func handleGetEmailTemplates(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Email templates list",
		"templates": []gin.H{
			{
				"id":          "welcome",
				"name":        "Hoş Geldiniz",
				"subject":     "EmlakOS Türkiye'ye Hoş Geldiniz",
				"description": "Yeni kullanıcı kayıt email şablonu",
			},
			{
				"id":          "property_update",
				"name":        "Mülk Güncelleme",
				"subject":     "Mülk Bilgileri Güncellendi",
				"description": "Mülk bilgileri değişiklik bildirimi",
			},
			{
				"id":          "valuation_complete",
				"name":        "Değerleme Tamamlandı",
				"subject":     "Mülk Değerleme Raporunuz Hazır",
				"description": "AI değerleme sonuç bildirimi",
			},
		},
	})
}

func handleSendSMS(c *gin.Context) {
	var req struct {
		To      string `json:"to" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "SMS başarıyla gönderildi",
		"sms": gin.H{
			"to":      req.To,
			"message": req.Message,
			"status":  "sent",
			"message_id": "sms-123",
		},
	})
}

func handleSendBulkSMS(c *gin.Context) {
	var req struct {
		To      []string `json:"to" binding:"required"`
		Message string   `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Toplu SMS başarıyla gönderildi",
		"bulk_sms": gin.H{
			"recipients": len(req.To),
			"message":    req.Message,
			"status":     "sent",
			"batch_id":   "bulk-sms-123",
		},
	})
}

func handleSendPushNotification(c *gin.Context) {
	var req struct {
		UserID  string `json:"user_id" binding:"required"`
		Title   string `json:"title" binding:"required"`
		Body    string `json:"body" binding:"required"`
		Data    map[string]interface{} `json:"data"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Push notification başarıyla gönderildi",
		"push": gin.H{
			"user_id": req.UserID,
			"title":   req.Title,
			"body":    req.Body,
			"data":    req.Data,
			"status":  "sent",
			"message_id": "push-123",
		},
	})
}

func handleBroadcastPush(c *gin.Context) {
	var req struct {
		Title string `json:"title" binding:"required"`
		Body  string `json:"body" binding:"required"`
		Data  map[string]interface{} `json:"data"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"message": "Broadcast push notification başarıyla gönderildi",
		"broadcast": gin.H{
			"title":   req.Title,
			"body":    req.Body,
			"data":    req.Data,
			"status":  "sent",
			"batch_id": "broadcast-push-123",
		},
	})
}

func handleGetDevices(c *gin.Context) {
	userID := c.Query("user_id")
	
	c.JSON(200, gin.H{
		"message": "User devices list",
		"user_id": userID,
		"devices": []gin.H{
			{
				"id":           "device-1",
				"type":         "android",
				"token":        "fcm-token-123",
				"last_active":  "2024-01-15T10:30:00Z",
				"is_active":    true,
			},
			{
				"id":           "device-2",
				"type":         "ios",
				"token":        "apns-token-456",
				"last_active":  "2024-01-15T09:15:00Z",
				"is_active":    true,
			},
		},
	})
}
