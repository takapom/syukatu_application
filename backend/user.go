package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// -- User model & auth
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var users = map[string]string{
	"takapom": "takapom",
}

// Login handler
func Login(c *gin.Context) {
	var input User
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "リクエストが正しい形式ではありません"})
		return
	}
	if pw, ok := users[input.Username]; ok && pw == input.Password {
		c.JSON(http.StatusOK, gin.H{"message": "ログイン成功"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "ユーザー名またはパスワードが違います"})
	}
}
