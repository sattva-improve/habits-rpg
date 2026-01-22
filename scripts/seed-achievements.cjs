#!/usr/bin/env node
/**
 * DynamoDB アチーブメントシードスクリプト
 * 
 * このファイル内の ACHIEVEMENTS 定義から DynamoDB にデータを投入します。
 * GitHub Actions の seed-data ジョブで使用します。
 * 
 * 環境変数:
 *   AMPLIFY_BACKEND_ID - Amplifyバックエンド識別子
 *   AWS_REGION - AWSリージョン (デフォルト: us-east-1)
 * 
 * 使用方法:
 *   node scripts/seed-achievements.js
 */

const { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

// アチーブメント定義
const ACHIEVEMENTS = [
  // ===== First (初回達成系) =====
  {
    achievementId: 'first_habit',
    name: 'さいしょのしゅうかん',
    description: 'さいしょのしゅうかんをつくる',
    icon: '🎉',
    type: 'first',
    rarity: 'common',
    expReward: 20,
    targetValue: 1,
    isHidden: false,
  },
  {
    achievementId: 'first_completion',
    name: 'だいいっぽ',
    description: 'さいしょのしゅうかんをたっせいする',
    icon: '👣',
    type: 'first',
    rarity: 'common',
    expReward: 30,
    targetValue: 1,
    isHidden: false,
  },

  // ===== Streak (連続達成系) =====
  {
    achievementId: 'streak_3',
    name: 'みっかぼうずをこえて',
    description: '3にちれんぞくでたっせいする',
    icon: '🔥',
    type: 'streak',
    rarity: 'common',
    expReward: 50,
    targetValue: 3,
    isHidden: false,
  },
  {
    achievementId: 'streak_7',
    name: 'いっしゅうかんのしゅうかん',
    description: '7にちれんぞくでたっせいする',
    icon: '🔥',
    type: 'streak',
    rarity: 'uncommon',
    expReward: 100,
    targetValue: 7,
    isHidden: false,
  },
  {
    achievementId: 'streak_14',
    name: 'にしゅうかんマスター',
    description: '14にちれんぞくでたっせいする',
    icon: '🔥',
    type: 'streak',
    rarity: 'uncommon',
    expReward: 200,
    targetValue: 14,
    isHidden: false,
  },
  {
    achievementId: 'streak_30',
    name: 'げっかんマスター',
    description: '30にちれんぞくでたっせいする',
    icon: '🔥',
    type: 'streak',
    rarity: 'rare',
    expReward: 500,
    targetValue: 30,
    isHidden: false,
  },
  {
    achievementId: 'streak_60',
    name: 'しゅうかんのたつじん',
    description: '60にちれんぞくでたっせいする',
    icon: '🏆',
    type: 'streak',
    rarity: 'epic',
    expReward: 1000,
    targetValue: 60,
    isHidden: false,
  },
  {
    achievementId: 'streak_100',
    name: 'でんせつのしゅうかんか',
    description: '100にちれんぞくでたっせいする',
    icon: '👑',
    type: 'streak',
    rarity: 'legendary',
    expReward: 2000,
    targetValue: 100,
    isHidden: false,
  },

  // ===== Total (累計達成系) =====
  {
    achievementId: 'total_10',
    name: '10かいたっせい',
    description: 'しゅうかんをごうけい10かいたっせいする',
    icon: '⭐',
    type: 'total',
    rarity: 'common',
    expReward: 50,
    targetValue: 10,
    isHidden: false,
  },
  {
    achievementId: 'total_50',
    name: '50かいたっせい',
    description: 'しゅうかんをごうけい50かいたっせいする',
    icon: '⭐',
    type: 'total',
    rarity: 'uncommon',
    expReward: 150,
    targetValue: 50,
    isHidden: false,
  },
  {
    achievementId: 'total_100',
    name: '100かいたっせい',
    description: 'しゅうかんをごうけい100かいたっせいする',
    icon: '🌟',
    type: 'total',
    rarity: 'rare',
    expReward: 300,
    targetValue: 100,
    isHidden: false,
  },
  {
    achievementId: 'total_500',
    name: '500かいたっせい',
    description: 'しゅうかんをごうけい500かいたっせいする',
    icon: '💎',
    type: 'total',
    rarity: 'epic',
    expReward: 1000,
    targetValue: 500,
    isHidden: false,
  },
  {
    achievementId: 'total_1000',
    name: '1000かいたっせい',
    description: 'しゅうかんをごうけい1000かいたっせいする',
    icon: '🏅',
    type: 'total',
    rarity: 'legendary',
    expReward: 2500,
    targetValue: 1000,
    isHidden: false,
  },

  // ===== Level (レベル到達系) =====
  {
    achievementId: 'level_3',
    name: 'レベル3とうたつ',
    description: 'レベル3にとうたつする',
    icon: '📈',
    type: 'level',
    rarity: 'common',
    expReward: 20,
    targetValue: 3,
    isHidden: false,
  },
  {
    achievementId: 'level_5',
    name: 'レベル5とうたつ',
    description: 'レベル5にとうたつする',
    icon: '📈',
    type: 'level',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    isHidden: false,
  },
  {
    achievementId: 'level_10',
    name: 'レベル10とうたつ',
    description: 'レベル10にとうたつする',
    icon: '📈',
    type: 'level',
    rarity: 'common',
    expReward: 50,
    targetValue: 10,
    isHidden: false,
  },
  {
    achievementId: 'level_25',
    name: 'レベル25とうたつ',
    description: 'レベル25にとうたつする',
    icon: '📈',
    type: 'level',
    rarity: 'uncommon',
    expReward: 100,
    targetValue: 25,
    isHidden: false,
  },
  {
    achievementId: 'level_50',
    name: 'レベル50とうたつ',
    description: 'レベル50にとうたつする',
    icon: '📈',
    type: 'level',
    rarity: 'rare',
    expReward: 300,
    targetValue: 50,
    isHidden: false,
  },
  {
    achievementId: 'level_99',
    name: 'レベルMAX',
    description: 'レベル99にとうたつする',
    icon: '👑',
    type: 'level',
    rarity: 'legendary',
    expReward: 1000,
    targetValue: 99,
    isHidden: false,
  },

  // ===== Stat (ステータス到達系) =====
  {
    achievementId: 'stat_vit_5',
    name: 'たいりょくのめざめ',
    description: 'たいりょくが5にとうたつする',
    icon: '❤️',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'VIT',
    isHidden: false,
  },
  {
    achievementId: 'stat_int_5',
    name: 'かしこさのめざめ',
    description: 'かしこさが5にとうたつする',
    icon: '📚',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'INT',
    isHidden: false,
  },
  {
    achievementId: 'stat_mnd_5',
    name: 'せいしんのめざめ',
    description: 'せいしんが5にとうたつする',
    icon: '🧘',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'MND',
    isHidden: false,
  },
  {
    achievementId: 'stat_dex_5',
    name: 'きようさのめざめ',
    description: 'きようさが5にとうたつする',
    icon: '🎨',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'DEX',
    isHidden: false,
  },
  {
    achievementId: 'stat_cha_5',
    name: 'みりょくのめざめ',
    description: 'みりょくが5にとうたつする',
    icon: '✨',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'CHA',
    isHidden: false,
  },
  {
    achievementId: 'stat_str_5',
    name: 'ちからのめざめ',
    description: 'ちからが5にとうたつする',
    icon: '💪',
    type: 'stat',
    rarity: 'common',
    expReward: 30,
    targetValue: 5,
    targetStatType: 'STR',
    isHidden: false,
  },
];

// アチーブメント数をエクスポート（検証用）
const ACHIEVEMENT_COUNT = ACHIEVEMENTS.length;

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

async function deleteAllAchievements(tableName) {
  console.log(`🗑️  Deleting existing achievements from ${tableName}...`);
  
  try {
    const scanResult = await client.send(new ScanCommand({
      TableName: tableName,
      ProjectionExpression: 'achievementId',
    }));

    if (scanResult.Items && scanResult.Items.length > 0) {
      for (const item of scanResult.Items) {
        if (item.achievementId?.S) {
          await client.send(new DeleteItemCommand({
            TableName: tableName,
            Key: { achievementId: { S: item.achievementId.S } },
          }));
        }
      }
      console.log(`   Deleted ${scanResult.Items.length} existing achievements`);
    }
  } catch (error) {
    console.log(`   No existing achievements to delete or table not found`);
  }
}

async function seedAchievements(tableName) {
  console.log(`🌱 Seeding ${ACHIEVEMENTS.length} achievements to ${tableName}...`);
  
  const now = new Date().toISOString();
  let success = 0;
  let failed = 0;

  for (const achievement of ACHIEVEMENTS) {
    try {
      const item = {
        achievementId: { S: achievement.achievementId },
        name: { S: achievement.name },
        description: { S: achievement.description },
        icon: { S: achievement.icon },
        type: { S: achievement.type },
        rarity: { S: achievement.rarity },
        expReward: { N: achievement.expReward.toString() },
        targetValue: { N: achievement.targetValue.toString() },
        isHidden: { BOOL: achievement.isHidden },
        __typename: { S: 'Achievement' },
        createdAt: { S: now },
        updatedAt: { S: now },
      };

      // targetStatType (stat タイプのみ)
      if (achievement.targetStatType) {
        item.targetStatType = { S: achievement.targetStatType };
      }

      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: item,
      }));
      
      success++;
    } catch (error) {
      console.error(`   Failed to seed achievement ${achievement.achievementId}:`, error.message);
      failed++;
    }
  }

  console.log(`✅ Achievements seeded: ${success} success, ${failed} failed`);
  return { success, failed, total: ACHIEVEMENT_COUNT };
}

async function main() {
  const backendId = process.env.AMPLIFY_BACKEND_ID;
  if (!backendId) {
    console.error('❌ AMPLIFY_BACKEND_ID environment variable is required');
    process.exit(1);
  }

  const tableName = `Achievement-${backendId}-NONE`;
  
  await deleteAllAchievements(tableName);
  const result = await seedAchievements(tableName);
  
  // 結果をファイルに出力（検証ステップで使用）
  console.log(`ACHIEVEMENT_COUNT=${result.total}`);
  
  if (result.failed > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
