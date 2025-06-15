package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func openGormDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("example.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	// マイグレーション：User, Todo テーブルを自動作成／更新
	if err := db.AutoMigrate(&User{}, &CompanyList{}); err != nil {
		return nil, err
	}
	return db, nil
}
