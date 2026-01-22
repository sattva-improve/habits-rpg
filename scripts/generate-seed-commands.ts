#!/usr/bin/env npx ts-node
/**
 * DynamoDB シードコマンド生成スクリプト
 * 
 * shared/constants/jobs.ts から DynamoDB put-item コマンドを生成します。
 * GitHub Actions の seed-data ジョブで使用します。
 * 
 * 使用方法:
 *   npx ts-node scripts/generate-seed-commands.ts
 */

import { JOBS } from '../shared/constants/jobs';

// ジョブをDynamoDB put-itemコマンドに変換
function generateJobPutCommands(tableName: string): string[] {
  const commands: string[] = [];
  const now = new Date().toISOString();

  for (const job of JOBS) {
    const requirements = Object.keys(job.requirements).length > 0
      ? `{"S":"${JSON.stringify(job.requirements).replace(/"/g, '\\"')}"}`
      : '{"NULL":true}';
    
    const statBonuses = Object.keys(job.statBonuses).length > 0
      ? `{"S":"${JSON.stringify(job.statBonuses).replace(/"/g, '\\"')}"}`
      : '{"NULL":true}';

    const item = {
      jobId: { S: job.jobId },
      name: { S: job.name },
      description: { S: job.description },
      icon: { S: job.icon },
      tier: { S: job.tier },
      requirements: requirements,
      statBonuses: statBonuses,
      expBonus: { N: job.expBonus.toString() },
      __typename: { S: 'Job' },
      createdAt: { S: '$NOW' },
      updatedAt: { S: '$NOW' },
    };

    // JSON文字列を構築（requirements/statBonusesは既にJSON形式なので特別扱い）
    const itemJson = `{"jobId":{"S":"${job.jobId}"},"name":{"S":"${job.name}"},"description":{"S":"${job.description}"},"icon":{"S":"${job.icon}"},"tier":{"S":"${job.tier}"},"requirements":${requirements},"statBonuses":${statBonuses},"expBonus":{"N":"${job.expBonus}"},"__typename":{"S":"Job"},"createdAt":{"S":"'$NOW'"},"updatedAt":{"S":"'$NOW'"}}`;

    commands.push(`aws dynamodb put-item --table-name "$JOB_TABLE" --item '${itemJson}'`);
  }

  return commands;
}

// メイン処理
function main() {
  console.log('# Generated Job seed commands');
  console.log(`# Total jobs: ${JOBS.length}`);
  console.log('');
  console.log('JOB_TABLE="Job-${{ secrets.AMPLIFY_BACKEND_ID }}-NONE"');
  console.log('NOW=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")');
  console.log('');

  const commands = generateJobPutCommands('$JOB_TABLE');
  
  // ティアごとにグループ化
  const tiers = ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster'];
  
  for (const tier of tiers) {
    const tierJobs = JOBS.filter(j => j.tier === tier);
    if (tierJobs.length > 0) {
      console.log(`# ${tier.charAt(0).toUpperCase() + tier.slice(1)}`);
      for (const job of tierJobs) {
        const idx = JOBS.findIndex(j => j.jobId === job.jobId);
        console.log(commands[idx]);
      }
      console.log('');
    }
  }

  console.log(`echo "✅ Jobs seeded: ${JOBS.length}"`);
}

main();
