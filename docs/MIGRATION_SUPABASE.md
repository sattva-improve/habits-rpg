---
title: Amplify → Supabase migration notes
---

# Amplify → Supabase migration notes

このリポジトリは現状 **AWS Amplify Gen2 を本番バックエンド**として運用しつつ、フロントエンド側に **Supabase クライアントの基盤**を追加して段階的に移行しています。

## 現在の状態（2026-03-01）

- 本番デプロイ: `main` push で GitHub Actions が Amplify をデプロイし、`amplify_outputs.json` を生成・配布します。
- フロントエンド: `@supabase/supabase-js` を導入し、`getSupabaseClient()` を追加済み。
- Supabase ディレクトリ (`/supabase`) は、将来的な移行用の土台として同梱されています（CI/デプロイでは使用していません）。

## フロントエンドでの Supabase 設定

1. `frontend/.env.example` を `frontend/.env.local` にコピー
2. `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` を設定

```bash
cd frontend
cp .env.example .env.local
```

Supabase クライアントは `frontend/src/lib/supabase.ts` の `getSupabaseClient()` 経由で取得します。

## ローカル開発コマンド（現状の推奨）

- Amplify Sandbox + フロントエンド

```bash
make sandbox  # terminal 1
make dev      # terminal 2
```

- Supabase ローカル環境（将来/任意）

```bash
make supabase-start
make supabase-stop
make supabase-reset
```

## これから移行する範囲（Issue の想定）

- フロントエンド data services を Supabase に置き換え
- UserContext の id / API 形状をサービスと合わせる
- docs / Makefile / AGENTS の記載を「現状の実態」に合わせて更新
