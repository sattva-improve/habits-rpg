/**
 * User関連のAPIサービス
 */

import { client } from './graphql';
import type { User, Achievement, Job, UserAchievement, UserJob } from '../types';

export const userService = {
  /**
   * ユーザー情報を取得
   */
  async getUser(userId: string): Promise<User | null> {
    const { data, errors } = await client.models.User.get({ userId });

    if (errors) {
      console.error('Failed to fetch user:', errors);
      return null;
    }

    return data as unknown as User;
  },

  /**
   * ユーザーを作成
   */
  async createUser(user: Partial<User>): Promise<User | null> {
    const { data, errors } = await client.models.User.create({
      userId: user.userId!,
      email: user.email!,
      displayName: user.displayName!,
      timezone: user.timezone ?? 'Asia/Tokyo',
      vitality: 1,
      vitalityExp: 0,
      intelligence: 1,
      intelligenceExp: 0,
      mental: 1,
      mentalExp: 0,
      dexterity: 1,
      dexterityExp: 0,
      charisma: 1,
      charismaExp: 0,
      strength: 1,
      strengthExp: 0,
      level: 1,
      totalExp: 0,
      currentJobId: 'beginner',
      maxStreak: 0,
      currentStreak: 0,
    });

    if (errors) {
      console.error('Failed to create user:', errors);
      return null;
    }

    return data as unknown as User;
  },

  /**
   * ユーザー情報を更新
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    console.log('📝 Updating user:', userId, 'with:', updates);
    const { data, errors } = await client.models.User.update({
      userId,
      ...updates,
    });

    if (errors) {
      console.error('Failed to update user:', errors);
      console.error('Error details:', JSON.stringify(errors, null, 2));
      return null;
    }

    console.log('📝 Update successful:', data);
    return data as unknown as User;
  },

  /**
   * ユーザーのアチーブメントを取得
   */
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, errors } = await client.models.UserAchievement.list({
      filter: { userId: { eq: userId } },
    });

    if (errors) {
      console.error('Failed to fetch user achievements:', errors);
      return [];
    }

    return (data ?? []) as unknown as UserAchievement[];
  },

  /**
   * 全アチーブメント一覧を取得
   */
  async getAchievements(): Promise<Achievement[]> {
    const { data, errors } = await client.models.Achievement.list();

    if (errors && errors.length > 0) {
      console.error('Failed to fetch achievements:', errors);
      // エラーの詳細を確認
      console.error('Achievement error details:', JSON.stringify(errors[0], null, 2));
      return [];
    }

    return (data ?? []) as unknown as Achievement[];
  },

  /**
   * 全ジョブ一覧を取得
   */
  async getJobs(): Promise<Job[]> {
    const { data, errors } = await client.models.Job.list();

    if (errors && errors.length > 0) {
      console.error('Failed to fetch jobs:', errors);
      // エラーの詳細を確認
      console.error('Job error details:', JSON.stringify(errors[0], null, 2));
      return [];
    }

    return (data ?? []) as unknown as Job[];
  },

  /**
   * ユーザーのジョブ状態を取得
   */
  async getUserJobs(userId: string): Promise<UserJob[]> {
    const { data, errors } = await client.models.UserJob.list({
      filter: { userId: { eq: userId } },
    });

    if (errors) {
      console.error('Failed to fetch user jobs:', errors);
      return [];
    }

    return (data ?? []) as unknown as UserJob[];
  },
};

export default userService;

