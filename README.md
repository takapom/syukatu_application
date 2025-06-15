# Sample Go Gin + GORM を使ったユーザー認証付き 就活管理アプリ

#  Go Gin + GORM を使ったユーザー認証付き 就活管理アプリ

## 📌 アプリの概要

このアプリは、就職活動中の学生が**自分だけのToDoリスト（企業名・タスク・インターン情報など）を記録・管理できる**ように設計されたシンプルなWeb APIアプリです。Go言語のフレームワークであるGinと、ORMライブラリGORMを用いて、高速で安全な認証付きAPIを構築しています。

## 🎯 アプリの目的

- **学習目的**：Gin・GORM・JWT・認証機構などのWebアプリ開発スキルの習得
- **就活支援**：エントリー企業やタスクの進捗状況を効率よく整理・記録することで、就活をスマートに進める
- **セキュリティの理解**：ユーザーごとのデータ管理やJWT認証の実装を通じて、現代的なWebアプリのセキュリティに触れる

## 👥 対象ユーザー

- Go/Gin/GORMの学習をしたい**初〜中級のバックエンドエンジニア**
- 自分専用の就活管理ツールを作ってみたい**学生開発者**
- 認証付きのCRUD APIの構築方法を理解したい**技術志向のエンジニア志望者**

## 🧰 技術スタックと選定理由

- **Go**  
  高速な実行速度とシンプルな構文を兼ね備えた言語で、Web APIの開発にも適しています。静的型付けによりバグを事前に検出しやすく、保守性にも優れています。

- **Gin（Webフレームワーク）**  
  GoでWebアプリケーションを開発する際の定番フレームワークで、ルーティング処理やミドルウェアの導入が直感的かつ高速に行える点が特徴です。

- **GORM（ORMライブラリ）**  
  SQLを直接記述することなく、Goの構造体を使ってデータベース操作を簡潔に記述できるORM（Object Relational Mapper）です。初心者でも扱いやすく、保守性の高いコードが書けます。

- **SQLite3（データベース）**  
  ファイル単体で動作する軽量なデータベースで、サーバーの準備が不要なため、ローカル開発や学習用途に最適です。

- **JWT（JSON Web Token）**  
  セッションレスな認証方式として採用しており、トークンによるユーザー認証の仕組みを学ぶのに適しています。モダンなフロントエンドとの連携も視野に入れています。

- **bcrypt（パスワードハッシュ化）**  
  パスワードをそのまま保存せず、安全にハッシュ化するためのライブラリです。セキュリティの基本である「パスワードの非可逆変換」の実践例として組み込んでいます。

- **curl / Postman（APIクライアント）**  
  フロントエンドが未実装でも、API単体で動作確認ができるようにするためのツールとして活用しています。テストやデバッグに便利です。

---

| レイヤー                       | 主なファイル              | 中身                                                                                                     |
| ------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| プレゼンテーション層           | `main.go` / `handlers.go` | HTTP リクエスト →JSON バインド／ステータスコード返却                                                     |
| ビジネスロジック層             | **`handlers.go`**         | ・パスワードハッシュ化／チェック<br>・JWT 発行<br>・エラー条件分岐（未登録なら弾く、所有者チェック）など |
| データアクセス（Repository）層 | `repository.go`           | DB への SQL（GORM）操作：CRUD をメソッドとしてまとめる                                                   |

## 🌟 主な機能

- **ユーザー登録** (`/register`)
- **ログイン** (`/login`) → JWT 発行
- **ToDo CRUD** (`/todos` 以下)※認証必須

  - Create: `POST /todos`
  - Read: `GET /todos`
  - Update: `PUT /todos/:id`
  - Delete: `DELETE /todos/:id`

---

## 🚀 動作環境・前提条件

- Go 1.20 以上
- SQLite3
- 環境変数 `JWT_SECRET` に、十分ランダムな文字列を設定
- (オプション) `curl` や Postman などの API クライアント

---

## 📦 インストール手順

以下の手順でローカル開発環境を立ち上げられます。

1. **リポジトリをクローン**

   ```bash
   git clone <このリポジトリのURL>
   cd <リポジトリ名>/backend
   ```

2. **依存パッケージを取得**

   ```bash
   go mod tidy
   ```

3. **環境変数を設定**

   ```bash
   export JWT_SECRET="あなたのランダムなシークレット文字列"
   ```

4. **サーバーを起動**

   ```bash
   go run main.go
   ```

   - デフォルトで `localhost:8080` でリッスンします。
   - サーバー起動時に `example.db` がなければ作成され、`users`・`todos` テーブルが自動でマイグレーションされます。

---

## 🔍 API リファレンス

### 1. ユーザー登録 (Register)

- **エンドポイント**: `POST /register`
- **リクエストヘッダー**: `Content-Type: application/json`
- **リクエストボディ**:

  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

- **レスポンス**: `201 Created`

  ```json
  {
    "user": "user@example.com"
  }
  ```

### 2. ログイン (Login)

- **エンドポイント**: `POST /login`
- **リクエストヘッダー**: `Content-Type: application/json`
- **リクエストボディ**:

  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```

- **レスポンス**: `200 OK`

  ```json
  {
    "token": "<JWT トークン>"
  }
  ```

### 3. ToDo 管理 (認証必須)

下記エンドポイント呼び出し時は、必ず HTTP ヘッダーに `Authorization: Bearer <JWT トークン>` を付与してください。

#### a. ToDo 作成

- **エンドポイント**: `POST /todos`
- **リクエストヘッダー**:

  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT トークン>`

- **リクエストボディ**:

  ```json
  {
    "title": "タスクのタイトル",
    "intern": true
  }
  ```

- **レスポンス**: `201 Created`

  ```json
  {
    "ID": 1,
    "Title": "タスクのタイトル",
    "Intern": true,
    "UserID": 1,
    "CreatedAt": "2025-06-15T12:00:00Z",
    …
  }
  ```

#### b. ToDo 一覧取得

- **エンドポイント**: `GET /todos`
- **リクエストヘッダー**: `Authorization: Bearer <JWT トークン>`
- **レスポンス**: `200 OK`

  ```json
  [
    { "ID":1, "Title":"〜", "Intern":true, … },
    { "ID":2, "Title":"〜", "Intern":false, … }
  ]
  ```

#### c. ToDo 更新

- **エンドポイント**: `PUT /todos/:id`
- **リクエストヘッダー**: 同上
- **リクエストボディ**:

  ```json
  {
    "title": "更新後のタイトル",
    "completed": true,
    "intern": false
  }
  ```

- **レスポンス**: `204 No Content`

#### d. ToDo 削除

- **エンドポイント**: `DELETE /todos/:id`
- **リクエストヘッダー**: 同上
- **レスポンス**: `204 No Content`

---

## 📁 プロジェクト構成

```
backend/
│
├─ main.go         # エントリポイント・ルーティング設定
├─ database.go     # GORM 接続 & AutoMigrate
├─ models.go       # User, Todo の構造体定義 (ORM モデル)
├─ repository.go   # DB 操作 (CRUD) をまとめた関数群
├─ auth.go         # bcrypt パスワード & JWT 発行/検証
└─ handlers.go     # Gin ハンドラ (認証・ToDo API)
```

---

## 🛠️ 開発・運用のヒント

- **環境変数管理**: `.env` ファイル + `godotenv` ライブラリで読み込む方式もおすすめ
- **本番マイグレーション**: GORM の `AutoMigrate` は簡易的。大規模運用では `golang-migrate` などの専用ツール併用を検討
- **セキュリティ**: HTTPS 経由でアクセスし、JWT の秘密鍵は外部サービス (Vault など) で管理
- **テスト**: `repository.go` の関数単体テスト・`auth.go` の JWT テストを充実させると品質向上

---

## 📄 ライセンス

MIT License

---
