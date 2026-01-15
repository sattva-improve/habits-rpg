#!/bin/bash
# Habits RPG - GraphQL API テスト (curl)
#
# 使い方:
#   chmod +x test/curl-test.sh
#   ./test/curl-test.sh

ENDPOINT="https://c44kjstsh5d7rbhlw2yy7wthcu.appsync-api.us-east-1.amazonaws.com/graphql"
API_KEY="da2-4gyvtrzdjjaf5ero4jeb3mrcvq"

echo "🎮 Habits RPG - GraphQL API テスト (curl)"
echo "=========================================="
echo "📡 エンドポイント: $ENDPOINT"
echo ""

# ヘルパー関数
graphql_request() {
    local query="$1"
    curl -s -X POST "$ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "x-api-key: $API_KEY" \
        -d "{\"query\": \"$query\"}" | jq .
}

# 1. スキーマイントロスペクション (モデル一覧)
echo "📋 1. スキーマイントロスペクション (主要モデル)"
echo "-----------------------------------"
graphql_request "{ __schema { types { name kind } } }" | jq '[.data.__schema.types[] | select(.kind == "OBJECT" and (.name | startswith("__") | not) and (.name | contains("Connection") | not) and (.name | contains("Input") | not) and (.name | contains("Filter") | not) and (.name | contains("Subscription") | not) and (.name | contains("Mutation") | not) and (.name | contains("Query") | not))] | map(.name)'
echo ""

# 2. アチーブメント一覧
echo "🏆 2. アチーブメント一覧"
echo "------------------------"
graphql_request "query { listAchievements { items { achievementId name description type rarity expReward isHidden } } }"
echo ""

# 3. ジョブ一覧
echo "💼 3. ジョブ一覧"
echo "----------------"
graphql_request "query { listJobs { items { jobId name description tier expBonus } } }"
echo ""

# 4. キャラクタースプライト一覧
echo "🎨 4. キャラクタースプライト一覧"
echo "--------------------------------"
graphql_request "query { listCharacterSprites { items { spriteId name description category isDefault width height frameCount } } }"
echo ""

# 5. ユーザー一覧 (認証が必要なため、エラーになる可能性あり)
echo "👥 5. ユーザー一覧 (認証必要)"
echo "------------------"
graphql_request "query { listUsers { items { userId email displayName level totalExp } } }"
echo ""

# 6. 習慣一覧 (認証が必要なため、エラーになる可能性あり)
echo "📝 6. 習慣一覧 (認証必要)"
echo "--------------"
graphql_request "query { listHabits { items { habitId userId name category difficulty currentStreak } } }"
echo ""

echo "=========================================="
echo "✅ テスト完了"
echo ""
echo "💡 ヒント:"
echo "  - マスターデータ (Achievement, Job, CharacterSprite) はAPI Keyでアクセス可能"
echo "  - ユーザーデータはCognito認証が必要"
echo "  - GraphQL Playgroundを使用: test/graphql-playground.html"
