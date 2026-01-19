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

### 背景除去ツール
- **ライブラリ**: `rembg`
- **インストール**: `pip install rembg`

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

#### 見習い（apprentice）系 - 3等身ちびキャラ
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, solid white background, thick black outline, clear silhouette, full body, standing, front view, [gender], [job description], no mouth, brown hair
```

#### 熟練ジョブ系 - 4等身スタンダード
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, solid white background, thick black outline, clear silhouette, full body, standing, front view, [gender], [job description], no mouth, brown hair
```

### 性別の指定
- 男性: `1 boy`
- 女性: `1 girl`

### ネガティブプロンプト

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, fading edges, transparent parts, blurry outline, gradient background, semi-transparent, translucent, faded colors, soft edges, [除外する性別]
```

- 男性画像の場合: `1 girl` を追加
- 女性画像の場合: `1 boy` を追加

### 等身設定ガイド

| カテゴリ | 等身 | 対象ジョブ | 特徴 |
|---------|------|-----------|------|
| beginner | 3等身 | beginner | 冒険を始めたばかりの初心者 |
| apprentice | 3等身 | warrior_apprentice, scholar_apprentice, monk_apprentice, artisan_apprentice, performer_apprentice, athlete_apprentice | ちびキャラ、かわいらしい印象 |
| 熟練 | 4等身 | warrior, scholar, monk, artisan, bard, athlete | スタンダードな等身、頼もしい印象 |

### 背景除去対策

rembgでキャラクターの一部が透過されないよう、以下のプロンプトを必ず含めてください：

**必須プロンプト:**
- `solid white background` - 純白の背景を指定
- `thick black outline` - キャラクターの輪郭を明確に
- `clear silhouette` - シルエットを明瞭に

**ネガティブプロンプトに追加:**
- `fading edges` - ぼやけた輪郭を防止
- `transparent parts` - 透過部分を防止
- `blurry outline` - ぼやけた輪郭を防止
- `gradient background` - グラデーション背景を防止
- `semi-transparent` - 半透明を防止
- `translucent` - 透け感を防止

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

## 生成手順

### 1. txt2img APIでの生成（PowerShell例）

#### 見習い系（3等身ちびキャラ）の例
```powershell
$body = @{
    prompt = "<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, solid white background, thick black outline, clear silhouette, full body, standing, front view, 1 boy, light armor, training sword, apprentice warrior, young trainee, no mouth, brown hair"
    negative_prompt = "worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, fading edges, transparent parts, blurry outline, gradient background, semi-transparent, translucent, 1 girl"
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
[IO.File]::WriteAllBytes("warrior_apprentice.png", [Convert]::FromBase64String($response.images[0]))
```

#### 熟練系（4等身スタンダード）の例
```powershell
$body = @{
    prompt = "<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, solid white background, thick black outline, clear silhouette, full body, standing, front view, 1 boy, full armor, knight, sword, shield, veteran warrior, no mouth, brown hair"
    negative_prompt = "worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, fading edges, transparent parts, blurry outline, gradient background, semi-transparent, translucent, 1 girl"
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
[IO.File]::WriteAllBytes("warrior.png", [Convert]::FromBase64String($response.images[0]))
```

### 2. 背景除去（Python）

```python
from rembg import remove
from PIL import Image

input_image = Image.open("output.png")
output_image = remove(input_image)
output_image.save("output_transparent.png")
```

### 3. 一括処理スクリプト

```python
from rembg import remove
from PIL import Image
import os

sprite_dirs = [
    "frontend/public/sprites/male",
    "frontend/public/sprites/female"
]

for sprite_dir in sprite_dirs:
    for filename in os.listdir(sprite_dir):
        if filename.endswith(".png"):
            filepath = os.path.join(sprite_dir, filename)
            print(f"Processing: {filepath}")
            input_image = Image.open(filepath)
            output_image = remove(input_image)
            output_image.save(filepath)
            print(f"  -> Saved with transparent background")
```

## ファイル配置

生成した画像は以下のディレクトリに配置します:

```
frontend/public/sprites/
├── male/
│   ├── beginner.png
│   ├── warrior.png
│   ├── warrior_apprentice.png
│   ├── scholar.png
│   ├── scholar_apprentice.png
│   ├── monk.png
│   ├── monk_apprentice.png
│   ├── artisan.png
│   ├── artisan_apprentice.png
│   ├── bard.png
│   ├── performer_apprentice.png
│   ├── athlete.png
│   └── athlete_apprentice.png
├── female/
│   └── (same structure as male)
└── backgrounds/
    └── (background images)
```

## 注意事項

1. **CUDA警告**: rembgでCUDA関連の警告が出る場合がありますが、CPU処理にフォールバックするため無視して問題ありません
2. **画像サイズ**: 768x768で生成していますが、アプリケーション側でリサイズされます
3. **透過処理**: 生成された画像は必ずrembgで背景除去を行ってから配置してください
4. **ファイル名**: `seed-data.ts`のジョブIDと一致させる必要があります
5. **等身の一貫性**: apprentice系は必ず3等身（chibi）、熟練系は4等身で生成してください
6. **背景除去でキャラが消える場合**: プロンプトに`solid white background, thick black outline, clear silhouette`を追加し、ネガティブプロンプトに`fading edges, transparent parts, blurry outline`を追加してください

## 一貫性チェックリスト

生成前に以下を確認してください：

- [ ] 等身設定が正しいか（apprentice=3等身、熟練=4等身）
- [ ] `solid white background`がプロンプトに含まれているか
- [ ] `thick black outline`がプロンプトに含まれているか
- [ ] ネガティブプロンプトに透過防止ワードが含まれているか
- [ ] 性別の指定が正しいか
- [ ] ポーズが`standing, front view`で統一されているか

## 参考リンク

- [Stable Diffusion WebUI API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
- [rembg](https://github.com/danielgatis/rembg)
