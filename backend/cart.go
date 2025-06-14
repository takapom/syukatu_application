package main

import (
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
)

// -- Cart model & handlers
type CartItem struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type Cart struct {
	UserID int        `json:"user_id"`
	Items  []CartItem `json:"items"`
}

type addToCartRequest struct {
	UserID    int `json:"user_id"`
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

var (
	carts   = map[int]*Cart{}
	cartsMu sync.Mutex
)

func addToCart(c *gin.Context) {
	var req addToCartRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cartsMu.Lock()
	defer cartsMu.Unlock()
	cart, ok := carts[req.UserID]
	if !ok {
		cart = &Cart{UserID: req.UserID}
		carts[req.UserID] = cart
	}
	updated := false
	for i := range cart.Items {
		if cart.Items[i].ProductID == req.ProductID {
			cart.Items[i].Quantity += req.Quantity
			updated = true
			break
		}
	}
	if !updated {
		cart.Items = append(cart.Items, CartItem{req.ProductID, req.Quantity})
	}
	c.JSON(http.StatusOK, cart)
}

func viewCart(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userID"})
		return
	}
	cartsMu.Lock()
	cart, ok := carts[userID]
	cartsMu.Unlock()
	if !ok || len(cart.Items) == 0 {
		c.JSON(http.StatusOK, gin.H{"items": []CartItem{}})
		return
	}
	c.JSON(http.StatusOK, cart)
}

func checkout(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("userID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userID"})
		return
	}
	cartsMu.Lock()
	cart, ok := carts[userID]
	if !ok {
		cartsMu.Unlock()
		c.JSON(http.StatusBadRequest, gin.H{"error": "cart is empty"})
		return
	}
	total := 0.0
	for _, item := range cart.Items {
		for _, p := range products {
			if p.ID == item.ProductID {
				total += p.Price * float64(item.Quantity)
			}
		}
	}
	delete(carts, userID)
	cartsMu.Unlock()

	c.JSON(http.StatusOK, gin.H{"message": "checkout successful", "total_paid": total})
	go sendOrderConfirmationEmail(userID, total)
}
