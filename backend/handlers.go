package main

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// authMiddleware はリクエストヘッダーから JWT を検証し、userID をコンテキストにセットします
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token required"})
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		claims, err := ParseJWT(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// registerHandler は新規ユーザー登録を行うハンドラを返します
func registerHandler(db *gorm.DB) gin.HandlerFunc {
	type req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	return func(c *gin.Context) {
		var body req
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		pwHash, err := HashPassword(body.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "hash error"})
			return
		}
		if _, err := createUser(db, body.Email, pwHash); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"email": body.Email})
	}
}

// loginHandler はログイン認証を行い、JWT を返すハンドラを返します
func loginHandler(db *gorm.DB) gin.HandlerFunc {
	type req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	return func(c *gin.Context) {
		var body req
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		u, err := getUserByEmail(db, body.Email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		if err := CheckPassword(u.Password, body.Password); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		token, err := GenerateJWT(u.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "token error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}

// createCompanyListHandler は新規 CompanyList 作成のハンドラ
func createCompanyListHandler(db *gorm.DB) gin.HandlerFunc {
	type req struct {
		Company    string `json:"company" binding:"required"`
		Occupation string `json:"occupation"`
		Member     int    `json:"member" binding:"required"`
		Selection  string `json:"selection"`
		Intern     bool   `json:"intern"`
	}
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		var body req
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		cl, err := createCompanyList(
			db,
			userID,
			body.Company,
			body.Occupation,
			body.Member,
			body.Selection,
			body.Intern,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, cl)
	}
}

// listCompanyListsHandler はユーザーの CompanyList 一覧を返すハンドラ
func listCompanyListsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		list, err := listCompanyLists(db, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, list)
	}
}

// updateCompanyListHandler は既存 CompanyList 更新のハンドラ
func updateCompanyListHandler(db *gorm.DB) gin.HandlerFunc {
	type req struct {
		Company    string `json:"company" binding:"required"`
		Occupation string `json:"occupation"`
		Member     int    `json:"member" binding:"required"`
		Selection  string `json:"selection"`
		Intern     bool   `json:"intern"`
	}
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		var body req
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var id uint
		fmt.Sscanf(c.Param("id"), "%d", &id)
		if err := updateCompanyList(
			db,
			id,
			userID,
			body.Company,
			body.Occupation,
			body.Member,
			body.Selection,
			body.Intern,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.Status(http.StatusNoContent)
	}
}

// deleteCompanyListHandler は既存 CompanyList 削除のハンドラ
func deleteCompanyListHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetUint("userID")
		var id uint
		fmt.Sscanf(c.Param("id"), "%d", &id)
		if err := deleteCompanyList(db, id, userID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.Status(http.StatusNoContent)
	}
}
