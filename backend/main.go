package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	// CORS 設定…
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Auth
	r.POST("/login", Login)

	// Products
	r.GET("/products", listProducts)
	r.GET("/products/:id", getProduct)

	// Cart
	r.POST("/cart", addToCart)
	r.GET("/cart/:userID", viewCart)
	r.POST("/checkout/:userID", checkout)

	r.Run(":8080")
}
