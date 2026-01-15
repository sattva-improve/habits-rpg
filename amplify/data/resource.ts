import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Habit Tracker RPG データスキーマ
 * OpenAPI仕様に基づくデータモデル定義
 */
const schema = a.schema({
  // ===== Enums =====
  HabitCategory: a.enum([
    'exercise',
    'sleep',
    'health',
    'reading',
    'study',
    'learning',
    'meditation',
    'journaling',
    'gratitude',
    'mindfulness',
    'music',
    'art',
    'craft',
    'hobby',
    'communication',
    'social',
    'grooming',
    'workout',
    'sports',
    'fitness',
    'other',
  ]),

  FrequencyType: a.enum(['daily', 'weekly', 'specific_days']),

  HabitDifficulty: a.enum(['easy', 'normal', 'hard', 'very_hard']),

  StatType: a.enum(['VIT', 'INT', 'MND', 'DEX', 'CHA', 'STR']),

  AchievementType: a.enum(['streak', 'total', 'level', 'stat', 'special', 'first']),

  AchievementRarity: a.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),

  JobTier: a.enum(['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster']),

  // ===== User Model =====
  User: a
    .model({
      userId: a.id().required(),
      email: a.email().required(),
      // Profile
      displayName: a.string().required(),
      avatarUrl: a.string(),
      avatarKey: a.string(), // S3のキャラクタードット絵のパス
      bio: a.string(),
      timezone: a.string().default('Asia/Tokyo'),
      gender: a.string().default('male'), // 'male' | 'female'
      // Stats
      vitality: a.integer().default(1),
      vitalityExp: a.integer().default(0),
      intelligence: a.integer().default(1),
      intelligenceExp: a.integer().default(0),
      mental: a.integer().default(1),
      mentalExp: a.integer().default(0),
      dexterity: a.integer().default(1),
      dexterityExp: a.integer().default(0),
      charisma: a.integer().default(1),
      charismaExp: a.integer().default(0),
      strength: a.integer().default(1),
      strengthExp: a.integer().default(0),
      // Level & EXP
      level: a.integer().default(1),
      totalExp: a.integer().default(0),
      // Job
      currentJobId: a.string().default('beginner'),
      // Streaks
      maxStreak: a.integer().default(0),
      currentStreak: a.integer().default(0),
      // Relations
      habits: a.hasMany('Habit', 'userId'),
      habitRecords: a.hasMany('HabitRecord', 'userId'),
      userAchievements: a.hasMany('UserAchievement', 'userId'),
      userJobs: a.hasMany('UserJob', 'userId'),
    })
    .identifier(['userId'])
    .authorization((allow) => [
      allow.ownerDefinedIn('userId').to(['create', 'read', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // ===== Habit Model =====
  Habit: a
    .model({
      habitId: a.id().required(),
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      name: a.string().required(),
      description: a.string(),
      icon: a.string().default('📝'),
      color: a.string().default('#4CAF50'),
      category: a.string(), // HabitCategory enum value
      statType: a.string(), // StatType enum value
      // Frequency
      frequencyType: a.string().default('daily'), // FrequencyType enum value
      timesPerWeek: a.integer(),
      specificDays: a.integer().array(), // 0-6 (日-土)
      // Difficulty
      difficulty: a.string().default('normal'), // HabitDifficulty enum value
      // Reminder
      reminderEnabled: a.boolean().default(false),
      reminderTime: a.string(), // HH:mm:ss format
      // Streaks
      currentStreak: a.integer().default(0),
      bestStreak: a.integer().default(0),
      totalCompletions: a.integer().default(0),
      // Status
      isActive: a.boolean().default(true),
      isArchived: a.boolean().default(false),
      lastCompletedAt: a.datetime(),
      createdAt: a.datetime(),
      // Records
      records: a.hasMany('HabitRecord', 'habitId'),
    })
    .identifier(['habitId'])
    .secondaryIndexes((index) => [index('userId').queryField('habitsByUserId')])
    .authorization((allow) => [allow.ownerDefinedIn('userId').to(['create', 'read', 'update', 'delete'])]),

  // ===== HabitRecord Model =====
  HabitRecord: a
    .model({
      recordId: a.id().required(),
      habitId: a.id().required(),
      userId: a.id().required(),
      habit: a.belongsTo('Habit', 'habitId'),
      user: a.belongsTo('User', 'userId'),
      completedDate: a.date().required(),
      completed: a.boolean().default(true),
      note: a.string(),
      expEarned: a.integer().default(0),
      streakAtCompletion: a.integer().default(0),
    })
    .identifier(['recordId'])
    .secondaryIndexes((index) => [
      index('habitId').queryField('recordsByHabitId'),
      index('userId').queryField('recordsByUserId'),
    ])
    .authorization((allow) => [allow.ownerDefinedIn('userId').to(['create', 'read', 'update', 'delete'])]),

  // ===== Achievement Model =====
  Achievement: a
    .model({
      achievementId: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      icon: a.string().required(),
      type: a.string().required(), // AchievementType enum value
      rarity: a.string().required(), // AchievementRarity enum value
      expReward: a.integer().default(0),
      isHidden: a.boolean().default(false),
      // 条件
      targetValue: a.integer().default(1),
      targetStatType: a.string(), // StatType enum value
      // Relations
      userAchievements: a.hasMany('UserAchievement', 'achievementId'),
    })
    .identifier(['achievementId'])
    .authorization((allow) => [allow.authenticated().to(['create', 'read'])]),

  // ===== UserAchievement Model =====
  UserAchievement: a
    .model({
      id: a.id().required(),
      userId: a.id().required(),
      achievementId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      achievement: a.belongsTo('Achievement', 'achievementId'),
      isUnlocked: a.boolean().default(false),
      unlockedAt: a.datetime(),
      currentValue: a.integer().default(0),
    })
    .identifier(['id'])
    .secondaryIndexes((index) => [index('userId').queryField('userAchievementsByUserId')])
    .authorization((allow) => [allow.ownerDefinedIn('userId').to(['create', 'read', 'update'])]),

  // ===== Job Model =====
  Job: a
    .model({
      jobId: a.id().required(),
      name: a.string().required(),
      description: a.string().required(),
      icon: a.string().required(),
      tier: a.string().required(), // JobTier enum value
      // Requirements (JSON形式で柔軟に保存)
      requirements: a.json(),
      // Bonuses
      statBonuses: a.json(), // { "STR": 1, "VIT": 2 }
      expBonus: a.float().default(1.0),
      // Relations
      userJobs: a.hasMany('UserJob', 'jobId'),
    })
    .identifier(['jobId'])
    .authorization((allow) => [allow.authenticated().to(['create', 'read'])]),

  // ===== UserJob Model =====
  UserJob: a
    .model({
      id: a.id().required(),
      userId: a.id().required(),
      jobId: a.id().required(),
      user: a.belongsTo('User', 'userId'),
      job: a.belongsTo('Job', 'jobId'),
      isUnlocked: a.boolean().default(false),
      isEquipped: a.boolean().default(false),
      unlockedAt: a.datetime(),
    })
    .identifier(['id'])
    .secondaryIndexes((index) => [index('userId').queryField('userJobsByUserId')])
    .authorization((allow) => [allow.ownerDefinedIn('userId').to(['create', 'read', 'update'])]),

  // ===== CharacterSprite Model (ドット絵管理) =====
  CharacterSprite: a
    .model({
      spriteId: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      category: a.string().required(), // 'base', 'outfit', 'accessory', 'effect'
      // S3パス
      spriteKey: a.string().required(),
      thumbnailKey: a.string(),
      // メタデータ
      frameCount: a.integer().default(1), // アニメーションフレーム数
      width: a.integer().required(),
      height: a.integer().required(),
      // 取得条件
      unlockCondition: a.json(), // { level: 10 } or { achievement: 'xxx' }
      isDefault: a.boolean().default(false),
    })
    .identifier(['spriteId'])
    .authorization((allow) => [allow.authenticated().to(['read'])]),

  // ===== UserSprite Model (ユーザーが所有・使用中のスプライト) =====
  UserSprite: a
    .model({
      id: a.id().required(),
      userId: a.id().required(),
      spriteId: a.id().required(),
      isUnlocked: a.boolean().default(false),
      isEquipped: a.boolean().default(false),
      equippedSlot: a.string(), // 'base', 'outfit', 'accessory', etc.
      unlockedAt: a.datetime(),
    })
    .identifier(['id'])
    .secondaryIndexes((index) => [index('userId').queryField('userSpritesByUserId')])
    .authorization((allow) => [allow.ownerDefinedIn('userId').to(['create', 'read', 'update'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
