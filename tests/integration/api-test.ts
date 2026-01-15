/**
 * Habits RPG - GraphQL API テストスクリプト
 * 
 * 使い方:
 * npx ts-node test/api-test.ts
 */

import * as https from 'https';

// Amplify Sandbox設定
const CONFIG = {
  endpoint: 'https://c44kjstsh5d7rbhlw2yy7wthcu.appsync-api.us-east-1.amazonaws.com/graphql',
  apiKey: 'da2-4gyvtrzdjjaf5ero4jeb3mrcvq',
  region: 'us-east-1',
};

// GraphQLリクエスト実行
async function executeGraphQL(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const url = new URL(CONFIG.endpoint);
    
    const data = JSON.stringify({
      query,
      variables,
    });
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.apiKey,
        'Content-Length': Buffer.byteLength(data),
      },
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// テストケース
const tests = {
  // スキーマイントロスペクション
  async introspection() {
    console.log('\n📋 スキーマイントロスペクション...');
    const query = `
      query {
        __schema {
          types {
            name
            kind
          }
        }
      }
    `;
    return executeGraphQL(query);
  },

  // アチーブメント一覧取得
  async listAchievements() {
    console.log('\n🏆 アチーブメント一覧取得...');
    const query = `
      query ListAchievements {
        listAchievements {
          items {
            achievementId
            name
            description
            category
            rarity
            expReward
          }
        }
      }
    `;
    return executeGraphQL(query);
  },

  // ジョブ一覧取得
  async listJobs() {
    console.log('\n💼 ジョブ一覧取得...');
    const query = `
      query ListJobs {
        listJobs {
          items {
            jobId
            name
            description
            category
            requiredLevel
          }
        }
      }
    `;
    return executeGraphQL(query);
  },

  // キャラクタースプライト一覧取得
  async listCharacterSprites() {
    console.log('\n🎨 キャラクタースプライト一覧取得...');
    const query = `
      query ListCharacterSprites {
        listCharacterSprites {
          items {
            spriteId
            name
            description
            spriteType
            rarity
            isDefault
          }
        }
      }
    `;
    return executeGraphQL(query);
  },

  // ユーザー作成
  async createUser() {
    console.log('\n👤 ユーザー作成...');
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          userId
          email
          displayName
          level
          createdAt
        }
      }
    `;
    const variables = {
      input: {
        userId: `test-user-${Date.now()}`,
        email: `test-${Date.now()}@example.com`,
        displayName: 'テストユーザー',
        timezone: 'Asia/Tokyo',
        level: 1,
        totalExp: 0,
        vitality: 10,
        vitalityExp: 0,
        intelligence: 10,
        intelligenceExp: 0,
        mental: 10,
        mentalExp: 0,
        dexterity: 10,
        dexterityExp: 0,
        charisma: 10,
        charismaExp: 0,
        strength: 10,
        strengthExp: 0,
      },
    };
    return executeGraphQL(mutation, variables);
  },

  // 習慣作成
  async createHabit(userId: string) {
    console.log('\n📝 習慣作成...');
    const mutation = `
      mutation CreateHabit($input: CreateHabitInput!) {
        createHabit(input: $input) {
          habitId
          name
          category
          difficulty
          frequency
          createdAt
        }
      }
    `;
    const variables = {
      input: {
        habitId: `habit-${Date.now()}`,
        userId: userId,
        name: '朝の運動',
        description: '毎朝30分のジョギング',
        category: 'exercise',
        difficulty: 'normal',
        frequency: 'daily',
        targetDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        isActive: true,
      },
    };
    return executeGraphQL(mutation, variables);
  },

  // ユーザー一覧取得
  async listUsers() {
    console.log('\n👥 ユーザー一覧取得...');
    const query = `
      query ListUsers {
        listUsers {
          items {
            userId
            email
            displayName
            level
            totalExp
          }
        }
      }
    `;
    return executeGraphQL(query);
  },

  // 習慣一覧取得
  async listHabits() {
    console.log('\n📋 習慣一覧取得...');
    const query = `
      query ListHabits {
        listHabits {
          items {
            habitId
            userId
            name
            category
            difficulty
            currentStreak
          }
        }
      }
    `;
    return executeGraphQL(query);
  },
};

// メイン実行
async function main() {
  console.log('🎮 Habits RPG - GraphQL API テスト');
  console.log('=====================================');
  console.log(`📡 エンドポイント: ${CONFIG.endpoint}`);
  console.log(`🔑 API Key: ${CONFIG.apiKey.substring(0, 10)}...`);
  console.log('=====================================\n');

  const args = process.argv.slice(2);
  const testName = args[0];

  try {
    if (testName && testName in tests) {
      // 特定のテストを実行
      const result = await (tests as Record<string, () => Promise<unknown>>)[testName]();
      console.log('\n✅ 結果:');
      console.log(JSON.stringify(result, null, 2));
    } else if (testName === 'all') {
      // 全テスト実行
      for (const [name, testFn] of Object.entries(tests)) {
        if (typeof testFn === 'function' && !name.includes('create')) {
          try {
            const result = await testFn();
            console.log(`✅ ${name}: 成功`);
            console.log(JSON.stringify(result, null, 2));
          } catch (error) {
            console.log(`❌ ${name}: 失敗`, error);
          }
        }
      }
    } else {
      // ヘルプ表示
      console.log('使用方法:');
      console.log('  npx ts-node test/api-test.ts <テスト名>');
      console.log('  npx ts-node test/api-test.ts all');
      console.log('\n利用可能なテスト:');
      Object.keys(tests).forEach(name => {
        console.log(`  - ${name}`);
      });
      
      // デフォルトでイントロスペクションを実行
      console.log('\n🔍 デフォルトでイントロスペクションを実行します...');
      const result = await tests.introspection();
      console.log('\n✅ 結果:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

main();
