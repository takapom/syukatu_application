package main

import "gorm.io/gorm"

// 新規ユーザーの登録
func createUser(db *gorm.DB, email, pwHash string) (*User, error) {
	u := &User{Email: email, Password: pwHash}
	if err := db.Create(u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

// とあるユーザーの全タスクをまとめて取得
func listCompanyLists(db *gorm.DB, userID uint) ([]CompanyList, error) {
	var lists []CompanyList
	// WHERE user_id = ? で自分のレコードだけを絞り込み、Find で全件取得
	if err := db.
		Where("user_id = ?", userID).
		Find(&lists).
		Error; err != nil {
		return nil, err
	}
	return lists, nil
}

// あるユーザーを1件取得
func getUserByEmail(db *gorm.DB, email string) (*User, error) {
	var u User
	if err := db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

// ログイン中のユーザーに紐ずくタスクを新規作成
func createCompanyList(
	db *gorm.DB,
	userID uint,
	company string,
	occupation string,
	member int,
	selection string,
	intern bool,
) (*CompanyList, error) {
	cl := &CompanyList{
		Company:    company,    // 企業名
		Occupation: occupation, // 職種
		Member:     member,     // 人数
		Selection:  selection,  // 選考ステータス
		Intern:     intern,     // インターン希望フラグ
		UserID:     userID,     // ユーザーとの紐付け
	}
	if err := db.Create(cl).Error; err != nil {
		return nil, err
	}
	return cl, nil
}

// ユーザーのタスクを更新
// idとuserIDを使い他人のデータを書き込まないように制御
// 返り値はerror型でnilかエラー情報のどちらか
func updateCompanyList(
	db *gorm.DB,
	id uint,
	userID uint,
	company string,
	occupation string,
	member int,
	selection string,
	intern bool) error {
	return db.Model(&CompanyList{}).Where("id=? AND user_id=?", id, userID).
		Updates(CompanyList{
			Company:    company,
			Occupation: occupation,
			Member:     member,
			Selection:  selection,
			Intern:     intern,
		}).Error
}

// ユーザーのタスクを削除
func deleteCompanyList(
	db *gorm.DB,
	id uint,
	userID uint,
) error {
	return db.Where("id = ? AND user_id = ?", id, userID).Delete(&CompanyList{}).Error
}



//インターンシップ情報の作成
func createInternship(
	db *gorm.DB,
    userID uint,
    title string,
    company string,
    dailystart int,
    dailyfinish int,
    content string,
    selection string,
    joined bool,
) (*Internship, error) {
	i := &Internship{
		UserID: userID,
		Title: title,
		Company: company,
		Dailystart: dailystart,
		Dailyfinish: dailyfinish,
		Content: content,
		Selection: selection,
		Joined: joined,
	}
	if err := db.Create(i).Error; err != nil{
		return nil, err
	}
	return i, nil
}

//インターンシップ情報の取得
func listInternships(db *gorm.DB, userID uint) ([]Internship, error){
	var internships []Internship
	//引数のuserIDを使いそれに該当するものを探し、見つけたら新しいinternshipsに格納
	if err := db.Where("user_id = ?", userID).Find(&internships).Error; err != nil{
		return nil, err
	}
	return internships, nil
}

//インターンシップ情報の更新
func updateInternship(
	db *gorm.DB,
	id uint,
	userID uint,
	title string,
	company string,
	dailystart int,
	dailyfinish int,
	content string,
	selection string,
	joined bool,
) error {
	//{}がないと初期化されない→中身が不定になる
	return db.Model(&Internship{}).
	Where("id = ? AND user_id = ?", id, userID).
	Updates(Internship{
		Title:       title,
		Company:     company,
		Dailystart:  dailystart,
		Dailyfinish: dailyfinish,
		Content:     content,
		Selection:   selection,
		Joined:      joined,
	}).Error
}

//削除処理
func deleteInternship(db *gorm.DB, id uint, userID uint) error{
	return db.Where("id = ? AND user_id = ?", id, userID).Delete(&Internship{}).Error
}

