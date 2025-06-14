package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// -- Product model & handlers
type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var products = []Product{
	{ID: 1, Name: "Tシャツ", Price: 2500},
	{ID: 2, Name: "スニーカー", Price: 7500},
	{ID: 3, Name: "キャップ", Price: 1800},
}

func listProducts(c *gin.Context) {
	c.JSON(http.StatusOK, products)
}

func getProduct(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid product ID"})
		return
	}
	for _, p := range products {
		if p.ID == id {
			c.JSON(http.StatusOK, p)
			return
		}
	}
	c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
}
