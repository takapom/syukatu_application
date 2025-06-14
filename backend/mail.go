package main

import (
	"fmt"
	"time"
)

// メール送信処理のための関数
func sendOrderConfirmationEmail(userID int, total float64) {
	time.Sleep(2 * time.Second)
	fmt.Printf("[メール送信完了] userID=%d, 金額=%.2f 円\n", userID, total)
}
