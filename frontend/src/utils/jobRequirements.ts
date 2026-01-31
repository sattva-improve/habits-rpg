/**
 * ジョブ解放条件のチェックと進捗計算
 */

import type { JobRequirements, User, UserJob, UserAchievement, StatType } from '@/types';

/**
 * 条件チェック結果
 */
export interface RequirementCheckResult {
  type: 'level' | 'stats' | 'jobs' | 'achievements';
  label: string; // 日本語表示
  required: number | string; // 必要値
  current: number | string; // 現在値
  isMet: boolean; // 達成しているか
  percentage: number; // 達成率（0-100）
}

/**
 * ステータス名マッピング
 */
const STAT_NAMES: Record<StatType, string> = {
  VIT: 'たいりょく',
  INT: 'かしこさ',
  MND: 'せいしん',
  DEX: 'きようさ',
  CHA: 'みりょく',
  STR: 'ちから',
};

/**
 * ステータスキーからユーザーの値を取得
 */
function getUserStatValue(user: User, stat: StatType): number {
  const statMap: Record<StatType, keyof User> = {
    VIT: 'vitality',
    INT: 'intelligence',
    MND: 'mental',
    DEX: 'dexterity',
    CHA: 'charisma',
    STR: 'strength',
  };
  const value = user[statMap[stat]];
  return typeof value === 'number' ? value : 0;
}

/**
 * ジョブ解放条件をチェック
 */
export function checkJobRequirements(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[],
  allJobs?: Array<{ jobId: string; name: string }>,
  allAchievements?: Array<{ achievementId: string; name: string }>
): RequirementCheckResult[] {
  const results: RequirementCheckResult[] = [];

  // レベルチェック
  if (requirements.level !== undefined && user.level != null) {
    const currentLevel = user.level;
    const requiredLevel = requirements.level;
    const isMet = currentLevel >= requiredLevel;
    const percentage = Math.min((currentLevel / requiredLevel) * 100, 100);

    results.push({
      type: 'level',
      label: 'レベル',
      required: requiredLevel,
      current: currentLevel,
      isMet,
      percentage,
    });
  }

  // ステータスチェック
  if (requirements.stats) {
    for (const [statKey, requiredValue] of Object.entries(requirements.stats)) {
      const stat = statKey as StatType;
      const currentValue = getUserStatValue(user, stat);
      const requiredNum = requiredValue as number;
      const isMet = currentValue >= requiredNum;
      const percentage = Math.min((currentValue / requiredNum) * 100, 100);

      results.push({
        type: 'stats',
        label: STAT_NAMES[stat] ?? stat,
        required: requiredNum,
        current: currentValue,
        isMet,
        percentage,
      });
    }
  }

  // 前提ジョブチェック
  if (requirements.jobs && requirements.jobs.length > 0) {
    for (const jobId of requirements.jobs) {
      const isUnlocked = userJobs.some(
        (uj) => uj.jobId === jobId && uj.isUnlocked
      );
      
      // ジョブ名を取得
      const jobName = allJobs?.find((j) => j.jobId === jobId)?.name ?? jobId;

      results.push({
        type: 'jobs',
        label: 'しょくぎょう',
        required: jobName,
        current: isUnlocked ? 'かいほうずみ' : 'みかいほう',
        isMet: isUnlocked,
        percentage: isUnlocked ? 100 : 0,
      });
    }
  }

  // アチーブメントチェック
  if (requirements.achievements && requirements.achievements.length > 0) {
    for (const achId of requirements.achievements) {
      const isUnlocked = userAchievements.some(
        (ua) => ua.achievementId === achId && ua.isUnlocked
      );

      // アチーブメント名を取得
      const achName = allAchievements?.find((a) => a.achievementId === achId)?.name ?? achId;

      results.push({
        type: 'achievements',
        label: 'しょうごう',
        required: achName,
        current: isUnlocked ? 'かいほうずみ' : 'みかいほう',
        isMet: isUnlocked,
        percentage: isUnlocked ? 100 : 0,
      });
    }
  }

  return results;
}

/**
 * ジョブが解放可能かどうか
 */
export function isJobUnlockable(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[]
): boolean {
  const results = checkJobRequirements(requirements, user, userJobs, userAchievements);
  return results.every((r) => r.isMet);
}

/**
 * 達成率を計算
 */
export function getJobUnlockProgress(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[]
): { completed: number; total: number; percentage: number } {
  const results = checkJobRequirements(requirements, user, userJobs, userAchievements);
  const completed = results.filter((r) => r.isMet).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
