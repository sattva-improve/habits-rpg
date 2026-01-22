# 画像生成ガイド

このドキュメントでは、Habits RPGのキャラクタースプライト画像を生成するための設定と手順を説明します。

## 必要なツール

### Stable Diffusion WebUI
- **URL**: http://127.0.0.1:7860
- **起動オプション**: `--api` フラグを付けて起動する必要があります

### LoRA
- **名前**: `Dungeon_Squad_IllustriousV5`
- **ウェイト**: 1.0
- **用途**: ピクセルアート風のRPGキャラクター生成

## 生成パラメータ

| パラメータ | 値 |
|-----------|-----|
| Width | 768 |
| Height | 768 |
| CFG Scale | 7 |
| Steps | 20 |
| Sampler | Euler a |
| Clip Skip | 2 |

## プロンプトテンプレート

### 基本形式

**重要**: すべての画像は**白背景付き**で生成します。背景透過処理は行いません。

#### 見習い（apprentice）系 - 3等身ちびキャラ
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, simple background, white background, full body, standing, front view, [gender], [job description], no mouth, brown hair
```

#### 熟練ジョブ系 - 4等身スタンダード
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, simple background, white background, full body, standing, front view, [gender], [job description], no mouth, brown hair
```

### 性別の指定
- 男性: `1 boy`
- 女性: `1 girl`

### ネガティブプロンプト

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, castle, building, landscape, [除外する性別]
```

- 男性画像の場合: `1 girl` を追加
- 女性画像の場合: `1 boy` を追加

### 等身設定ガイド

| カテゴリ | 等身 | 対象ジョブ | 特徴 |
|---------|------|-----------|------|
| beginner | 3等身 | beginner | 冒険を始めたばかりの初心者 |
| apprentice | 3等身 | warrior_apprentice, scholar_apprentice, monk_apprentice, artisan_apprentice, performer_apprentice, athlete_apprentice | ちびキャラ、かわいらしい印象 |
| journeyman | 4等身 | warrior, scholar, monk, artisan, bard, athlete, ranger, paladin, ninja, spellblade, dancer, alchemist | スタンダードな等身、頼もしい印象 |

## ジョブ別プロンプト例

### 見習い系（3等身ちびキャラ）

| ジョブ | 等身 | プロンプト（ジョブ部分） |
|--------|------|------------------------|
| beginner | 3等身 | simple clothes, adventurer, traveler, young |
| warrior_apprentice | 3等身 | light armor, training sword, apprentice warrior, young trainee |
| scholar_apprentice | 3等身 | apprentice robe, book, studying, young student |
| monk_apprentice | 3等身 | simple monk robe, prayer beads, young disciple |
| artisan_apprentice | 3等身 | apron, hammer, crafting tools, young craftsman |
| performer_apprentice | 3等身 | colorful clothes, tambourine, young entertainer |
| athlete_apprentice | 3等身 | sports clothes, athletic, training, young athlete |

### 熟練系（4等身スタンダード）

| ジョブ | 等身 | プロンプト（ジョブ部分） |
|--------|------|------------------------|
| warrior | 4等身 | full armor, knight, sword, shield, veteran warrior |
| scholar | 4等身 | wizard robe, magic staff, spellbook, wise mage |
| monk | 4等身 | monk robe, martial arts pose, zen, master monk |
| artisan | 4等身 | blacksmith, forge hammer, leather apron, master craftsman |
| bard | 4等身 | bard outfit, lute, musical instrument, skilled performer |
| athlete | 4等身 | athletic clothes, gold medal, champion, elite athlete |

### 複合ステータス系（4等身スタンダード）

| ジョブ | 等身 | プロンプト（ジョブ部分） |
|--------|------|------------------------|
| ranger | 4等身 | ranger outfit, bow, quiver, forest hunter, nature explorer |
| paladin | 4等身 | holy knight armor, sword, shield, golden aura, sacred warrior |
| ninja | 4等身 | ninja outfit, dark clothes, kunai, mask, stealthy assassin |
| spellblade | 4等身 | knight, glowing sword, magic aura, enchanted blade, spellcaster warrior |
| dancer | 4等身 | dancer, elegant pose, flowing clothes, ribbon, graceful performer |
| alchemist | 4等身 | alchemist, robe, potions, flask, mysterious bubbling liquid, wizard |

## 生成手順

### PowerShellでの画像生成

```powershell
$body = @{
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

$response = Invoke-RestMethod -Uri "http://127.0.0.1:7860/sdapi/v1/txt2img" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 300
[IO.File]::WriteAllBytes("C:\Users\konis\Pictures\sd-outputs\[jobId]_male.png", [Convert]::FromBase64String($response.images[0]))
```

### 生成後の配置

生成された画像を以下のディレクトリにコピーします：

```bash
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_male.png" frontend/public/sprites/male/[jobId].png
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_female.png" frontend/public/sprites/female/[jobId].png
```

## ファイル配置

```
frontend/public/sprites/
├── male/
│   ├── beginner.png
│   ├── warrior_apprentice.png
│   ├── warrior.png
│   ├── spellblade.png
│   └── ...
└── female/
    ├── beginner.png
    ├── warrior_apprentice.png
    ├── warrior.png
    ├── spellblade.png
    └── ...
```

## 注意事項

1. **背景**: すべての画像は**白背景付き**で生成します。背景透過処理は不要です。
2. **画像サイズ**: 768x768で生成。アプリケーション側でリサイズされます。
3. **ファイル名**: ジョブIDと完全に一致させる必要があります（例: `spellblade.png`）
4. **等身の一貫性**: apprentice系は必ず3等身（chibi）、journeyman以上は4等身で生成してください。
5. **タイムアウト**: PowerShellの `-TimeoutSec 300` オプションで十分な待機時間を確保してください。

## 一貫性チェックリスト

生成前に以下を確認してください：

- [ ] 等身設定が正しいか（apprentice=3等身、journeyman以上=4等身）
- [ ] `simple background, white background`がプロンプトに含まれているか
- [ ] 性別の指定が正しいか
- [ ] ポーズが`standing, front view`で統一されているか
- [ ] ファイル名がjobIdと一致しているか

## 参考リンク

- [Stable Diffusion WebUI API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
