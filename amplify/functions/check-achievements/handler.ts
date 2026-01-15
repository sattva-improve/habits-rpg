import type { Handler } from 'aws-lambda';

/**
 * アチーブメント定義
 */
interface AchievementDefinition {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'total' | 'level' | 'stat' | 'special' | 'first';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  expReward: number;
  targetValue: number;
  targetStatType?: string;
  isHidden?: boolean;
}

/**
 * デフォルトアチーブメント一覧
 */
const ACHIEVEMENTS: AchievementDefinition[] = [
  // First achievements
  {
    achievementId: 'first_habit',
    name: '最初の習慣',
    description: '最初の習慣を作成する',
    icon: '🎉',
    type: 'first',
    rarity: 'common',
    expReward: 20,
    targetValue: 1,
  },
  {
    achievementId: 'first_completion',
    name: '第一歩',
    description: '最初の習慣達成を記録する',
    icon: '👣',
    type: 'first',
    rarity: 'common',
    expReward: 30,
    targetValue: 1,
  },

  // Streak achievements
  {
    achievementId: 'streak_3',
    name: '三日坊主を超えて',
    description: '3日連続で習慣を達成する',
    icon: '🔥',
    type: 'streak',
    rarity: 'common',
    expReward: 50,
    targetValue: 3,
  },
  {
    achievementId: 'streak_7',
    name: '一週間の習慣',
    description: '7日連続で習慣を達成する',
    icon: '🔥',
    type: 'streak',
    rarity: 'uncommon',
    expReward: 100,
    targetValue: 7,
  },
  {
    achievementId: 'streak_14',
    name: '二週間マスター',
    description: '14日連続で習慣を達成する',
    icon: '🔥',
    type: 'streak',
    rarity: 'uncommon',
    expReward: 200,
    targetValue: 14,
  },
  {
    achievementId: 'streak_30',
    name: '月間マスター',
    description: '30日連続で習慣を達成する',
    icon: '🔥',
    type: 'streak',
    rarity: 'rare',
    expReward: 500,
    targetValue: 30,
  },
  {
    achievementId: 'streak_60',
    name: '習慣の達人',
    description: '60日連続で習慣を達成する',
    icon: '🏆',
    type: 'streak',
    rarity: 'epic',
    expReward: 1000,
    targetValue: 60,
  },
  {
    achievementId: 'streak_100',
    name: '伝説の習慣家',
    description: '100日連続で習慣を達成する',
    icon: '👑',
    type: 'streak',
    rarity: 'legendary',
    expReward: 2000,
    targetValue: 100,
  },

  // Total completion achievements
  {
    achievementId: 'total_10',
    name: '10回達成',
    description: '習慣を合計10回達成する',
    icon: '⭐',
    type: 'total',
    rarity: 'common',
    expReward: 50,
    targetValue: 10,
  },
  {
    achievementId: 'total_50',
    name: '50回達成',
    description: '習慣を合計50回達成する',
    icon: '⭐',
    type: 'total',
    rarity: 'uncommon',
    expReward: 150,
    targetValue: 50,
  },
  {
    achievementId: 'total_100',
    name: '100回達成',
    description: '習慣を合計100回達成する',
    icon: '🌟',
    type: 'total',
    rarity: 'rare',
    expReward: 300,
    targetValue: 100,
  },
  {
    achievementId: 'total_500',
    name: '500回達成',
    description: '習慣を合計500回達成する',
    icon: '💎',
    type: 'total',
    rarity: 'epic',
    expReward: 1000,
    targetValue: 500,
  },
  {
    achievementId: 'total_1000',
    name: '1000回達成',
    description: '習慣を合計1000回達成する',
    icon: '👑',
    type: 'total',
    rarity: 'legendary',
    expReward: 2500,
    targetValue: 1000,
  },

  // Level achievements
  {
    achievementId: 'level_10',
    name: 'レベル10',
    description: 'レベル10に到達する',
    icon: '📈',
    type: 'level',
    rarity: 'common',
    expReward: 100,
    targetValue: 10,
  },
  {
    achievementId: 'level_25',
    name: 'レベル25',
    description: 'レベル25に到達する',
    icon: '📈',
    type: 'level',
    rarity: 'uncommon',
    expReward: 250,
    targetValue: 25,
  },
  {
    achievementId: 'level_50',
    name: 'レベル50',
    description: 'レベル50に到達する',
    icon: '📊',
    type: 'level',
    rarity: 'rare',
    expReward: 500,
    targetValue: 50,
  },
  {
    achievementId: 'level_99',
    name: 'カンスト達成',
    description: 'レベル99に到達する',
    icon: '🎖️',
    type: 'level',
    rarity: 'legendary',
    expReward: 5000,
    targetValue: 99,
  },

  // Stat achievements
  {
    achievementId: 'stat_vit_10',
    name: '体力の達人',
    description: '体力(VIT)がレベル10に到達する',
    icon: '💪',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'VIT',
  },
  {
    achievementId: 'stat_int_10',
    name: '知恵の達人',
    description: '知力(INT)がレベル10に到達する',
    icon: '📚',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'INT',
  },
  {
    achievementId: 'stat_mnd_10',
    name: '精神の達人',
    description: '精神(MND)がレベル10に到達する',
    icon: '🧘',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'MND',
  },
  {
    achievementId: 'stat_dex_10',
    name: '器用の達人',
    description: '器用(DEX)がレベル10に到達する',
    icon: '🎨',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'DEX',
  },
  {
    achievementId: 'stat_cha_10',
    name: '魅力の達人',
    description: '魅力(CHA)がレベル10に到達する',
    icon: '✨',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'CHA',
  },
  {
    achievementId: 'stat_str_10',
    name: '筋力の達人',
    description: '筋力(STR)がレベル10に到達する',
    icon: '🏋️',
    type: 'stat',
    rarity: 'rare',
    expReward: 300,
    targetValue: 10,
    targetStatType: 'STR',
  },

  // Special achievements
  {
    achievementId: 'early_bird',
    name: '早起きの鳥',
    description: '午前6時前に習慣を達成する',
    icon: '🐦',
    type: 'special',
    rarity: 'uncommon',
    expReward: 100,
    targetValue: 1,
    isHidden: true,
  },
  {
    achievementId: 'night_owl',
    name: '夜のフクロウ',
    description: '深夜0時以降に習慣を達成する',
    icon: '🦉',
    type: 'special',
    rarity: 'uncommon',
    expReward: 100,
    targetValue: 1,
    isHidden: true,
  },
  {
    achievementId: 'variety_master',
    name: '多彩な習慣家',
    description: '5種類以上のカテゴリで習慣を作成する',
    icon: '🎭',
    type: 'special',
    rarity: 'rare',
    expReward: 500,
    targetValue: 5,
  },
  {
    achievementId: 'perfect_week',
    name: '完璧な一週間',
    description: '1週間すべての習慣を達成する',
    icon: '🌈',
    type: 'special',
    rarity: 'rare',
    expReward: 500,
    targetValue: 1,
  },
];

interface CheckAchievementsInput {
  userId: string;
  currentStreak: number;
  totalCompletions: number;
  level: number;
  stats: {
    vitality: number;
    intelligence: number;
    mental: number;
    dexterity: number;
    charisma: number;
    strength: number;
  };
  unlockedAchievements: string[];
}

interface AchievementUnlock {
  achievement: AchievementDefinition;
  unlockedAt: string;
}

/**
 * アチーブメント判定を行う
 */
export const handler: Handler<CheckAchievementsInput, AchievementUnlock[]> = async (event) => {
  const { currentStreak, totalCompletions, level, stats, unlockedAchievements } = event;

  const newUnlocks: AchievementUnlock[] = [];
  const now = new Date().toISOString();

  for (const achievement of ACHIEVEMENTS) {
    // すでに解除済みの場合はスキップ
    if (unlockedAchievements.includes(achievement.achievementId)) {
      continue;
    }

    let shouldUnlock = false;

    switch (achievement.type) {
      case 'streak':
        shouldUnlock = currentStreak >= achievement.targetValue;
        break;

      case 'total':
        shouldUnlock = totalCompletions >= achievement.targetValue;
        break;

      case 'level':
        shouldUnlock = level >= achievement.targetValue;
        break;

      case 'stat':
        if (achievement.targetStatType) {
          const statMap: Record<string, number> = {
            VIT: stats.vitality,
            INT: stats.intelligence,
            MND: stats.mental,
            DEX: stats.dexterity,
            CHA: stats.charisma,
            STR: stats.strength,
          };
          shouldUnlock = (statMap[achievement.targetStatType] || 0) >= achievement.targetValue;
        }
        break;

      case 'first':
        // firstタイプは別のイベントでトリガー
        break;

      case 'special':
        // specialタイプは別途ロジックで判定
        break;
    }

    if (shouldUnlock) {
      newUnlocks.push({
        achievement,
        unlockedAt: now,
      });
    }
  }

  return newUnlocks;
};

// アチーブメント定義をエクスポート（シード用）
export { ACHIEVEMENTS };
