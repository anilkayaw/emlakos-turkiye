package main

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

// Database connection
var db *sql.DB

// JWT Secret
var jwtSecret []byte

// User struct
type User struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	FirstName         string    `json:"first_name"`
	LastName          string    `json:"last_name"`
	Phone             string    `json:"phone"`
	UserType          string    `json:"user_type"`
	IsVerified        bool      `json:"is_verified"`
	IsActive          bool      `json:"is_active"`
	CreatedAt         time.Time `json:"created_at"`
	LastLoginAt       *time.Time `json:"last_login_at"`
	FailedLoginAttempts int     `json:"failed_login_attempts"`
	LockedUntil       *time.Time `json:"locked_until"`
}

// JWT Claims
type Claims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	UserType string `json:"user_type"`
	jwt.RegisteredClaims
}

// Register Request
type RegisterRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=8"`
	FirstName string `json:"first_name" binding:"required,min=2"`
	LastName  string `json:"last_name" binding:"required,min=2"`
	Phone     string `json:"phone"`
	UserType  string `json:"user_type" binding:"required,oneof=buyer seller agent"`
}

// Login Request
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Password Reset Request
type PasswordResetRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// Password Reset Confirm Request
type PasswordResetConfirmRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

func main() {
	// Environment variables yükle
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	// JWT Secret
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		jwtSecret = []byte("EmlakOS2024!SuperSecretJWTKey")
		log.Println("Warning: Using default JWT secret")
	}

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
	api := router.Group("/api/auth")
	{
		api.POST("/register", handleRegister)
		api.POST("/login", handleLogin)
		api.POST("/logout", authMiddleware(), handleLogout)
		api.GET("/me", authMiddleware(), handleGetProfile)
		api.PUT("/me", authMiddleware(), handleUpdateProfile)
		api.POST("/refresh", handleRefreshToken)
		api.POST("/forgot-password", handleForgotPassword)
		api.POST("/reset-password", handleResetPassword)
		api.POST("/verify-email", handleVerifyEmail)
		api.POST("/resend-verification", handleResendVerification)
		api.GET("/health", handleHealth)
	}

	// Port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("🔐 EmlakOS Türkiye Auth Service başlatılıyor... Port: %s", port)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Auth Service başlatılamadı:", err)
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

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)

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

// Password hashing
func hashPassword(password string) (string, string, error) {
	// Salt oluştur
	salt := make([]byte, 32)
	if _, err := rand.Read(salt); err != nil {
		return "", "", err
	}
	saltHex := hex.EncodeToString(salt)

	// Password + salt hash'le
	hasher := sha256.New()
	hasher.Write([]byte(password + saltHex))
	passwordHash := hex.EncodeToString(hasher.Sum(nil))

	// Bcrypt ile ek güvenlik
	bcryptHash, err := bcrypt.GenerateFromPassword([]byte(passwordHash), 12)
	if err != nil {
		return "", "", err
	}

	return string(bcryptHash), saltHex, nil
}

// Password verification
func verifyPassword(password, hash, salt string) bool {
	// Password + salt hash'le
	hasher := sha256.New()
	hasher.Write([]byte(password + salt))
	passwordHash := hex.EncodeToString(hasher.Sum(nil))

	// Bcrypt ile doğrula
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(passwordHash))
	return err == nil
}

// JWT token oluştur
func generateJWT(user *User) (string, string, error) {
	// Access token (15 dakika)
	accessClaims := &Claims{
		UserID:   user.ID,
		Email:    user.Email,
		UserType: user.UserType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, err := accessToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	// Refresh token (7 gün)
	refreshClaims := &Claims{
		UserID:   user.ID,
		Email:    user.Email,
		UserType: user.UserType,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, err := refreshToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
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

// Handler functions
func handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "OK",
		"service": "EmlakOS Türkiye Auth Service",
		"version": "1.0.0",
		"time":    time.Now().UTC(),
	})
}

func handleRegister(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı", "details": err.Error()})
		return
	}

	// Email kontrolü
	var existingUserID string
	err := db.QueryRow("SELECT id FROM emlakos.users WHERE email = $1", req.Email).Scan(&existingUserID)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Bu email adresi zaten kullanılıyor"})
		return
	}

	// Password hash'le
	passwordHash, salt, err := hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Şifre hash'lenemedi"})
		return
	}

	// Kullanıcı oluştur
	var userID string
	err = db.QueryRow(`
		INSERT INTO emlakos.users (email, password_hash, salt, first_name, last_name, phone, user_type)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, req.Email, passwordHash, salt, req.FirstName, req.LastName, req.Phone, req.UserType).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Kullanıcı oluşturulamadı"})
		return
	}

	// User profile oluştur
	_, err = db.Exec(`
		INSERT INTO emlakos.user_profiles (user_id)
		VALUES ($1)
	`, userID)

	if err != nil {
		log.Printf("User profile oluşturulamadı: %v", err)
	}

	// JWT token oluştur
	user := &User{
		ID:        userID,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Phone:     req.Phone,
		UserType:  req.UserType,
	}

	accessToken, refreshToken, err := generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token oluşturulamadı"})
		return
	}

	// Session kaydet
	_, err = db.Exec(`
		INSERT INTO emlakos.user_sessions (user_id, token_hash, refresh_token_hash, expires_at)
		VALUES ($1, $2, $3, $4)
	`, userID, accessToken, refreshToken, time.Now().Add(7*24*time.Hour))

	if err != nil {
		log.Printf("Session kaydedilemedi: %v", err)
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Kullanıcı başarıyla oluşturuldu",
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"user_type":  user.UserType,
		},
		"tokens": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"expires_in":    900, // 15 dakika
		},
	})
}

func handleLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Kullanıcıyı bul
	var user User
	var passwordHash, salt string
	err := db.QueryRow(`
		SELECT id, email, password_hash, salt, first_name, last_name, phone, user_type, 
		       is_verified, is_active, created_at, last_login_at, failed_login_attempts, locked_until
		FROM emlakos.users 
		WHERE email = $1
	`, req.Email).Scan(&user.ID, &user.Email, &passwordHash, &salt, &user.FirstName, &user.LastName,
		&user.Phone, &user.UserType, &user.IsVerified, &user.IsActive, &user.CreatedAt,
		&user.LastLoginAt, &user.FailedLoginAttempts, &user.LockedUntil)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz email veya şifre"})
		return
	}

	// Hesap kilitli mi kontrol et
	if user.LockedUntil != nil && user.LockedUntil.After(time.Now()) {
		c.JSON(http.StatusLocked, gin.H{"error": "Hesap geçici olarak kilitlendi"})
		return
	}

	// Şifre doğrula
	if !verifyPassword(req.Password, passwordHash, salt) {
		// Başarısız giriş sayısını artır
		failedAttempts := user.FailedLoginAttempts + 1
		var lockedUntil *time.Time
		
		if failedAttempts >= 5 {
			lockTime := time.Now().Add(30 * time.Minute)
			lockedUntil = &lockTime
		}

		db.Exec(`
			UPDATE emlakos.users 
			SET failed_login_attempts = $1, locked_until = $2
			WHERE id = $3
		`, failedAttempts, lockedUntil, user.ID)

		c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz email veya şifre"})
		return
	}

	// Başarılı giriş - sayaçları sıfırla
	db.Exec(`
		UPDATE emlakos.users 
		SET failed_login_attempts = 0, locked_until = NULL, last_login_at = $1
		WHERE id = $2
	`, time.Now(), user.ID)

	// JWT token oluştur
	accessToken, refreshToken, err := generateJWT(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token oluşturulamadı"})
		return
	}

	// Session kaydet
	_, err = db.Exec(`
		INSERT INTO emlakos.user_sessions (user_id, token_hash, refresh_token_hash, expires_at)
		VALUES ($1, $2, $3, $4)
	`, user.ID, accessToken, refreshToken, time.Now().Add(7*24*time.Hour))

	if err != nil {
		log.Printf("Session kaydedilemedi: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Giriş başarılı",
		"user": gin.H{
			"id":         user.ID,
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"user_type":  user.UserType,
			"is_verified": user.IsVerified,
		},
		"tokens": gin.H{
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"expires_in":    900, // 15 dakika
		},
	})
}

func handleLogout(c *gin.Context) {
	userID := c.GetString("user_id")
	
	// Session'ı deaktive et
	_, err := db.Exec(`
		UPDATE emlakos.user_sessions 
		SET is_active = false 
		WHERE user_id = $1 AND is_active = true
	`, userID)

	if err != nil {
		log.Printf("Logout hatası: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Çıkış başarılı"})
}

func handleGetProfile(c *gin.Context) {
	userID := c.GetString("user_id")
	
	var user User
	err := db.QueryRow(`
		SELECT id, email, first_name, last_name, phone, user_type, 
		       is_verified, is_active, created_at, last_login_at
		FROM emlakos.users 
		WHERE id = $1
	`, userID).Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName,
		&user.Phone, &user.UserType, &user.IsVerified, &user.IsActive,
		&user.CreatedAt, &user.LastLoginAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func handleUpdateProfile(c *gin.Context) {
	userID := c.GetString("user_id")
	
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	_, err := db.Exec(`
		UPDATE emlakos.users 
		SET first_name = $1, last_name = $2, phone = $3, updated_at = $4
		WHERE id = $5
	`, req.FirstName, req.LastName, req.Phone, time.Now(), userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Profil güncellenemedi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profil başarıyla güncellendi"})
}

func handleRefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token gerekli"})
		return
	}

	claims, err := validateJWT(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz refresh token"})
		return
	}

	// Yeni access token oluştur
	user := &User{
		ID:       claims.UserID,
		Email:    claims.Email,
		UserType: claims.UserType,
	}

	accessToken, _, err := generateJWT(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token oluşturulamadı"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": accessToken,
		"expires_in":   900, // 15 dakika
	})
}

func handleForgotPassword(c *gin.Context) {
	var req PasswordResetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Kullanıcıyı bul
	var userID string
	err := db.QueryRow("SELECT id FROM emlakos.users WHERE email = $1", req.Email).Scan(&userID)
	if err != nil {
		// Güvenlik için her zaman başarılı mesaj döndür
		c.JSON(http.StatusOK, gin.H{"message": "Şifre sıfırlama linki email adresinize gönderildi"})
		return
	}

	// Reset token oluştur
	token := make([]byte, 32)
	rand.Read(token)
	tokenHex := hex.EncodeToString(token)

	// Token'ı veritabanına kaydet (1 saat geçerli)
	_, err = db.Exec(`
		INSERT INTO emlakos.password_reset_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
	`, userID, tokenHex, time.Now().Add(1*time.Hour))

	if err != nil {
		log.Printf("Reset token kaydedilemedi: %v", err)
	}

	// TODO: Email gönder
	log.Printf("Password reset token for user %s: %s", userID, tokenHex)

	c.JSON(http.StatusOK, gin.H{"message": "Şifre sıfırlama linki email adresinize gönderildi"})
}

func handleResetPassword(c *gin.Context) {
	var req PasswordResetConfirmRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Token'ı kontrol et
	var userID string
	err := db.QueryRow(`
		SELECT user_id FROM emlakos.password_reset_tokens 
		WHERE token_hash = $1 AND expires_at > $2 AND used_at IS NULL
	`, req.Token, time.Now()).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veya süresi dolmuş token"})
		return
	}

	// Yeni şifre hash'le
	passwordHash, salt, err := hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Şifre hash'lenemedi"})
		return
	}

	// Şifreyi güncelle
	_, err = db.Exec(`
		UPDATE emlakos.users 
		SET password_hash = $1, salt = $2, updated_at = $3
		WHERE id = $4
	`, passwordHash, salt, time.Now(), userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Şifre güncellenemedi"})
		return
	}

	// Token'ı kullanıldı olarak işaretle
	db.Exec(`
		UPDATE emlakos.password_reset_tokens 
		SET used_at = $1
		WHERE token_hash = $2
	`, time.Now(), req.Token)

	// Tüm session'ları deaktive et
	db.Exec(`
		UPDATE emlakos.user_sessions 
		SET is_active = false 
		WHERE user_id = $1
	`, userID)

	c.JSON(http.StatusOK, gin.H{"message": "Şifre başarıyla sıfırlandı"})
}

func handleVerifyEmail(c *gin.Context) {
	var req struct {
		Token string `json:"token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token gerekli"})
		return
	}

	// Token'ı kontrol et ve kullanıcıyı doğrula
	var userID string
	err := db.QueryRow(`
		SELECT user_id FROM emlakos.email_verification_tokens 
		WHERE token_hash = $1 AND expires_at > $2 AND verified_at IS NULL
	`, req.Token, time.Now()).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veya süresi dolmuş token"})
		return
	}

	// Kullanıcıyı doğrulanmış olarak işaretle
	_, err = db.Exec(`
		UPDATE emlakos.users 
		SET is_verified = true, email_verified_at = $1
		WHERE id = $2
	`, time.Now(), userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Email doğrulanamadı"})
		return
	}

	// Token'ı kullanıldı olarak işaretle
	db.Exec(`
		UPDATE emlakos.email_verification_tokens 
		SET verified_at = $1
		WHERE token_hash = $2
	`, time.Now(), req.Token)

	c.JSON(http.StatusOK, gin.H{"message": "Email başarıyla doğrulandı"})
}

func handleResendVerification(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz veri formatı"})
		return
	}

	// Kullanıcıyı bul
	var userID string
	var isVerified bool
	err := db.QueryRow(`
		SELECT id, is_verified FROM emlakos.users WHERE email = $1
	`, req.Email).Scan(&userID, &isVerified)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	if isVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email zaten doğrulanmış"})
		return
	}

	// Yeni verification token oluştur
	token := make([]byte, 32)
	rand.Read(token)
	tokenHex := hex.EncodeToString(token)

	// Token'ı veritabanına kaydet (24 saat geçerli)
	_, err = db.Exec(`
		INSERT INTO emlakos.email_verification_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
	`, userID, tokenHex, time.Now().Add(24*time.Hour))

	if err != nil {
		log.Printf("Verification token kaydedilemedi: %v", err)
	}

	// TODO: Email gönder
	log.Printf("Email verification token for user %s: %s", userID, tokenHex)

	c.JSON(http.StatusOK, gin.H{"message": "Doğrulama linki email adresinize gönderildi"})
}
