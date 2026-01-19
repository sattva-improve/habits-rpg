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

```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, simple background, white background, [gender], [job description], no mouth, brown hair
```

### 性別の指定
- 男性: `1 boy`
- 女性: `1 girl`

### ネガティブプロンプト

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, background, castle, building, landscape, [除外する性別]
```

- 男性画像の場合: `1 girl` を追加
- 女性画像の場合: `1 boy` を追加

## ジョブ別プロンプト例

| ジョブ | プロンプト（ジョブ部分） |
|--------|------------------------|
| beginner | simple clothes, adventurer, traveler |
| warrior_apprentice | light armor, training sword, apprentice warrior |
| scholar_apprentice | apprentice robe, book, studying |
| monk_apprentice | simple monk robe, prayer beads |
| artisan_apprentice | apron, hammer, crafting tools |
| performer_apprentice | colorful clothes, tambourine |
| athlete_apprentice | sports clothes, athletic, training |
| warrior | full armor, knight, sword, shield |
| scholar | wizard robe, magic staff, spellbook |
| monk | monk robe, martial arts pose, zen |
| artisan | blacksmith, forge hammer, leather apron |
| bard | bard outfit, lute, musical instrument |
| athlete | athletic clothes, gold medal, champion |

## 生成手順

### 1. txt2img APIでの生成（PowerShell例）

```powershell
$body = @{
    prompt = "<lora:Dungeon_Squad_IllustriousV5:1> pixel art, simple background, white background, 1 boy, full armor, knight, sword, shield, no mouth, brown hair"
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
[IO.File]::WriteAllBytes("output.png", [Convert]::FromBase64String($response.images[0]))
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

## 参考リンク

- [Stable Diffusion WebUI API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
- [rembg](https://github.com/danielgatis/rembg)
