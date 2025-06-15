package main

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex;not null"`
	Password string `gorm:"not null"` // bcrypt でハッシュ化したものを保存
}

// 企業名
// 職種
// 従業員人数
// 選考状況
// 　インターンの有無
type CompanyList struct {
	gorm.Model
	Company    string `gorm:"not null"`
	Occupation string
	Member     int `gorm:"index;not null"`
	Selection  string
	Intern     bool
	UserID     uint `gorm:"index;not null"`
}

//後々にインターンモデルも作成予定
