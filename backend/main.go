package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// ① DB 接続＆マイグレーション
	db, err := openGormDB()
	if err != nil {
		log.Fatalf("DB 接続エラー: %v", err)
	}

	// ② Gin ルーター初期化
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // 許可するオリジン
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// 認証不要ルート
	r.POST("/register", registerHandler(db))
	r.POST("/login", loginHandler(db))

	// 認証ミドルウェアの適用
	auth := r.Group("/")
	auth.Use(authMiddleware())

	// CompanyList 用 CRUD
	auth.POST("/company_lists", createCompanyListHandler(db))
	auth.GET("/company_lists", listCompanyListsHandler(db))
	auth.PUT("/company_lists/:id", updateCompanyListHandler(db))
	auth.DELETE("/company_lists/:id", deleteCompanyListHandler(db))

	// インターンシップ用 CRUD
	auth.POST("/internships", createInternshipHandler(db))
	auth.GET("/internships", listInternshipsHandler(db))
	auth.PUT("/internships/:id", updateInternshipHandler(db))
	auth.DELETE("/internships/:id", deleteInternshipHandler(db))


	// サーバ起動
	log.Println("Server running on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("サーバ起動エラー: %v", err)
	}
}
