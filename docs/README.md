# 📚 ドキュメント

Habits-RPGプロジェクトのドキュメント一覧です。

## 目次

### 開発者向け

| ドキュメント | 説明 |
|-------------|------|
| [../README.md](../README.md) | プロジェクト概要・セットアップ |
| [DEPLOY.md](DEPLOY.md) | CI/CDデプロイ設定・GitHub Actions |
| [SECRETS.md](SECRETS.md) | シークレット管理・API Key |

### アセット作成

| ドキュメント | 説明 |
|-------------|------|
| [IMAGE_GENERATION.md](IMAGE_GENERATION.md) | キャラクター画像生成ガイド（Stable Diffusion） |
| [JOB_CREATION_GUIDE.md](JOB_CREATION_GUIDE.md) | 新規ジョブ（称号）追加ガイド |

### フロントエンド

| ドキュメント | 説明 |
|-------------|------|
| [frontend/GUIDELINES.md](frontend/GUIDELINES.md) | フロントエンド開発ガイドライン |
| [frontend/ATTRIBUTIONS.md](frontend/ATTRIBUTIONS.md) | サードパーティライセンス・謝辞 |

### テスト

| ドキュメント | 説明 |
|-------------|------|
| [testing/README.md](testing/README.md) | テスト実行方法・構成 |

### Issue設計ドキュメント

完了・進行中のIssueに関する設計ドキュメントです。

| ドキュメント | 状態 | 説明 |
|-------------|------|------|
| [issues/001-daily-habit-reset.md](issues/001-daily-habit-reset.md) | ✅ 完了 | 日次習慣リセット機能 |
| [issues/002-calendar-feature.md](issues/002-calendar-feature.md) | ✅ 完了 | カレンダー機能 |
| [issues/003-sns-share-feature.md](issues/003-sns-share-feature.md) | ✅ 完了 | SNSシェア画像生成機能 |

## ディレクトリ構造

```
docs/
├── README.md                 # このファイル（ドキュメント一覧）
├── DEPLOY.md                 # CI/CDデプロイ設定
├── SECRETS.md                # シークレット管理
├── IMAGE_GENERATION.md       # 画像生成ガイド
├── JOB_CREATION_GUIDE.md     # ジョブ追加ガイド
├── frontend/                 # フロントエンド関連ドキュメント
│   ├── GUIDELINES.md         # 開発ガイドライン
│   └── ATTRIBUTIONS.md       # ライセンス・謝辞
├── testing/                  # テスト関連ドキュメント
│   └── README.md             # テスト実行ガイド
└── issues/                   # Issue設計ドキュメント
    ├── 001-daily-habit-reset.md
    ├── 002-calendar-feature.md
    └── 003-sns-share-feature.md
```

## クイックリンク

- **初めての方**: [README.md](../README.md) → [DEPLOY.md](DEPLOY.md)
- **フロントエンド開発**: [frontend/GUIDELINES.md](frontend/GUIDELINES.md)
- **キャラクター画像追加**: [IMAGE_GENERATION.md](IMAGE_GENERATION.md) → [JOB_CREATION_GUIDE.md](JOB_CREATION_GUIDE.md)
- **テスト実行**: [testing/README.md](testing/README.md)
