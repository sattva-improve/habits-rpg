# 画像生成ガイド

このドキュメントでは、Habits RPGのキャラクタースプライト画像を生成するための設定と手順を説明します。

> **📝 プロンプト一覧**: 各ジョブの完全なプロンプトは [PROMPTS.md](PROMPTS.md) を参照してください。

---

## 必要なツール

### Stable Diffusion WebUI
- **URL**: http://127.0.0.1:7860
- **起動オプション**: `--api` フラグを付けて起動する必要があります

### LoRA
- **名前**: `Dungeon_Squad_IllustriousV5`
- **ウェイト**: 1.0
- **用途**: ピクセルアート風のRPGキャラクター生成

---

## 生成パラメータ

| パラメータ | 値 |
|-----------|-----|
| Width | 768 |
| Height | 768 |
| CFG Scale | 7 |
| Steps | 20 |
| Sampler | Euler a |
| Clip Skip | 2 |

---

## プロンプト基本構造

### 基本形式

```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, [等身設定], [背景], full body, standing, front view, [性別], [ジョブ説明], no mouth, brown hair
```

**重要**: すべての画像は**キャラクターに適した背景付き**で生成します。背景透過処理は行いません。

### 性別の指定

| 性別 | プロンプト | ネガティブに追加 |
|------|-----------|-----------------|
| 男性 | `1 boy` | `1 girl` |
| 女性 | `1 girl` | `1 boy` |

### ネガティブプロンプト

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, [除外する性別]
```

### 等身設定

| カテゴリ | 等身 | プロンプト |
|---------|------|-----------|
| novice, apprentice | 3等身 | `chibi, 3head tall, super deformed, cute proportions` |
| journeyman以上 | 4等身 | `4head tall, standard proportions` |

---

## 生成手順

### 1. プロンプトの取得

[PROMPTS.md](PROMPTS.md) から生成したいジョブのプロンプトをコピーします。

### 2. PowerShellでの画像生成

```powershell
$body = @{
    prompt = "[PROMPTS.mdからコピーしたプロンプト]"
    negative_prompt = "worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, 1 girl"
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

### 3. 生成後の配置

```bash
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_male.png" frontend/public/sprites/male/[jobId].png
cp "/mnt/c/Users/konis/Pictures/sd-outputs/[jobId]_female.png" frontend/public/sprites/female/[jobId].png
```

---

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

---

## 注意事項

1. **背景**: キャラクターに適した背景を使用。詳細は [PROMPTS.md](PROMPTS.md) 参照
2. **画像サイズ**: 768x768で生成。アプリケーション側でリサイズされます
3. **ファイル名**: ジョブIDと完全に一致させる必要があります（例: `spellblade.png`）
4. **等身の一貫性**: apprentice系は必ず3等身、journeyman以上は4等身
5. **タイムアウト**: PowerShellの `-TimeoutSec 300` オプションで十分な待機時間を確保

---

## 一貫性チェックリスト

- [ ] 等身設定が正しいか（apprentice=3等身、journeyman以上=4等身）
- [ ] キャラクターに適した背景がpromptに含まれているか
- [ ] 性別の指定が正しいか
- [ ] ポーズが`standing, front view`で統一されているか
- [ ] ファイル名がjobIdと一致しているか

---

## 関連ドキュメント

- [PROMPTS.md](PROMPTS.md) - **全ジョブのプロンプト集（メイン参照先）**
- [JOB_CREATION_GUIDE.md](JOB_CREATION_GUIDE.md) - ジョブ追加の完全ガイド
- [JOBS.md](JOBS.md) - ジョブシステムの設計詳細
- [Stable Diffusion WebUI API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
