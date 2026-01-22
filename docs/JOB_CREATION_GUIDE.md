# ジョブ追加ガイド（AI Agent対応版）

このドキュメントでは、新しいジョブを追加するための手順を説明します。AI agentがこの手順に従って半自動でジョブ追加を行えます。

## 概要

ジョブ追加には以下の3ステップが必要です：

1. **ジョブの定義追加** - `shared/constants/jobs.ts` にジョブ情報を追加
2. **画像の生成** - Stable Diffusion WebUIでスプライト画像を生成（白背景付き）
3. **デプロイ** - コミット＆プッシュでGitHub Actionsが自動デプロイ＆DynamoDBシーディング

---

## ステップ1: ジョブの定義追加

### 1.1 ジョブ定義の追加

**ファイル**: `shared/constants/jobs.ts`

`JOBS` 配列に新しいジョブを追加します。

#### ジョブ定義の構造

型定義は `shared/types/index.ts` にあります：

\`\`\`typescript
interface JobDefinition {
  jobId: string;           // 一意のID（英数字、アンダースコア）
  name: string;            // 日本語表示名
  description: string;     // 説明文
  icon: string;            // 絵文字アイコン
  tier: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster';
  requirements: {
    level?: number;        // 必要レベル
    stats?: Partial<Record<'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR', number>>;
    achievements?: string[]; // 必要アチーブメント
    jobs?: string[];       // 前提ジョブ
  };
  statBonuses: Partial<Record<'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR', number>>;
  expBonus: number;        // 経験値ボーナス倍率
}
\`\`\`

#### ティア別ガイドライン

| ティア | 必要レベル目安 | ステータスボーナス | 経験値ボーナス |
|--------|---------------|------------------|---------------|
| novice | なし | なし | 1.0 |
| apprentice | なし | +1 (単一) | 1.05 |
| journeyman | 10 | +2 (メイン), +1 (サブ) | 1.1 |
| expert | 20 | +3 (メイン), +2 (サブ) | 1.15 |
| master | 30 | +4 (メイン), +2 (サブ×2) | 1.2 |
| grandmaster | 50 | +5 (メイン), +3 (サブ×2) | 1.3 |

#### 複合ステータス系ジョブの条件設計

複数のステータスを要求するジョブの場合：

\`\`\`typescript
{
  jobId: 'ninja',
  name: '忍者',
  description: '影に潜み、俊敏に動く者',
  icon: '🥷',
  tier: 'journeyman',
  requirements: {
    level: 10,
    stats: { DEX: 5, STR: 3 },  // 複数ステータス要求
    jobs: ['warrior_apprentice', 'artisan_apprentice'],  // 複数前提ジョブ
  },
  statBonuses: { DEX: 2, STR: 1 },  // 複数ボーナス
  expBonus: 1.1,
},
\`\`\`

### 1.2 DynamoDB自動シーディング

**ファイル**: `scripts/seed-jobs.js`

`shared/constants/jobs.ts` の定義は GitHub Actions で自動的にDynamoDBにシーディングされます。
ジョブを `JOBS` 配列に追加するだけで、push時に自動でDynamoDBにレコードが作成されます。

---

## ステップ2: 画像の生成

### 2.1 前提条件

- Stable Diffusion WebUIが起動していること（\`--api\` フラグ付き）
- URL: \`http://127.0.0.1:7860\`
- LoRA: \`Dungeon_Squad_IllustriousV5\` がインストール済み

### 2.2 プロンプトの作成

**重要**: すべての画像は**白背景付き**で生成します。背景透過処理は行いません。

#### テンプレート（等身別）

**3等身（ちびキャラ）- beginner, apprentice系**:
\`\`\`
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, simple background, white background, full body, standing, front view, [gender], [job description], no mouth, brown hair
\`\`\`

**4等身（スタンダード）- journeyman以上**:
\`\`\`
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, simple background, white background, full body, standing, front view, [gender], [job description], no mouth, brown hair
\`\`\`

#### 性別
- 男性: \`1 boy\`
- 女性: \`1 girl\`

#### ネガティブプロンプト

\`\`\`
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, castle, building, landscape, [除外性別]
\`\`\`

### 2.3 生成パラメータ

| パラメータ | 値 |
|-----------|-----|
| width | 768 |
| height | 768 |
| cfg_scale | 7 |
| steps | 20 |
| sampler_name | Euler a |
| CLIP_stop_at_last_layers | 2 |

### 2.4 API呼び出し（PowerShell）

\`\`\`powershell
# 男性画像
\$body = @{
    prompt = "<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, simple background, white background, full body, standing, front view, 1 boy, [job description], no mouth, brown hair"
    negative_prompt = "worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, castle, building, landscape, 1 girl"
    width = 768
    height = 768
    cfg_scale = 7
    steps = 20
    sampler_name = "Euler a"
    override_settings = @{
        CLIP_stop_at_last_layers = 2
    }
} | ConvertTo-Json -Depth 10

\$response = Invoke-RestMethod -Uri "http://127.0.0.1:7860/sdapi/v1/txt2img" -Method Post -Body \$body -ContentType "application/json" -TimeoutSec 300
[IO.File]::WriteAllBytes("C:\Users\konis\Pictures\sd-outputs\[jobId]_male.png", [Convert]::FromBase64String(\$response.images[0]))

# 女性画像（prompt/negative_promptの性別部分を入れ替え）
\`\`\`

### 2.5 配置

生成された画像をコピーします（背景透過処理は不要）：

\`\`\`bash
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_male.png" frontend/public/sprites/male/[jobId].png
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_female.png" frontend/public/sprites/female/[jobId].png
\`\`\`

### 2.6 フロントエンドのパスマッピング追加

**⚠️ 重要**: この手順を忘れると、ジョブ変更時にキャラクター画像が更新されません。

**ファイル**: `frontend/src/components/common/CharacterImage.tsx`

`CHARACTER_IMAGE_PATHS` オブジェクトに新しいジョブのパスマッピングを追加します。

\`\`\`typescript
export const CHARACTER_IMAGE_PATHS = {
  male: {
    // ... 既存のジョブ ...
    // 新しいジョブを追加（適切なティアのコメント下に配置）
    [jobId]: '/sprites/male/[jobId].png',
  },
  female: {
    // ... 既存のジョブ ...
    [jobId]: '/sprites/female/[jobId].png',
  },
} as const;
\`\`\`

#### 配置場所の目安

ティアごとにコメントで区分けされています：

- `// Novice` - 初期ジョブ
- `// Apprentice (見習い)` - 見習い系
- `// Journeyman (職人)` - 単一ステータス系
- `// Journeyman (複合ステータス系)` - 複合ステータス系
- `// Expert (熟練者)` - 熟練者
- `// Master (達人)` - 達人
- `// Grandmaster (極致)` - 最上位

#### フォールバック設定

専用画像がまだ存在しない上位ジョブは、下位ジョブの画像をフォールバックとして設定できます：

\`\`\`typescript
master_artisan: '/sprites/male/artisan.png', // フォールバック
\`\`\`

---

## ステップ3: デプロイ

### 3.1 変更のコミット

\`\`\`bash
cd /home/nekonisi/workspace/Habits-rpg

# 変更をステージング
git add shared/constants/jobs.ts
git add frontend/public/sprites/

# コミット
git commit -m "feat: add [job_name] job with sprites"

# プッシュ
git push origin main
\`\`\`

### 3.2 デプロイの自動処理

GitHub Actionsが以下を自動実行します：

1. **バックエンドデプロイ** - Amplify Gen2バックエンド
2. **フロントエンドデプロイ** - Vite + React アプリ
3. **DynamoDBシーディング** - \`scripts/seed-jobs.js\` でジョブデータを投入

確認URL: https://github.com/sattva-improve/habits-rpg/actions

---

## AI Agent向け クイックコマンドシーケンス

### 必要な操作一覧

1. \`shared/constants/jobs.ts\` の \`JOBS\` 配列にジョブ定義追加
2. Stable Diffusion API呼び出し（男性・女性各1枚、**白背景付き**）
3. 画像を \`frontend/public/sprites/male/\` と \`female/\` に配置
4. \`frontend/src/components/common/CharacterImage.tsx\` の \`CHARACTER_IMAGE_PATHS\` にパスマッピング追加
5. \`git add\`, \`git commit\`, \`git push\`

### ジョブ別プロンプトキーワード例

| ジョブカテゴリ | キーワード例 |
|--------------|-------------|
| 戦闘系 | armor, sword, shield, knight, warrior, battle |
| 魔法系 | robe, staff, spellbook, wizard, mage, magic |
| 信仰系 | monk robe, prayer beads, zen, meditation |
| 技術系 | apron, hammer, tools, crafting, blacksmith |
| 芸能系 | colorful clothes, lute, musical instrument, bard |
| 体術系 | athletic clothes, sports, training, martial arts |
| 隠密系 | ninja, shadow, stealth, assassin, hood |
| 自然系 | ranger, bow, forest, hunter, druid |
| 魔法戦士系 | knight, glowing sword, magic aura, enchanted blade |
| 踊り子系 | dancer, elegant pose, flowing clothes, ribbon |
| 錬金術系 | alchemist, robe, potions, flask, bubbling liquid |

### 現在の全ジョブ一覧

| ティア | ジョブID | 名前 | 等身 |
|--------|---------|------|------|
| novice | beginner | ビギナー | 3等身 |
| apprentice | warrior_apprentice | 見習い戦士 | 3等身 |
| apprentice | scholar_apprentice | 見習い学者 | 3等身 |
| apprentice | monk_apprentice | 見習い僧侶 | 3等身 |
| apprentice | artisan_apprentice | 見習い職人 | 3等身 |
| apprentice | performer_apprentice | 見習い芸人 | 3等身 |
| apprentice | athlete_apprentice | 見習いアスリート | 3等身 |
| journeyman | warrior | 戦士 | 4等身 |
| journeyman | scholar | 学者 | 4等身 |
| journeyman | monk | 僧侶 | 4等身 |
| journeyman | artisan | 職人 | 4等身 |
| journeyman | bard | 吟遊詩人 | 4等身 |
| journeyman | athlete | アスリート | 4等身 |
| journeyman | ranger | レンジャー | 4等身 |
| journeyman | paladin | パラディン | 4等身 |
| journeyman | ninja | 忍者 | 4等身 |
| journeyman | spellblade | 魔法剣士 | 4等身 |
| journeyman | dancer | 踊り子 | 4等身 |
| journeyman | alchemist | 錬金術師 | 4等身 |

### 必須チェックリスト

- [ ] \`jobId\` がユニークであること
- [ ] \`tier\` に応じた適切な \`requirements\` と \`statBonuses\`
- [ ] 男女両方の画像を生成（**白背景付き**）
- [ ] ファイル名が \`[jobId].png\` と一致
- [ ] \`shared/constants/jobs.ts\` に定義が追加されていること
- [ ] \`frontend/src/components/common/CharacterImage.tsx\` の \`CHARACTER_IMAGE_PATHS\` にパスマッピングが追加されていること

---

## トラブルシューティング

### Stable Diffusion WebUIに接続できない

\`\`\`bash
curl http://127.0.0.1:7860/sdapi/v1/sd-models
\`\`\`

### 画像生成がタイムアウトする

PowerShellの \`-TimeoutSec 300\` を増やす：

\`\`\`powershell
Invoke-RestMethod ... -TimeoutSec 600
\`\`\`

### DynamoDBにジョブが追加されない

1. \`shared/constants/jobs.ts\` に定義があるか確認
2. GitHub Actionsのログを確認：https://github.com/sattva-improve/habits-rpg/actions
3. \`scripts/seed-jobs.js\` の \`JOBS\` 配列を確認

---

## 関連ドキュメント

- [IMAGE_GENERATION.md](IMAGE_GENERATION.md) - 画像生成の詳細設定
- [DEPLOY.md](DEPLOY.md) - デプロイ手順の詳細
- [JOBS.md](JOBS.md) - ジョブシステムの設計詳細
