# CI/CD デプロイ設定

## GitHub Secrets 設定

本番デプロイを行うために、以下のSecretsをGitHubリポジトリに設定してください。

**リポジトリ:** `git@github.com:sattva-improve/habits-rpg.git`

**設定方法:** GitHub → Settings → Secrets and variables → Actions → New repository secret

### 必須 Secrets

| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `AWS_ROLE_ARN` | GitHub Actions用IAMロールARN | AWS IAMでOIDCプロバイダーとロールを作成 |
| `AMPLIFY_APP_ID` | AmplifyアプリID | Amplifyコンソールから取得 |
| `S3_BUCKET_NAME` | フロントエンド用S3バケット名 | S3バケット作成後に設定 |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFrontディストリビューションID | CloudFront作成後に設定 |

## AWS OIDC プロバイダー設定

GitHub Actionsから安全にAWSにアクセスするため、OIDC認証を使用します。

### 1. GitHub OIDC プロバイダー作成

AWS IAM コンソールで「IDプロバイダー」を作成：
- プロバイダーのタイプ: `OpenID Connect`
- プロバイダーURL: `https://token.actions.githubusercontent.com`
- 対象者: `sts.amazonaws.com`

### 2. IAM ロール作成

信頼ポリシー:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:sattva-improve/habits-rpg:*"
        }
      }
    }
  ]
}
```

必要な権限ポリシー:
- `AmplifyBackendDeployFullAccess`（Amplifyバックエンドデプロイ用）
- `AmazonS3FullAccess`（S3デプロイ用）
- `CloudFrontFullAccess`（キャッシュ無効化用）

## デプロイフロー

```
mainブランチへpush
    ↓
GitHub Actions 起動
    ↓
[Backend Deploy]
  1. npm ci
  2. npx ampx pipeline-deploy
  3. amplify_outputs.json をアップロード
    ↓
[Frontend Deploy] (Backend完了後)
  1. amplify_outputs.json をダウンロード
  2. npm ci && npm run build
  3. aws s3 sync で S3 にアップロード
  4. CloudFront キャッシュ無効化
```

## ローカルからの手動デプロイ（緊急時）

```bash
# バックエンドデプロイ
cd /home/nekonisi/workspace/Habits-rpg
npm run deploy

# フロントエンドビルド
cd frontend
npm run build

# S3にアップロード
aws s3 sync build/ s3://<BUCKET_NAME>/ --delete
```

## トラブルシューティング

### デプロイ失敗時
1. GitHub Actions ログを確認
2. AWS CloudWatch Logsを確認
3. IAMロールの権限を確認

### amplify_outputs.json が見つからない
- バックエンドデプロイが完了しているか確認
- アーティファクトのダウンロードステップを確認
