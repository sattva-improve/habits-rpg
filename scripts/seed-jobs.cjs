#!/usr/bin/env node
/**
 * DynamoDB ジョブシードスクリプト
 * 
 * shared/constants/jobs.ts から DynamoDB にジョブデータを投入します。
 * GitHub Actions の seed-data ジョブで使用します。
 * 
 * 環境変数:
 *   AMPLIFY_BACKEND_ID - Amplifyバックエンド識別子
 *   AWS_REGION - AWSリージョン (デフォルト: us-east-1)
 * 
 * 使用方法:
 *   node scripts/seed-jobs.js
 */

const { DynamoDBClient, PutItemCommand, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

// ジョブ定義（shared/constants/jobs.tsから抽出）
const JOBS = [
  // Novice
  { jobId: 'beginner', name: 'みならい', description: 'すべてのぼうけんしゃのはじまり', icon: '🌱', tier: 'novice', requirements: {}, statBonuses: {}, expBonus: 1.0 },
  
  // Apprentice
  { jobId: 'warrior_apprentice', name: 'みならいせんし', description: 'きんりょくをきたえるもの', icon: '⚔️', tier: 'apprentice', requirements: { stats: { STR: 2 } }, statBonuses: { STR: 1 }, expBonus: 1.05 },
  { jobId: 'scholar_apprentice', name: 'みならいがくしゃ', description: 'ちしきをおいもとめるもの', icon: '📖', tier: 'apprentice', requirements: { stats: { INT: 2 } }, statBonuses: { INT: 1 }, expBonus: 1.05 },
  { jobId: 'monk_apprentice', name: 'みならいそうりょ', description: 'せいしんをみがくもの', icon: '🙏', tier: 'apprentice', requirements: { stats: { MND: 2 } }, statBonuses: { MND: 1 }, expBonus: 1.05 },
  { jobId: 'artisan_apprentice', name: 'みならいしょくにん', description: 'ぎじゅつをついきゅうするもの', icon: '🔧', tier: 'apprentice', requirements: { stats: { DEX: 2 } }, statBonuses: { DEX: 1 }, expBonus: 1.05 },
  { jobId: 'performer_apprentice', name: 'みならいげいにん', description: 'ひとをみりょうするもの', icon: '🎭', tier: 'apprentice', requirements: { stats: { CHA: 2 } }, statBonuses: { CHA: 1 }, expBonus: 1.05 },
  { jobId: 'athlete_apprentice', name: 'みならいアスリート', description: 'からだをきたえるもの', icon: '🏃', tier: 'apprentice', requirements: { stats: { VIT: 2 } }, statBonuses: { VIT: 1 }, expBonus: 1.05 },
  
  // Journeyman (単一ステータス系)
  { jobId: 'warrior', name: 'せんし', description: 'きょうじんなにくたいをもつもの', icon: '🗡️', tier: 'journeyman', requirements: { level: 10, stats: { STR: 5 }, jobs: ['warrior_apprentice'] }, statBonuses: { STR: 2, VIT: 1 }, expBonus: 1.1 },
  { jobId: 'scholar', name: 'がくしゃ', description: 'ふかいちしきをもつもの', icon: '📚', tier: 'journeyman', requirements: { level: 10, stats: { INT: 5 }, jobs: ['scholar_apprentice'] }, statBonuses: { INT: 2, MND: 1 }, expBonus: 1.1 },
  { jobId: 'monk', name: 'そうりょ', description: 'しんしんをしゅうれんしたもの', icon: '🧘', tier: 'journeyman', requirements: { level: 10, stats: { MND: 5 }, jobs: ['monk_apprentice'] }, statBonuses: { MND: 2, INT: 1 }, expBonus: 1.1 },
  { jobId: 'artisan', name: 'しょくにん', description: 'たくみなわざをもつもの', icon: '⚒️', tier: 'journeyman', requirements: { level: 10, stats: { DEX: 5 }, jobs: ['artisan_apprentice'] }, statBonuses: { DEX: 2, STR: 1 }, expBonus: 1.1 },
  { jobId: 'bard', name: 'ぎんゆうしじん', description: 'うたとえんそうでひとをいやすもの', icon: '🎵', tier: 'journeyman', requirements: { level: 10, stats: { CHA: 5 }, jobs: ['performer_apprentice'] }, statBonuses: { CHA: 2, MND: 1 }, expBonus: 1.1 },
  { jobId: 'athlete', name: 'アスリート', description: 'きょうじんなたいりょくをもつもの', icon: '🏋️', tier: 'journeyman', requirements: { level: 10, stats: { VIT: 5 }, jobs: ['athlete_apprentice'] }, statBonuses: { VIT: 2, STR: 1 }, expBonus: 1.1 },
  
  // Journeyman (複合ステータス系)
  { jobId: 'ranger', name: 'レンジャー', description: 'ゆみとしぜんをあやつるかりゅうど', icon: '🏹', tier: 'journeyman', requirements: { level: 10, stats: { DEX: 4, STR: 3 }, jobs: ['warrior_apprentice', 'artisan_apprentice'] }, statBonuses: { DEX: 2, STR: 1 }, expBonus: 1.1 },
  { jobId: 'paladin', name: 'パラディン', description: 'せいなるちからをやどすきし', icon: '✝️', tier: 'journeyman', requirements: { level: 10, stats: { STR: 4, MND: 3 }, jobs: ['warrior_apprentice', 'monk_apprentice'] }, statBonuses: { STR: 2, MND: 1 }, expBonus: 1.1 },
  { jobId: 'ninja', name: 'にんじゃ', description: 'かげにひそみ、しゅんびんにうごくもの', icon: '🥷', tier: 'journeyman', requirements: { level: 10, stats: { DEX: 4, INT: 3 }, jobs: ['artisan_apprentice', 'scholar_apprentice'] }, statBonuses: { DEX: 2, INT: 1 }, expBonus: 1.1 },
  { jobId: 'spellblade', name: 'まほうけんし', description: 'けんとまほうをゆうごうさせたせんし', icon: '⚔️✨', tier: 'journeyman', requirements: { level: 10, stats: { STR: 4, INT: 3 }, jobs: ['warrior_apprentice', 'scholar_apprentice'] }, statBonuses: { STR: 1, INT: 1, DEX: 1 }, expBonus: 1.1 },
  { jobId: 'dancer', name: 'おどりこ', description: 'ゆうがなまいでなかまをこぶするもの', icon: '💃', tier: 'journeyman', requirements: { level: 10, stats: { CHA: 4, VIT: 3 }, jobs: ['performer_apprentice', 'athlete_apprentice'] }, statBonuses: { CHA: 1, VIT: 1, DEX: 1 }, expBonus: 1.1 },
  { jobId: 'alchemist', name: 'れんきんじゅつし', description: 'ぶっしつをへんようさせるひじゅつのつかいて', icon: '⚗️', tier: 'journeyman', requirements: { level: 10, stats: { INT: 4, DEX: 3 }, jobs: ['scholar_apprentice', 'artisan_apprentice'] }, statBonuses: { INT: 1, DEX: 1, MND: 1 }, expBonus: 1.1 },
];

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

async function deleteAllJobs(tableName) {
  console.log(`🗑️  Deleting existing jobs from ${tableName}...`);
  
  try {
    const scanResult = await client.send(new ScanCommand({
      TableName: tableName,
      ProjectionExpression: 'jobId',
    }));

    if (scanResult.Items && scanResult.Items.length > 0) {
      for (const item of scanResult.Items) {
        if (item.jobId?.S) {
          await client.send(new DeleteItemCommand({
            TableName: tableName,
            Key: { jobId: { S: item.jobId.S } },
          }));
        }
      }
      console.log(`   Deleted ${scanResult.Items.length} existing jobs`);
    }
  } catch (error) {
    console.log(`   No existing jobs to delete or table not found`);
  }
}

async function seedJobs(tableName) {
  console.log(`🌱 Seeding ${JOBS.length} jobs to ${tableName}...`);
  
  const now = new Date().toISOString();
  let success = 0;
  let failed = 0;

  for (const job of JOBS) {
    try {
      const item = {
        jobId: { S: job.jobId },
        name: { S: job.name },
        description: { S: job.description },
        icon: { S: job.icon },
        tier: { S: job.tier },
        expBonus: { N: job.expBonus.toString() },
        __typename: { S: 'Job' },
        createdAt: { S: now },
        updatedAt: { S: now },
      };

      // requirements
      if (Object.keys(job.requirements).length > 0) {
        item.requirements = { S: JSON.stringify(job.requirements) };
      } else {
        item.requirements = { NULL: true };
      }

      // statBonuses
      if (Object.keys(job.statBonuses).length > 0) {
        item.statBonuses = { S: JSON.stringify(job.statBonuses) };
      } else {
        item.statBonuses = { NULL: true };
      }

      await client.send(new PutItemCommand({
        TableName: tableName,
        Item: item,
      }));
      
      success++;
    } catch (error) {
      console.error(`   Failed to seed job ${job.jobId}:`, error.message);
      failed++;
    }
  }

  console.log(`✅ Jobs seeded: ${success} success, ${failed} failed`);
  return { success, failed };
}

async function main() {
  const backendId = process.env.AMPLIFY_BACKEND_ID;
  if (!backendId) {
    console.error('❌ AMPLIFY_BACKEND_ID environment variable is required');
    process.exit(1);
  }

  const tableName = `Job-${backendId}-NONE`;
  
  await deleteAllJobs(tableName);
  const result = await seedJobs(tableName);
  
  if (result.failed > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
