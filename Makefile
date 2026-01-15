# Habits RPG Makefile
# 頻繁に使用するコマンドをまとめたMakefile

.PHONY: help install dev sandbox deploy lint format clean seed logs

# デフォルトターゲット
.DEFAULT_GOAL := help

# 色定義
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

## help: 使用可能なコマンド一覧を表示
help:
	@echo "$(CYAN)Habits RPG - 開発コマンド$(RESET)"
	@echo ""
	@echo "$(GREEN)セットアップ:$(RESET)"
	@echo "  make install        - 全依存関係をインストール"
	@echo "  make install-backend - バックエンド依存関係をインストール"
	@echo "  make install-frontend - フロントエンド依存関係をインストール"
	@echo ""
	@echo "$(GREEN)開発:$(RESET)"
	@echo "  make dev            - フロントエンド開発サーバーを起動"
	@echo "  make sandbox        - バックエンドSandboxを起動"
	@echo "  make sandbox-delete - Sandboxを削除"
	@echo ""
	@echo "$(GREEN)デプロイ:$(RESET)"
	@echo "  make deploy         - 本番環境にデプロイ"
	@echo ""
	@echo "$(GREEN)コード品質:$(RESET)"
	@echo "  make lint           - Lintを実行"
	@echo "  make format         - コードをフォーマット"
	@echo "  make typecheck      - TypeScript型チェック"
	@echo ""
	@echo "$(GREEN)データ管理:$(RESET)"
	@echo "  make seed           - シードデータ投入の案内を表示"
	@echo "  make db-tables      - DynamoDBテーブル一覧を表示"
	@echo ""
	@echo "$(GREEN)ユーティリティ:$(RESET)"
	@echo "  make clean          - ビルド成果物を削除"
	@echo "  make logs           - Sandboxログを表示"
	@echo "  make aws-check      - AWS認証情報を確認"

## install: 全依存関係をインストール
install: install-backend install-frontend
	@echo "$(GREEN)✓ 全ての依存関係をインストールしました$(RESET)"

## install-backend: バックエンド依存関係をインストール
install-backend:
	@echo "$(CYAN)バックエンド依存関係をインストール中...$(RESET)"
	npm install

## install-frontend: フロントエンド依存関係をインストール
install-frontend:
	@echo "$(CYAN)フロントエンド依存関係をインストール中...$(RESET)"
	cd frontend && pnpm install

## dev: フロントエンド開発サーバーを起動
dev:
	@echo "$(CYAN)フロントエンド開発サーバーを起動します...$(RESET)"
	@echo "$(YELLOW)URL: http://localhost:3001$(RESET)"
	cd frontend && pnpm run dev

## sandbox: バックエンドSandboxを起動
sandbox:
	@echo "$(CYAN)Amplify Sandboxを起動します...$(RESET)"
	@echo "$(YELLOW)終了するには Ctrl+C を押してください$(RESET)"
	npx ampx sandbox --outputs-out-dir frontend

## sandbox-bg: バックエンドSandboxをバックグラウンドで起動
sandbox-bg:
	@echo "$(CYAN)Amplify Sandboxをバックグラウンドで起動します...$(RESET)"
	nohup npx ampx sandbox --outputs-out-dir frontend > /tmp/sandbox.log 2>&1 &
	@echo "$(GREEN)✓ Sandboxがバックグラウンドで起動しました$(RESET)"
	@echo "$(YELLOW)ログは 'make logs' で確認できます$(RESET)"

## sandbox-delete: Sandboxを削除
sandbox-delete:
	@echo "$(CYAN)Sandboxを削除します...$(RESET)"
	npx ampx sandbox delete

## deploy: 本番環境にデプロイ
deploy:
	@echo "$(CYAN)本番環境にデプロイします...$(RESET)"
	npx ampx pipeline-deploy --branch main

## lint: Lintを実行
lint:
	@echo "$(CYAN)Lintを実行中...$(RESET)"
	cd frontend && pnpm run lint

## format: コードをフォーマット
format:
	@echo "$(CYAN)コードをフォーマット中...$(RESET)"
	cd frontend && pnpm run format 2>/dev/null || npx prettier --write "src/**/*.{ts,tsx}"

## typecheck: TypeScript型チェック
typecheck:
	@echo "$(CYAN)TypeScript型チェックを実行中...$(RESET)"
	cd frontend && pnpm run typecheck 2>/dev/null || npx tsc --noEmit

## seed: シードデータ投入の案内を表示
seed:
	@echo "$(CYAN)シードデータを投入するには:$(RESET)"
	@echo ""
	@echo "1. フロントエンド開発サーバーを起動: make dev"
	@echo "2. ブラウザでアプリを開く: http://localhost:3001"
	@echo "3. ブラウザの開発者コンソールで以下を実行:"
	@echo ""
	@echo "   $(GREEN)window.seedService.reseedAll()$(RESET)"
	@echo ""
	@echo "$(YELLOW)※ 開発環境でのみ利用可能$(RESET)"

## db-tables: DynamoDBテーブル一覧を表示
db-tables:
	@echo "$(CYAN)DynamoDBテーブル一覧:$(RESET)"
	aws dynamodb list-tables --region us-east-1 --output table

## clean: ビルド成果物を削除
clean:
	@echo "$(CYAN)ビルド成果物を削除中...$(RESET)"
	rm -rf frontend/build
	rm -rf frontend/dist
	rm -rf node_modules/.cache
	rm -rf .amplify
	@echo "$(GREEN)✓ クリーンアップ完了$(RESET)"

## logs: Sandboxログを表示
logs:
	@echo "$(CYAN)Sandboxログ:$(RESET)"
	@if [ -f /tmp/sandbox.log ]; then \
		tail -100 /tmp/sandbox.log; \
	else \
		echo "$(YELLOW)ログファイルが見つかりません。make sandbox-bg で起動してください。$(RESET)"; \
	fi

## aws-check: AWS認証情報を確認
aws-check:
	@echo "$(CYAN)AWS認証情報を確認中...$(RESET)"
	@aws sts get-caller-identity --output table || echo "$(YELLOW)AWS認証情報が設定されていません$(RESET)"

## build: フロントエンドをビルド
build:
	@echo "$(CYAN)フロントエンドをビルド中...$(RESET)"
	cd frontend && pnpm run build

## start-all: SandboxとフロントエンドをBG起動
start-all: sandbox-bg
	@sleep 5
	@echo "$(CYAN)フロントエンドを起動します...$(RESET)"
	cd frontend && pnpm run dev
