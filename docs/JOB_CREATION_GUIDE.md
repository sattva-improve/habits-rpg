# ジョブ追加ガイド

このドキュメントでは、新しいジョブを追加するための手順を説明します。エージェントがこの手順に従って自動でジョブ追加を行えます。

## 概要

ジョブ追加には以下の3ステップが必要です：

1. **ジョブの定義追加** - コードベースにジョブ情報を追加
2. **画像の生成** - Stable Diffusion WebUIでスプライト画像を生成
3. **デプロイ** - コミット＆プッシュでGitHub Actionsが自動デプロイ

---

## ステップ1: ジョブの定義追加

### 1.1 ジョブ定義の追加

**ファイル**: `amplify/functions/check-jobs/handler.ts`

`JOBS` 配列に新しいジョブを追加します。

#### ジョブ定義の構造

```typescript
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
```

#### ティア別ガイドライン

| ティア | 必要レベル目安 | ステータスボーナス | 経験値ボーナス |
|--------|---------------|------------------|---------------|
| novice | なし | なし | 1.0 |
| apprentice | なし | +1 (単一) | 1.05 |
| journeyman | 10 | +2 (メイン), +1 (サブ) | 1.1 |
| expert | 20 | +3 (メイン), +2 (サブ) | 1.15 |
| master | 30 | +4 (メイン), +2 (サブ×2) | 1.2 |
| grandmaster | 50 | +5 (メイン), +3 (サブ×2) | 1.3 |

#### 追加例

```typescript
{
  jobId: 'ninja',
  name: '忍者',
  description: '影に潜み、俊敏に動く者',
  icon: '🥷',
  tier: 'journeyman',
  requirements: {
    level: 10,
    stats: { DEX: 5, STR: 3 },
    jobs: ['warrior_apprentice', 'artisan_apprentice'],
  },
  statBonuses: { DEX: 2, STR: 1 },
  expBonus: 1.1,
},
```

### 1.2 スプライト定義の追加（オプション）

**ファイル**: `amplify/data/seed-data.ts`

`SEED_SPRITES` 配列にスプライト情報を追加します。

```typescript
{
  spriteId: 'base_ninja',
  name: '忍者',
  description: '忍者ジョブで解放されるキャラクター',
  category: 'base',
  spriteKey: 'sprites/base/ninja.png',
  thumbnailKey: 'sprites/thumbnails/base_ninja.png',
  frameCount: 4,
  width: 32,
  height: 32,
  isDefault: false,
  unlockCondition: { job: 'ninja' },
},
```

---

## ステップ2: 画像の生成

### 2.1 前提条件

- Stable Diffusion WebUIが起動していること（`--api` フラグ付き）
- URL: `http://127.0.0.1:7860`
- LoRA: `Dungeon_Squad_IllustriousV5` がインストール済み

### 2.2 プロンプトの作成

#### テンプレート

```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, simple background, white background, [gender], [job description], no mouth, brown hair
```

#### 性別
- 男性: `1 boy`
- 女性: `1 girl`

#### ネガティブプロンプト

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, [除外性別]
```

### 2.3 生成パラメータ

```json
{
  "width": 768,
  "height": 768,
  "cfg_scale": 7,
  "steps": 20,
  "sampler_name": "Euler a",
  "override_settings": {
    "CLIP_stop_at_last_layers": 2
  }
}
```

### 2.4 API呼び出し（PowerShell）

```powershell
$body = @{
    prompt = "<lora:Dungeon_Squad_IllustriousV5:1> pixel art, simple background, white background, 1 boy, ninja, stealth, shadow, throwing stars, no mouth, brown hair"
    negative_prompt = "worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, 1 girl"
    width = 768
    height = 768
    cfg_scale = 7
    steps = 20
    sampler_name = "Euler a"
    override_settings = @{
        CLIP_stop_at_last_layers = 2
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod -Uri "http://127.0.0.1:7860/sdapi/v1/txt2img" -Method Post -Body $body -ContentType "application/json"
[IO.File]::WriteAllBytes("/home/nekonisi/workspace/Habits-rpg/frontend/public/sprites/male/ninja.png", [Convert]::FromBase64String($response.images[0]))
```

### 2.5 背景除去（Python）

```python
from rembg import remove
from PIL import Image

# 男性
input_image = Image.open("frontend/public/sprites/male/ninja.png")
output_image = remove(input_image)
output_image.save("frontend/public/sprites/male/ninja.png")

# 女性
input_image = Image.open("frontend/public/sprites/female/ninja.png")
output_image = remove(input_image)
output_image.save("frontend/public/sprites/female/ninja.png")
```

### 2.6 配置先

```
frontend/public/sprites/
├── male/
│   └── [jobId].png
└── female/
    └── [jobId].png
```

---

## ステップ3: デプロイ

### 3.1 変更のコミット

```bash
cd /home/nekonisi/workspace/Habits-rpg

# 変更をステージング
git add amplify/functions/check-jobs/handler.ts
git add amplify/data/seed-data.ts  # スプライト定義を追加した場合
git add frontend/public/sprites/

# コミット
git commit -m "feat: add [job_name] job with sprites"

# プッシュ
git push origin main
```

### 3.2 デプロイの確認

GitHub Actionsが自動的にデプロイを実行します。

- **確認URL**: https://github.com/sattva-improve/habits-rpg/actions

デプロイは通常4〜5分で完了します。

---

## エージェント向けクイックリファレンス

### 新しいジョブ追加コマンドシーケンス

```
1. amplify/functions/check-jobs/handler.ts のJOBS配列に定義追加
2. amplify/data/seed-data.ts のSEED_SPRITES配列にスプライト定義追加
3. PowerShellでStable Diffusion API呼び出し（男性・女性各1枚）
4. Pythonでrembg背景除去
5. git add, commit, push
```

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

### 必須チェックリスト

- [ ] `jobId` がユニークであること
- [ ] `tier` に応じた適切な `requirements` と `statBonuses`
- [ ] 男女両方の画像を生成
- [ ] 背景が透過されていること
- [ ] ファイル名が `jobId.png` と一致

---

## トラブルシューティング

### Stable Diffusion WebUIに接続できない

```bash
# WebUIが起動しているか確認
curl http://127.0.0.1:7860/sdapi/v1/sd-models
```

### rembgでCUDAエラー

CPUにフォールバックするので無視して問題ありません。

### デプロイが失敗する

GitHub Actionsのログを確認してください：
https://github.com/sattva-improve/habits-rpg/actions

---

## 関連ドキュメント

- [IMAGE_GENERATION.md](IMAGE_GENERATION.md) - 画像生成の詳細設定
- [DEPLOY.md](DEPLOY.md) - デプロイ手順の詳細
