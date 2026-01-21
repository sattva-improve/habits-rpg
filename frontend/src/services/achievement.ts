/**
 * アチーブメントチェックサービス
 * 習慣完了時などにアチーブメント達成をチェック
 */

import { client } from './graphql';
import type { User, Achievement, UserAchievement, Habit, Job, UserJob } from '../types';

// ステータスタイプからユーザーフィールドへのマッピング
const STAT_TYPE_TO_FIELD: Record<string, keyof User> = {
  VIT: 'vitality',
  INT: 'intelligence',
  MND: 'mental',
  DEX: 'dexterity',
  CHA: 'charisma',
  STR: 'strength',
};

interface AchievementCheckResult {
  newlyUnlocked: Achievement[];
  totalExpBonus: number;
}

interface JobCheckResult {
  newlyUnlocked: Job[];
}

export const achievementService = {
  /**
   * ユーザーのアチーブメント達成状況をチェック
   */
  async checkAchievements(
    user: User,
    habits: Habit[],
    achievements: Achievement[],
    userAchievements: UserAchievement[]
  ): Promise<AchievementCheckResult> {
    const newlyUnlocked: Achievement[] = [];
    let totalExpBonus = 0;

    // 未解除のアチーブメントのみチェック
    const unlockedIds = new Set(
      userAchievements.filter(ua => ua.isUnlocked).map(ua => ua.achievementId)
    );

    for (const achievement of achievements) {
      // 既に解除済みならスキップ
      if (unlockedIds.has(achievement.achievementId)) {
        continue;
      }

      // 達成条件をチェック
      const isAchieved = this.checkAchievementCondition(achievement, user, habits);

      if (isAchieved) {
        // アチーブメント解除
        const unlocked = await this.unlockAchievement(user.userId, achievement);
        if (unlocked) {
          newlyUnlocked.push(achievement);
          totalExpBonus += achievement.expReward;
        }
      }
    }

    // 経験値ボーナスをユーザーに付与
    if (totalExpBonus > 0) {
      await this.addExpBonus(user.userId, user.totalExp, totalExpBonus);
    }

    return { newlyUnlocked, totalExpBonus };
  },

  /**
   * アチーブメント達成条件をチェック
   */
  checkAchievementCondition(
    achievement: Achievement,
    user: User,
    habits: Habit[]
  ): boolean {
    const targetValue = achievement.targetValue;

    switch (achievement.type) {
      case 'first': {
        // 最初の習慣作成/完了
        if (achievement.achievementId === 'first_habit') {
          return habits.length >= 1;
        }
        if (achievement.achievementId === 'first_completion') {
          const totalCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions ?? 0), 0);
          return totalCompletions >= 1;
        }
        return false;
      }

      case 'streak': {
        // 連続記録
        return (user.maxStreak ?? 0) >= targetValue;
      }

      case 'total': {
        // 合計達成回数
        const totalCompletions = habits.reduce((sum, h) => sum + (h.totalCompletions ?? 0), 0);
        return totalCompletions >= targetValue;
      }

      case 'level': {
        // レベル達成
        return (user.level ?? 1) >= targetValue;
      }

      case 'stat': {
        // ステータス達成
        if (!achievement.targetStatType) return false;
        const statField = STAT_TYPE_TO_FIELD[achievement.targetStatType];
        if (!statField) return false;
        const statValue = (user[statField] as number) ?? 1;
        return statValue >= targetValue;
      }

      default:
        return false;
    }
  },

  /**
   * アチーブメントを解除
   */
  async unlockAchievement(
    userId: string,
    achievement: Achievement
  ): Promise<boolean> {
    try {
      // 既存のUserAchievementを確認
      const { data: existing } = await client.models.UserAchievement.list({
        filter: {
          userId: { eq: userId },
          achievementId: { eq: achievement.achievementId },
        },
      });

      if (existing && existing.length > 0) {
        // 既存レコードを更新
        const userAch = existing[0];
        const { errors } = await client.models.UserAchievement.update({
          id: userAch.id,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        });

        if (errors) {
          console.error('Failed to update user achievement:', errors);
          return false;
        }
      } else {
        // 新規作成
        const { errors } = await client.models.UserAchievement.create({
          id: crypto.randomUUID(),
          userId,
          achievementId: achievement.achievementId,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
          currentValue: achievement.targetValue,
        });

        if (errors) {
          console.error('Failed to create user achievement:', errors);
          return false;
        }
      }

      console.log(`🏆 Achievement unlocked: ${achievement.name}`);
      return true;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return false;
    }
  },

  /**
   * 経験値ボーナスを付与
   */
  async addExpBonus(
    userId: string,
    currentExp: number,
    bonus: number
  ): Promise<void> {
    try {
      await client.models.User.update({
        userId,
        totalExp: currentExp + bonus,
      });
      console.log(`+${bonus} EXP from achievements!`);
    } catch (error) {
      console.error('Failed to add exp bonus:', error);
    }
  },

  /**
   * 初回ログイン時にユーザーのアチーブメント進捗を初期化
   */
  async initializeUserAchievements(
    userId: string,
    achievements: Achievement[]
  ): Promise<void> {
    const { data: existing } = await client.models.UserAchievement.list({
      filter: { userId: { eq: userId } },
    });

    const existingIds = new Set(existing?.map((ua: { achievementId: string }) => ua.achievementId) ?? []);

    for (const achievement of achievements) {
      if (!existingIds.has(achievement.achievementId)) {
        try {
          await client.models.UserAchievement.create({
            id: crypto.randomUUID(),
            userId,
            achievementId: achievement.achievementId,
            isUnlocked: false,
            currentValue: 0,
          });
        } catch (error) {
          // 重複エラーは無視
          console.log(`UserAchievement for ${achievement.achievementId} may already exist`);
        }
      }
    }
  },

  /**
   * ジョブ解放条件をチェック
   */
  async checkJobs(
    user: User,
    jobs: Job[],
    userJobs: UserJob[],
    userAchievements: UserAchievement[]
  ): Promise<JobCheckResult> {
    const newlyUnlocked: Job[] = [];

    // 解放済みジョブのIDセット
    const unlockedJobIds = new Set(
      userJobs.filter(uj => uj.isUnlocked).map(uj => uj.jobId)
    );
    // beginnerは常に解放済み扱い
    unlockedJobIds.add('beginner');

    // 解放済みアチーブメントのIDセット
    const unlockedAchievementIds = new Set(
      userAchievements.filter(ua => ua.isUnlocked).map(ua => ua.achievementId)
    );

    // ユーザーのステータスを標準化
    const userStats: Record<string, number> = {
      VIT: user.vitality ?? 1,
      INT: user.intelligence ?? 1,
      MND: user.mental ?? 1,
      DEX: user.dexterity ?? 1,
      CHA: user.charisma ?? 1,
      STR: user.strength ?? 1,
    };

    for (const job of jobs) {
      // 既に解放済みならスキップ
      if (unlockedJobIds.has(job.jobId)) {
        continue;
      }

      // 解放条件をチェック
      // requirementsがJSON文字列の場合はパースする
      let requirements: {
        level?: number;
        stats?: Record<string, number>;
        jobs?: string[];
        achievements?: string[];
      } | undefined;
      
      if (typeof job.requirements === 'string') {
        try {
          requirements = JSON.parse(job.requirements);
        } catch {
          console.error(`Failed to parse job requirements for ${job.jobId}:`, job.requirements);
          requirements = undefined;
        }
      } else {
        requirements = job.requirements as typeof requirements;
      }

      // 要件がない、または空オブジェクトの場合
      const hasRequirements = requirements && (
        requirements.level !== undefined ||
        requirements.stats !== undefined ||
        requirements.jobs !== undefined ||
        requirements.achievements !== undefined
      );

      if (!hasRequirements || !requirements) {
        // 要件がなければ解放可能（beginnerのみ該当）
        // ただし、beginnerは最初から解放済み扱いなのでここに来るのは異常
        console.log(`⚠️ Job ${job.jobId} has no requirements, skipping auto-unlock`);
        continue;
      }

      let allMet = true;
      const failedRequirements: string[] = [];

      // レベル要件
      if (requirements.level && (user.level ?? 1) < requirements.level) {
        allMet = false;
        failedRequirements.push(`level: need ${requirements.level}, have ${user.level ?? 1}`);
      }

      // ステータス要件
      if (requirements.stats && allMet) {
        for (const [stat, required] of Object.entries(requirements.stats)) {
          const currentValue = userStats[stat] ?? 0;
          if (currentValue < required) {
            allMet = false;
            failedRequirements.push(`${stat}: need ${required}, have ${currentValue}`);
            break;
          }
        }
      }

      // 前提ジョブ要件
      if (requirements.jobs && allMet) {
        for (const reqJob of requirements.jobs) {
          if (!unlockedJobIds.has(reqJob)) {
            allMet = false;
            failedRequirements.push(`job: need ${reqJob}`);
            break;
          }
        }
      }

      // アチーブメント要件
      if (requirements.achievements && allMet) {
        for (const reqAch of requirements.achievements) {
          if (!unlockedAchievementIds.has(reqAch)) {
            allMet = false;
            failedRequirements.push(`achievement: need ${reqAch}`);
            break;
          }
        }
      }

      // デバッグログ
      if (!allMet) {
        console.log(`🔒 Job ${job.jobId} (${job.name}) not met:`, failedRequirements.join(', '));
      }

      if (allMet) {
        console.log(`🔓 Job ${job.jobId} (${job.name}) requirements met! Unlocking...`);
        const unlocked = await this.unlockJob(user.userId, job.jobId);
        if (unlocked) {
          newlyUnlocked.push(job);
          unlockedJobIds.add(job.jobId);
        }
      }
    }

    return { newlyUnlocked };
  },

  /**
   * ジョブを解放
   */
  async unlockJob(userId: string, jobId: string): Promise<boolean> {
    try {
      // 既存のUserJobを確認
      const { data: existing } = await client.models.UserJob.list({
        filter: {
          userId: { eq: userId },
          jobId: { eq: jobId },
        },
      });

      if (existing && existing.length > 0) {
        // 既存レコードを更新
        const userJob = existing[0];
        const { errors } = await client.models.UserJob.update({
          id: userJob.id,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
        });

        if (errors) {
          console.error('Failed to update user job:', errors);
          return false;
        }
      } else {
        // 新規作成
        const { errors } = await client.models.UserJob.create({
          id: crypto.randomUUID(),
          userId,
          jobId,
          isUnlocked: true,
          isEquipped: false,
          unlockedAt: new Date().toISOString(),
        });

        if (errors) {
          console.error('Failed to create user job:', errors);
          return false;
        }
      }

      console.log(`⚔️ Job unlocked: ${jobId}`);
      return true;
    } catch (error) {
      console.error('Error unlocking job:', error);
      return false;
    }
  },
};

export default achievementService;
