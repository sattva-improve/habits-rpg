/**
 * シードデータ投入サービス
 * 初期のアチーブメント・ジョブマスターデータを投入
 */

import { client } from './graphql';

// アチーブメント定義
const ACHIEVEMENTS = [
  // First achievements
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

  // Streak achievements
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

  // Total completion achievements
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

  // Level achievements
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

  // Stat achievements
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

// ジョブ定義
const JOBS = [
  // Novice
  {
    jobId: 'beginner',
    name: 'みならい',
    description: 'すべてのぼうけんしゃのはじまり',
    icon: '🌱',
    tier: 'novice',
    requirements: {},
    statBonuses: {},
    expBonus: 1.0,
  },

  // Apprentice
  {
    jobId: 'warrior_apprentice',
    name: 'みならいせんし',
    description: 'きんりょくをきたえるもの',
    icon: '⚔️',
    tier: 'apprentice',
    requirements: { stats: { STR: 5 } },
    statBonuses: { STR: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'scholar_apprentice',
    name: 'みならいがくしゃ',
    description: 'ちしきをおいもとめるもの',
    icon: '📖',
    tier: 'apprentice',
    requirements: { stats: { INT: 5 } },
    statBonuses: { INT: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'monk_apprentice',
    name: 'みならいそうりょ',
    description: 'せいしんをみがくもの',
    icon: '🙏',
    tier: 'apprentice',
    requirements: { stats: { MND: 5 } },
    statBonuses: { MND: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'artisan_apprentice',
    name: 'みならいしょくにん',
    description: 'ぎじゅつをついきゅうするもの',
    icon: '🔧',
    tier: 'apprentice',
    requirements: { stats: { DEX: 5 } },
    statBonuses: { DEX: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'performer_apprentice',
    name: 'みならいげいにん',
    description: 'ひとをみりょうするもの',
    icon: '🎭',
    tier: 'apprentice',
    requirements: { stats: { CHA: 5 } },
    statBonuses: { CHA: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'athlete_apprentice',
    name: 'みならいアスリート',
    description: 'からだをきたえるもの',
    icon: '🏃',
    tier: 'apprentice',
    requirements: { stats: { VIT: 5 } },
    statBonuses: { VIT: 1 },
    expBonus: 1.05,
  },

  // Journeyman
  {
    jobId: 'warrior',
    name: 'せんし',
    description: 'きょうじんなにくたいをもつもの',
    icon: '🗡️',
    tier: 'journeyman',
    requirements: { level: 15, stats: { STR: 10 }, jobs: ['warrior_apprentice'] },
    statBonuses: { STR: 2, VIT: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'scholar',
    name: 'がくしゃ',
    description: 'ふかいちしきをもつもの',
    icon: '📚',
    tier: 'journeyman',
    requirements: { level: 15, stats: { INT: 10 }, jobs: ['scholar_apprentice'] },
    statBonuses: { INT: 2, MND: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'monk',
    name: 'そうりょ',
    description: 'しんしんをしゅうれんしたもの',
    icon: '🧘',
    tier: 'journeyman',
    requirements: { level: 15, stats: { MND: 10 }, jobs: ['monk_apprentice'] },
    statBonuses: { MND: 2, INT: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'artisan',
    name: 'しょくにん',
    description: 'たくみなわざをもつもの',
    icon: '⚒️',
    tier: 'journeyman',
    requirements: { level: 15, stats: { DEX: 10 }, jobs: ['artisan_apprentice'] },
    statBonuses: { DEX: 2, STR: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'bard',
    name: 'ぎんゆうしじん',
    description: 'うたとえんそうでひとをいやすもの',
    icon: '🎵',
    tier: 'journeyman',
    requirements: { level: 15, stats: { CHA: 10 }, jobs: ['performer_apprentice'] },
    statBonuses: { CHA: 2, MND: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'athlete',
    name: 'アスリート',
    description: 'きょうじんなたいりょくをもつもの',
    icon: '🏋️',
    tier: 'journeyman',
    requirements: { level: 15, stats: { VIT: 10 }, jobs: ['athlete_apprentice'] },
    statBonuses: { VIT: 2, STR: 1 },
    expBonus: 1.1,
  },
];

// シード済みフラグのキー
const SEED_VERSION_KEY = 'habits_rpg_seed_version';
const CURRENT_SEED_VERSION = '1.0.0'; // シードデータを更新したらバージョンを上げる

export const seedService = {
  /**
   * シード済みかどうかをチェック
   */
  isSeedCompleted(): boolean {
    const version = localStorage.getItem(SEED_VERSION_KEY);
    return version === CURRENT_SEED_VERSION;
  },

  /**
   * シード完了をマーク
   */
  markSeedCompleted(): void {
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
  },

  /**
   * シードフラグをリセット（デバッグ用）
   */
  resetSeedFlag(): void {
    localStorage.removeItem(SEED_VERSION_KEY);
  },

  /**
   * アチーブメントマスターデータを投入
   */
  async seedAchievements(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // 並列処理で高速化（10件ずつバッチ処理）
    const batchSize = 10;
    for (let i = 0; i < ACHIEVEMENTS.length; i += batchSize) {
      const batch = ACHIEVEMENTS.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (ach) => {
          try {
            // 既存チェック
            const { data: existing } = await client.models.Achievement.get({ 
              achievementId: ach.achievementId 
            });
            
            if (existing) {
              console.log(`Achievement ${ach.achievementId} already exists, skipping`);
              return { success: true };
            }

            const { errors } = await client.models.Achievement.create(ach);
            if (errors) {
              console.error(`Failed to create achievement ${ach.achievementId}:`, JSON.stringify(errors, null, 2));
              return { success: false };
            } else {
              console.log(`Created achievement: ${ach.name}`);
              return { success: true };
            }
          } catch (error) {
            console.error(`Error creating achievement ${ach.achievementId}:`, error);
            return { success: false };
          }
        })
      );

      success += results.filter(r => r.success).length;
      failed += results.filter(r => !r.success).length;
    }

    return { success, failed };
  },

  /**
   * ジョブマスターデータを投入
   */
  async seedJobs(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // 並列処理で高速化（5件ずつバッチ処理）
    const batchSize = 5;
    for (let i = 0; i < JOBS.length; i += batchSize) {
      const batch = JOBS.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(async (job) => {
          try {
            // 既存チェック
            const { data: existing, errors: getErrors } = await client.models.Job.get({ 
              jobId: job.jobId 
            });
            
            if (getErrors) {
              console.error(`Error checking job ${job.jobId}:`, JSON.stringify(getErrors, null, 2));
            }
            
            if (existing) {
              console.log(`Job ${job.jobId} already exists, skipping`);
              return { success: true };
            }

            // JSON型フィールドを適切に処理
            const jobData = {
              ...job,
              requirements: job.requirements && Object.keys(job.requirements).length > 0 
                ? job.requirements 
                : null,
              statBonuses: job.statBonuses && Object.keys(job.statBonuses).length > 0 
                ? job.statBonuses 
                : null,
            };

            const { errors } = await client.models.Job.create(jobData);
            if (errors) {
              console.error(`Failed to create job ${job.jobId}:`, JSON.stringify(errors, null, 2));
              return { success: false };
            } else {
              console.log(`Created job: ${job.name}`);
              return { success: true };
            }
          } catch (error) {
            console.error(`Error creating job ${job.jobId}:`, error);
            return { success: false };
          }
        })
      );

      success += results.filter(r => r.success).length;
      failed += results.filter(r => !r.success).length;
    }

    return { success, failed };
  },

  /**
   * 全シードデータを投入
   */
  async seedAll(): Promise<{ achievements: { success: number; failed: number }; jobs: { success: number; failed: number } }> {
    // 並列で両方実行
    const [achievements, jobs] = await Promise.all([
      this.seedAchievements(),
      this.seedJobs(),
    ]);
    return { achievements, jobs };
  },

  /**
   * マスターデータが存在するか素早くチェック
   */
  async checkMasterDataExists(): Promise<{ hasAchievements: boolean; hasJobs: boolean }> {
    try {
      const [achResult, jobResult] = await Promise.all([
        client.models.Achievement.list({ limit: 1 }),
        client.models.Job.list({ limit: 1 }),
      ]);
      return {
        hasAchievements: (achResult.data?.length ?? 0) > 0,
        hasJobs: (jobResult.data?.length ?? 0) > 0,
      };
    } catch (error) {
      console.error('Error checking master data:', error);
      return { hasAchievements: false, hasJobs: false };
    }
  },
};

export default seedService;
