#!/bin/bash

# DynamoDB リシードスクリプト
# seed.ts のデータを正として DynamoDB をリフレッシュします

set -e

REGION="us-east-1"
ACHIEVEMENT_TABLE="Achievement-tkcjsky7gjda7aabzwigjg4nu4-NONE"
JOB_TABLE="Job-tkcjsky7gjda7aabzwigjg4nu4-NONE"

echo "🗑️ Deleting existing data..."

# Achievement テーブルの全データを削除
echo "  Deleting Achievements..."
aws dynamodb scan --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" \
  --projection-expression "achievementId" --output json | \
  jq -r '.Items[].achievementId.S' | while read id; do
    if [ -n "$id" ]; then
      aws dynamodb delete-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" \
        --key "{\"achievementId\": {\"S\": \"$id\"}}" 2>/dev/null || true
      echo "    Deleted: $id"
    fi
  done

# Job テーブルの全データを削除
echo "  Deleting Jobs..."
aws dynamodb scan --table-name "$JOB_TABLE" --region "$REGION" \
  --projection-expression "jobId" --output json | \
  jq -r '.Items[].jobId.S' | while read id; do
    if [ -n "$id" ]; then
      aws dynamodb delete-item --table-name "$JOB_TABLE" --region "$REGION" \
        --key "{\"jobId\": {\"S\": \"$id\"}}" 2>/dev/null || true
      echo "    Deleted: $id"
    fi
  done

echo "✅ Deletion complete"

echo ""
echo "🌱 Seeding new data..."

NOW=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Achievement データを投入
echo "  Seeding Achievements..."

# first achievements
aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "first_habit"},
  "name": {"S": "さいしょのしゅうかん"},
  "description": {"S": "さいしょのしゅうかんをつくる"},
  "icon": {"S": "🎉"},
  "type": {"S": "first"},
  "rarity": {"S": "common"},
  "expReward": {"N": "20"},
  "targetValue": {"N": "1"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: first_habit"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "first_completion"},
  "name": {"S": "だいいっぽ"},
  "description": {"S": "さいしょのしゅうかんをたっせいする"},
  "icon": {"S": "👣"},
  "type": {"S": "first"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "1"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: first_completion"

# streak achievements
aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_3"},
  "name": {"S": "みっかぼうずをこえて"},
  "description": {"S": "3にちれんぞくでたっせいする"},
  "icon": {"S": "🔥"},
  "type": {"S": "streak"},
  "rarity": {"S": "common"},
  "expReward": {"N": "50"},
  "targetValue": {"N": "3"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_3"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_7"},
  "name": {"S": "いっしゅうかんのしゅうかん"},
  "description": {"S": "7にちれんぞくでたっせいする"},
  "icon": {"S": "🔥"},
  "type": {"S": "streak"},
  "rarity": {"S": "uncommon"},
  "expReward": {"N": "100"},
  "targetValue": {"N": "7"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_7"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_14"},
  "name": {"S": "にしゅうかんマスター"},
  "description": {"S": "14にちれんぞくでたっせいする"},
  "icon": {"S": "🔥"},
  "type": {"S": "streak"},
  "rarity": {"S": "uncommon"},
  "expReward": {"N": "200"},
  "targetValue": {"N": "14"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_14"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_30"},
  "name": {"S": "げっかんマスター"},
  "description": {"S": "30にちれんぞくでたっせいする"},
  "icon": {"S": "🔥"},
  "type": {"S": "streak"},
  "rarity": {"S": "rare"},
  "expReward": {"N": "500"},
  "targetValue": {"N": "30"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_30"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_60"},
  "name": {"S": "しゅうかんのたつじん"},
  "description": {"S": "60にちれんぞくでたっせいする"},
  "icon": {"S": "🏆"},
  "type": {"S": "streak"},
  "rarity": {"S": "epic"},
  "expReward": {"N": "1000"},
  "targetValue": {"N": "60"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_60"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "streak_100"},
  "name": {"S": "でんせつのしゅうかんか"},
  "description": {"S": "100にちれんぞくでたっせいする"},
  "icon": {"S": "👑"},
  "type": {"S": "streak"},
  "rarity": {"S": "legendary"},
  "expReward": {"N": "2000"},
  "targetValue": {"N": "100"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: streak_100"

# total achievements
aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "total_10"},
  "name": {"S": "10かいたっせい"},
  "description": {"S": "しゅうかんをごうけい10かいたっせいする"},
  "icon": {"S": "⭐"},
  "type": {"S": "total"},
  "rarity": {"S": "common"},
  "expReward": {"N": "50"},
  "targetValue": {"N": "10"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: total_10"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "total_50"},
  "name": {"S": "50かいたっせい"},
  "description": {"S": "しゅうかんをごうけい50かいたっせいする"},
  "icon": {"S": "⭐"},
  "type": {"S": "total"},
  "rarity": {"S": "uncommon"},
  "expReward": {"N": "150"},
  "targetValue": {"N": "50"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: total_50"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "total_100"},
  "name": {"S": "100かいたっせい"},
  "description": {"S": "しゅうかんをごうけい100かいたっせいする"},
  "icon": {"S": "🌟"},
  "type": {"S": "total"},
  "rarity": {"S": "rare"},
  "expReward": {"N": "300"},
  "targetValue": {"N": "100"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: total_100"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "total_500"},
  "name": {"S": "500かいたっせい"},
  "description": {"S": "しゅうかんをごうけい500かいたっせいする"},
  "icon": {"S": "💎"},
  "type": {"S": "total"},
  "rarity": {"S": "epic"},
  "expReward": {"N": "1000"},
  "targetValue": {"N": "500"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: total_500"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "total_1000"},
  "name": {"S": "1000かいたっせい"},
  "description": {"S": "しゅうかんをごうけい1000かいたっせいする"},
  "icon": {"S": "🏅"},
  "type": {"S": "total"},
  "rarity": {"S": "legendary"},
  "expReward": {"N": "2500"},
  "targetValue": {"N": "1000"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: total_1000"

# level achievements
aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "level_5"},
  "name": {"S": "レベル5とうたつ"},
  "description": {"S": "レベル5にとうたつする"},
  "icon": {"S": "📈"},
  "type": {"S": "level"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: level_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "level_10"},
  "name": {"S": "レベル10とうたつ"},
  "description": {"S": "レベル10にとうたつする"},
  "icon": {"S": "📈"},
  "type": {"S": "level"},
  "rarity": {"S": "common"},
  "expReward": {"N": "50"},
  "targetValue": {"N": "10"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: level_10"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "level_25"},
  "name": {"S": "レベル25とうたつ"},
  "description": {"S": "レベル25にとうたつする"},
  "icon": {"S": "📈"},
  "type": {"S": "level"},
  "rarity": {"S": "uncommon"},
  "expReward": {"N": "100"},
  "targetValue": {"N": "25"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: level_25"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "level_50"},
  "name": {"S": "レベル50とうたつ"},
  "description": {"S": "レベル50にとうたつする"},
  "icon": {"S": "📈"},
  "type": {"S": "level"},
  "rarity": {"S": "rare"},
  "expReward": {"N": "300"},
  "targetValue": {"N": "50"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: level_50"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "level_99"},
  "name": {"S": "レベルMAX"},
  "description": {"S": "レベル99にとうたつする"},
  "icon": {"S": "👑"},
  "type": {"S": "level"},
  "rarity": {"S": "legendary"},
  "expReward": {"N": "1000"},
  "targetValue": {"N": "99"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: level_99"

# stat achievements
aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_vit_5"},
  "name": {"S": "たいりょくのめざめ"},
  "description": {"S": "たいりょくが5にとうたつする"},
  "icon": {"S": "❤️"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "VIT"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_vit_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_int_5"},
  "name": {"S": "かしこさのめざめ"},
  "description": {"S": "かしこさが5にとうたつする"},
  "icon": {"S": "📚"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "INT"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_int_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_mnd_5"},
  "name": {"S": "せいしんのめざめ"},
  "description": {"S": "せいしんが5にとうたつする"},
  "icon": {"S": "🧘"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "MND"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_mnd_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_dex_5"},
  "name": {"S": "きようさのめざめ"},
  "description": {"S": "きようさが5にとうたつする"},
  "icon": {"S": "🎨"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "DEX"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_dex_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_cha_5"},
  "name": {"S": "みりょくのめざめ"},
  "description": {"S": "みりょくが5にとうたつする"},
  "icon": {"S": "✨"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "CHA"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_cha_5"

aws dynamodb put-item --table-name "$ACHIEVEMENT_TABLE" --region "$REGION" --item '{
  "achievementId": {"S": "stat_str_5"},
  "name": {"S": "ちからのめざめ"},
  "description": {"S": "ちからが5にとうたつする"},
  "icon": {"S": "💪"},
  "type": {"S": "stat"},
  "rarity": {"S": "common"},
  "expReward": {"N": "30"},
  "targetValue": {"N": "5"},
  "targetStatType": {"S": "STR"},
  "isHidden": {"BOOL": false},
  "__typename": {"S": "Achievement"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: stat_str_5"

echo "  Achievements seeded: 24"

# Job データを投入
echo "  Seeding Jobs..."

# Novice
aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "beginner"},
  "name": {"S": "みならい"},
  "description": {"S": "すべてのぼうけんしゃのはじまり"},
  "icon": {"S": "🌱"},
  "tier": {"S": "novice"},
  "requirements": {"NULL": true},
  "statBonuses": {"NULL": true},
  "expBonus": {"N": "1.0"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: beginner"

# Apprentice
aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "warrior_apprentice"},
  "name": {"S": "みならいせんし"},
  "description": {"S": "きんりょくをきたえるもの"},
  "icon": {"S": "⚔️"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"STR\":2}}"},
  "statBonuses": {"S": "{\"STR\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: warrior_apprentice"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "scholar_apprentice"},
  "name": {"S": "みならいがくしゃ"},
  "description": {"S": "ちしきをおいもとめるもの"},
  "icon": {"S": "📖"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"INT\":2}}"},
  "statBonuses": {"S": "{\"INT\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: scholar_apprentice"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "monk_apprentice"},
  "name": {"S": "みならいそうりょ"},
  "description": {"S": "せいしんをみがくもの"},
  "icon": {"S": "🙏"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"MND\":2}}"},
  "statBonuses": {"S": "{\"MND\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: monk_apprentice"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "artisan_apprentice"},
  "name": {"S": "みならいしょくにん"},
  "description": {"S": "ぎじゅつをついきゅうするもの"},
  "icon": {"S": "🔧"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"DEX\":2}}"},
  "statBonuses": {"S": "{\"DEX\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: artisan_apprentice"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "performer_apprentice"},
  "name": {"S": "みならいげいにん"},
  "description": {"S": "ひとをみりょうするもの"},
  "icon": {"S": "🎭"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"CHA\":2}}"},
  "statBonuses": {"S": "{\"CHA\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: performer_apprentice"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "athlete_apprentice"},
  "name": {"S": "みならいアスリート"},
  "description": {"S": "からだをきたえるもの"},
  "icon": {"S": "🏃"},
  "tier": {"S": "apprentice"},
  "requirements": {"S": "{\"stats\":{\"VIT\":2}}"},
  "statBonuses": {"S": "{\"VIT\":1}"},
  "expBonus": {"N": "1.05"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: athlete_apprentice"

# Journeyman
aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "warrior"},
  "name": {"S": "せんし"},
  "description": {"S": "きょうじんなにくたいをもつもの"},
  "icon": {"S": "🗡️"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"STR\":5},\"jobs\":[\"warrior_apprentice\"]}"},
  "statBonuses": {"S": "{\"STR\":2,\"VIT\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: warrior"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "scholar"},
  "name": {"S": "がくしゃ"},
  "description": {"S": "ふかいちしきをもつもの"},
  "icon": {"S": "📚"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"INT\":5},\"jobs\":[\"scholar_apprentice\"]}"},
  "statBonuses": {"S": "{\"INT\":2,\"MND\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: scholar"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "monk"},
  "name": {"S": "そうりょ"},
  "description": {"S": "しんしんをしゅうれんしたもの"},
  "icon": {"S": "🧘"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"MND\":5},\"jobs\":[\"monk_apprentice\"]}"},
  "statBonuses": {"S": "{\"MND\":2,\"INT\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: monk"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "artisan"},
  "name": {"S": "しょくにん"},
  "description": {"S": "たくみなわざをもつもの"},
  "icon": {"S": "⚒️"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"DEX\":5},\"jobs\":[\"artisan_apprentice\"]}"},
  "statBonuses": {"S": "{\"DEX\":2,\"STR\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: artisan"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "bard"},
  "name": {"S": "ぎんゆうしじん"},
  "description": {"S": "うたとえんそうでひとをいやすもの"},
  "icon": {"S": "🎵"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"CHA\":5},\"jobs\":[\"performer_apprentice\"]}"},
  "statBonuses": {"S": "{\"CHA\":2,\"MND\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: bard"

aws dynamodb put-item --table-name "$JOB_TABLE" --region "$REGION" --item '{
  "jobId": {"S": "athlete"},
  "name": {"S": "アスリート"},
  "description": {"S": "きょうじんなたいりょくをもつもの"},
  "icon": {"S": "🏋️"},
  "tier": {"S": "journeyman"},
  "requirements": {"S": "{\"level\":10,\"stats\":{\"VIT\":5},\"jobs\":[\"athlete_apprentice\"]}"},
  "statBonuses": {"S": "{\"VIT\":2,\"STR\":1}"},
  "expBonus": {"N": "1.1"},
  "__typename": {"S": "Job"},
  "createdAt": {"S": "'$NOW'"},
  "updatedAt": {"S": "'$NOW'"}
}'
echo "    Created: athlete"

echo "  Jobs seeded: 13"

echo ""
echo "✅ Reseed complete!"
echo "   Achievements: 24"
echo "   Jobs: 13"
