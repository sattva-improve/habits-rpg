# Habits RPG 🎮

習慣管理とRPG要素を組み合わせたゲーミフィケーションアプリケーション

## 📋 概要

日々の習慣達成によって経験値を獲得し、キャラクターを成長させるアプリケーションです。

### 主な機能

- **習慣管理**: 日次/週次の習慣を登録・追跡
- **レベルシステム**: 習慣達成で経験値を獲得、Lv.99まで成長
- **ステータス**: 6つのステータス（VIT/INT/MND/DEX/CHA/STR）を育成
- **称号システム**: 条件を満たすと称号（ジョブ）を解放
- **実績システム**: 様々な条件で実績を解除
- **キャラクターカスタマイズ**: 男女選択、ドット絵アバター

## 🏗️ アーキテクチャ

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│                     localhost:3001 / Hosting                    │
├─────────────────────────────────────────────────────────────────┤
│                       AWS Amplify Gen2                          │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Cognito    │   AppSync    │     S3       │     Lambda        │
│   (認証)     │  (GraphQL)   │ (ストレージ)  │   (Functions)     │
├──────────────┴──────────────┴──────────────┴───────────────────┤
│                        DynamoDB                                 │
│            (User, Habit, Achievement, Job, etc.)               │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## 📁 プロジェクト構造

\`\`\`
Habits-rpg/
├── amplify/                    # AWS Amplify バックエンド
│   ├── auth/                   # 認証設定 (Cognito)
│   ├── data/                   # データスキーマ (DynamoDB + AppSync)
│   ├── storage/                # ストレージ設定 (S3)
│   ├── functions/              # Lambda関数
│   │   ├── record-habit/       # 習慣記録処理
│   │   ├── check-achievements/ # 実績判定
│   │   ├── check-jobs/         # 称号判定
│   │   └── calculate-stats/    # 統計計算
│   └── helpers/                # 共通ヘルパー
├── frontend/                   # Reactフロントエンド
│   ├── src/
│   │   ├── components/         # UIコンポーネント
│   │   ├── contexts/           # React Context
│   │   ├── pages/              # ページコンポーネント
│   │   ├── services/           # APIサービス
│   │   └── lib/                # ユーティリティ
│   └── public/
│       └── sprites/            # キャラクタードット絵
├── shared/                     # フロント・バックエンド共通型定義
├── docs/                       # ドキュメント
└── tests/                      # テスト
\`\`\`

## 🚀 セットアップ

### 前提条件

- Node.js 18+
- AWS CLI (設定済み)
- AWS アカウント

### インストール

\`\`\`bash
# リポジトリのクローン
git clone https://github.com/your-repo/Habits-rpg.git
cd Habits-rpg

# バックエンド依存関係
npm install

# フロントエンド依存関係
cd frontend && pnpm install
\`\`\`

### 開発サーバー起動

\`\`\`bash
# バックエンド (Sandbox)
make sandbox

# フロントエンド (別ターミナル)
make dev
\`\`\`

### 本番デプロイ

\`\`\`bash
make deploy
\`\`\`

## 🔧 AWSリソース

### 使用サービス

| サービス | 用途 | 料金目安 |
|----------|------|----------|
| **Cognito** | ユーザー認証 | 50,000 MAU まで無料 |
| **AppSync** | GraphQL API | 250,000 クエリ/月まで無料 |
| **DynamoDB** | データベース | 25GB まで無料枠 |
| **S3** | 画像ストレージ | 5GB まで無料枠 |
| **Lambda** | サーバーレス関数 | 100万リクエスト/月まで無料 |

### DynamoDB テーブル

| テーブル | 説明 | キー |
|----------|------|------|
| User | ユーザー情報・ステータス | userId (PK) |
| Habit | 習慣定義 | habitId (PK) |
| HabitRecord | 習慣達成記録 | recordId (PK) |
| Achievement | 実績マスター | achievementId (PK) |
| UserAchievement | ユーザー実績進捗 | id (PK) |
| Job | 称号マスター | jobId (PK) |
| UserJob | ユーザー称号解放状態 | id (PK) |

### S3 バケット構造

\`\`\`
habitsRpgStorage/
├── sprites/              # スプライト画像 (公開読み取り)
│   ├── male/             # 男性キャラクター
│   ├── female/           # 女性キャラクター
│   └── backgrounds/      # 背景画像
├── avatars/{userId}/     # ユーザーアバター (所有者のみ)
└── user-sprites/{userId}/ # カスタムスプライト
\`\`\`

## 🎮 ゲームシステム

### 経験値計算

\`\`\`
基本EXP = 15
難易度ボーナス = { easy: 0.5, normal: 1.0, hard: 1.5, very_hard: 2.0 }
ストリークボーナス = { 3日: 1.1, 7日: 1.25, 14日: 1.5, 30日: 2.0, 60日: 2.5 }

獲得EXP = 基本EXP × 難易度ボーナス × ストリークボーナス × ジョブボーナス
\`\`\`

### レベルアップ

\`\`\`
必要EXP = 15 × (1.02 ^ (現在レベル - 1))
最大レベル = 99
\`\`\`

### ステータス

| ステータス | 略称 | 関連習慣カテゴリ |
|-----------|------|-----------------|
| 体力 | VIT | 運動、睡眠、健康 |
| 知力 | INT | 読書、勉強、学習 |
| 精神 | MND | 瞑想、日記、マインドフルネス |
| 器用 | DEX | 音楽、アート、クラフト |
| 魅力 | CHA | コミュニケーション、社交 |
| 筋力 | STR | 筋トレ、スポーツ |

### 称号（ジョブ）

| Tier | 称号例 | 解放条件 |
|------|--------|----------|
| Novice | ビギナー | 初期状態 |
| Apprentice | 見習い戦士 | STR 5以上 |
| Journeyman | 戦士 | Lv.15, STR 10, 見習い戦士解放済 |
| Expert | 騎士 | Lv.30, STR 20, VIT 10, 戦士解放済 |

## 🛠️ 開発コマンド

\`\`\`bash
# Makefileで実行可能なコマンド一覧
make help

# よく使うコマンド
make dev          # フロントエンド開発サーバー
make sandbox      # バックエンド Sandbox
make deploy       # 本番デプロイ
make lint         # Lint実行
make format       # フォーマット
make seed         # シードデータ投入 (コンソール)
\`\`\`

## 🔐 セキュリティ

### 認証

- Cognito User Pools による認証
- JWT トークンベースのAPI認可
- オーナーベースのアクセス制御

### データアクセス制御

- ユーザーデータは本人のみ読み書き可能
- マスターデータ（Achievement, Job）は認証ユーザーが読み取り可能
- スプライト画像は全ユーザー読み取り可能

## 🐛 トラブルシューティング

### Sandbox が起動しない

\`\`\`bash
# AWS認証情報を確認
aws sts get-caller-identity

# Sandboxをリセット
npx ampx sandbox delete
npx ampx sandbox
\`\`\`

### シードデータが投入できない

\`\`\`bash
# ブラウザコンソールで実行 (開発環境のみ)
window.seedService.reseedAll()
\`\`\`

### GraphQLエラーが発生する

\`\`\`bash
# DynamoDBテーブルを確認
aws dynamodb list-tables --region us-east-1
\`\`\`

## 📄 ライセンス

MIT License

## 👥 貢献

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request
