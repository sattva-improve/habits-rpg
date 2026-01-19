import type { Handler } from 'aws-lambda';

/**
 * ジョブ定義
 */
interface JobDefinition {
  jobId: string;
  name: string;
  description: string;
  icon: string;
  tier: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster';
  requirements: {
    level?: number;
    stats?: Partial<Record<'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR', number>>;
    achievements?: string[];
    jobs?: string[]; // 前提ジョブ
  };
  statBonuses: Partial<Record<'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR', number>>;
  expBonus: number;
}

/**
 * デフォルトジョブ一覧
 */
const JOBS: JobDefinition[] = [
  // ===== Novice (初期) =====
  {
    jobId: 'beginner',
    name: 'ビギナー',
    description: 'すべての冒険者の始まり',
    icon: '🌱',
    tier: 'novice',
    requirements: {},
    statBonuses: {},
    expBonus: 1.0,
  },

  // ===== Apprentice (見習い) =====
  {
    jobId: 'warrior_apprentice',
    name: '見習い戦士',
    description: '筋力を鍛える者',
    icon: '⚔️',
    tier: 'apprentice',
    requirements: {
      stats: { STR: 2 },
    },
    statBonuses: { STR: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'scholar_apprentice',
    name: '見習い学者',
    description: '知識を追い求める者',
    icon: '📖',
    tier: 'apprentice',
    requirements: {
      stats: { INT: 2 },
    },
    statBonuses: { INT: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'monk_apprentice',
    name: '見習い僧侶',
    description: '精神を磨く者',
    icon: '🙏',
    tier: 'apprentice',
    requirements: {
      stats: { MND: 2 },
    },
    statBonuses: { MND: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'artisan_apprentice',
    name: '見習い職人',
    description: '技術を追求する者',
    icon: '🔧',
    tier: 'apprentice',
    requirements: {
      stats: { DEX: 2 },
    },
    statBonuses: { DEX: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'performer_apprentice',
    name: '見習い芸人',
    description: '人を魅了する者',
    icon: '🎭',
    tier: 'apprentice',
    requirements: {
      stats: { CHA: 2 },
    },
    statBonuses: { CHA: 1 },
    expBonus: 1.05,
  },
  {
    jobId: 'athlete_apprentice',
    name: '見習いアスリート',
    description: '体を鍛える者',
    icon: '🏃',
    tier: 'apprentice',
    requirements: {
      stats: { VIT: 2 },
    },
    statBonuses: { VIT: 1 },
    expBonus: 1.05,
  },

  // ===== Journeyman (職人) =====
  {
    jobId: 'warrior',
    name: '戦士',
    description: '強靭な肉体を持つ者',
    icon: '🗡️',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { STR: 5 },
      jobs: ['warrior_apprentice'],
    },
    statBonuses: { STR: 2, VIT: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'scholar',
    name: '学者',
    description: '深い知識を持つ者',
    icon: '📚',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { INT: 5 },
      jobs: ['scholar_apprentice'],
    },
    statBonuses: { INT: 2, MND: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'monk',
    name: '僧侶',
    description: '心身を修練した者',
    icon: '🧘',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { MND: 5 },
      jobs: ['monk_apprentice'],
    },
    statBonuses: { MND: 2, VIT: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'artisan',
    name: '職人',
    description: '卓越した技術を持つ者',
    icon: '⚒️',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { DEX: 5 },
      jobs: ['artisan_apprentice'],
    },
    statBonuses: { DEX: 2, INT: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'bard',
    name: '吟遊詩人',
    description: '人々を魅了する者',
    icon: '🎵',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { CHA: 5 },
      jobs: ['performer_apprentice'],
    },
    statBonuses: { CHA: 2, DEX: 1 },
    expBonus: 1.1,
  },
  {
    jobId: 'athlete',
    name: 'アスリート',
    description: '健康な身体を持つ者',
    icon: '🏅',
    tier: 'journeyman',
    requirements: {
      level: 10,
      stats: { VIT: 5 },
      jobs: ['athlete_apprentice'],
    },
    statBonuses: { VIT: 2, STR: 1 },
    expBonus: 1.1,
  },

  // ===== Expert (熟練者) =====
  {
    jobId: 'knight',
    name: '騎士',
    description: '武芸に優れた勇者',
    icon: '🛡️',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { STR: 10, VIT: 5 },
      jobs: ['warrior'],
    },
    statBonuses: { STR: 3, VIT: 2, CHA: 1 },
    expBonus: 1.15,
  },
  {
    jobId: 'sage',
    name: '賢者',
    description: '深い知恵を持つ者',
    icon: '🔮',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { INT: 10, MND: 5 },
      jobs: ['scholar'],
    },
    statBonuses: { INT: 3, MND: 2, DEX: 1 },
    expBonus: 1.15,
  },
  {
    jobId: 'high_monk',
    name: '高僧',
    description: '悟りを開いた者',
    icon: '☯️',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { MND: 10, VIT: 5 },
      jobs: ['monk'],
    },
    statBonuses: { MND: 3, VIT: 2, INT: 1 },
    expBonus: 1.15,
  },
  {
    jobId: 'master_artisan',
    name: '匠',
    description: '至高の技術を持つ者',
    icon: '💎',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { DEX: 10, INT: 5 },
      jobs: ['artisan'],
    },
    statBonuses: { DEX: 3, INT: 2, CHA: 1 },
    expBonus: 1.15,
  },
  {
    jobId: 'virtuoso',
    name: '名人',
    description: '芸術の極みに達した者',
    icon: '🎻',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { CHA: 10, DEX: 5 },
      jobs: ['bard'],
    },
    statBonuses: { CHA: 3, DEX: 2, MND: 1 },
    expBonus: 1.15,
  },
  {
    jobId: 'champion',
    name: 'チャンピオン',
    description: '頂点に立つアスリート',
    icon: '🏆',
    tier: 'expert',
    requirements: {
      level: 20,
      stats: { VIT: 10, STR: 5 },
      jobs: ['athlete'],
    },
    statBonuses: { VIT: 3, STR: 2, MND: 1 },
    expBonus: 1.15,
  },

  // ===== Master (達人) =====
  {
    jobId: 'hero',
    name: '英雄',
    description: '伝説に名を刻む者',
    icon: '⚔️',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { STR: 20, VIT: 12, CHA: 8 },
      jobs: ['knight'],
    },
    statBonuses: { STR: 5, VIT: 3, CHA: 2 },
    expBonus: 1.25,
  },
  {
    jobId: 'arch_sage',
    name: '大賢者',
    description: '全知に近い者',
    icon: '✨',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { INT: 20, MND: 12, DEX: 8 },
      jobs: ['sage'],
    },
    statBonuses: { INT: 5, MND: 3, DEX: 2 },
    expBonus: 1.25,
  },
  {
    jobId: 'enlightened',
    name: '覚者',
    description: '真理を見た者',
    icon: '🌟',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { MND: 20, VIT: 12, INT: 8 },
      jobs: ['high_monk'],
    },
    statBonuses: { MND: 5, VIT: 3, INT: 2 },
    expBonus: 1.25,
  },
  {
    jobId: 'legend_artisan',
    name: '伝説の職人',
    description: '神業を持つ者',
    icon: '🌈',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { DEX: 20, INT: 12, CHA: 8 },
      jobs: ['master_artisan'],
    },
    statBonuses: { DEX: 5, INT: 3, CHA: 2 },
    expBonus: 1.25,
  },
  {
    jobId: 'superstar',
    name: 'スーパースター',
    description: '世界を魅了する者',
    icon: '💫',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { CHA: 20, DEX: 12, MND: 8 },
      jobs: ['virtuoso'],
    },
    statBonuses: { CHA: 5, DEX: 3, MND: 2 },
    expBonus: 1.25,
  },
  {
    jobId: 'olympian',
    name: 'オリンピアン',
    description: '肉体の極限に達した者',
    icon: '🥇',
    tier: 'master',
    requirements: {
      level: 35,
      stats: { VIT: 20, STR: 12, MND: 8 },
      jobs: ['champion'],
    },
    statBonuses: { VIT: 5, STR: 3, MND: 2 },
    expBonus: 1.25,
  },

  // ===== Grandmaster (極致) =====
  {
    jobId: 'habit_master',
    name: '習慣の極致',
    description: 'すべてを極めた者',
    icon: '👑',
    tier: 'grandmaster',
    requirements: {
      level: 50,
      stats: { VIT: 25, INT: 25, MND: 25, DEX: 25, CHA: 25, STR: 25 },
      achievements: ['level_99', 'streak_100'],
    },
    statBonuses: { VIT: 10, INT: 10, MND: 10, DEX: 10, CHA: 10, STR: 10 },
    expBonus: 1.5,
  },
];

interface CheckJobsInput {
  userId: string;
  level: number;
  stats: {
    vitality: number;
    intelligence: number;
    mental: number;
    dexterity: number;
    charisma: number;
    strength: number;
  };
  unlockedJobs: string[];
  unlockedAchievements: string[];
}

interface JobUnlock {
  job: JobDefinition;
  unlockedAt: string;
  requirementsMet: Record<string, boolean>;
}

/**
 * ステータス値を標準形式に変換
 */
function normalizeStats(stats: CheckJobsInput['stats']): Record<string, number> {
  return {
    VIT: stats.vitality,
    INT: stats.intelligence,
    MND: stats.mental,
    DEX: stats.dexterity,
    CHA: stats.charisma,
    STR: stats.strength,
  };
}

/**
 * ジョブ解放判定を行う
 */
export const handler: Handler<CheckJobsInput, JobUnlock[]> = async (event) => {
  const { level, stats, unlockedJobs, unlockedAchievements } = event;
  const normalizedStats = normalizeStats(stats);

  const newUnlocks: JobUnlock[] = [];
  const now = new Date().toISOString();

  for (const job of JOBS) {
    // すでに解除済みの場合はスキップ
    if (unlockedJobs.includes(job.jobId)) {
      continue;
    }

    const requirementsMet: Record<string, boolean> = {};
    let allMet = true;

    // レベル要件
    if (job.requirements.level) {
      const levelMet = level >= job.requirements.level;
      requirementsMet['level'] = levelMet;
      if (!levelMet) allMet = false;
    }

    // ステータス要件
    if (job.requirements.stats) {
      for (const [stat, required] of Object.entries(job.requirements.stats)) {
        const statMet = (normalizedStats[stat] || 0) >= required;
        requirementsMet[`stat_${stat}`] = statMet;
        if (!statMet) allMet = false;
      }
    }

    // 前提ジョブ要件
    if (job.requirements.jobs) {
      for (const reqJob of job.requirements.jobs) {
        const jobMet = unlockedJobs.includes(reqJob);
        requirementsMet[`job_${reqJob}`] = jobMet;
        if (!jobMet) allMet = false;
      }
    }

    // アチーブメント要件
    if (job.requirements.achievements) {
      for (const reqAchievement of job.requirements.achievements) {
        const achievementMet = unlockedAchievements.includes(reqAchievement);
        requirementsMet[`achievement_${reqAchievement}`] = achievementMet;
        if (!achievementMet) allMet = false;
      }
    }

    if (allMet) {
      newUnlocks.push({
        job,
        unlockedAt: now,
        requirementsMet,
      });
    }
  }

  return newUnlocks;
};

// ジョブ定義をエクスポート（シード用）
export { JOBS };
