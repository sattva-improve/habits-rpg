# Issue #004: ジョブ変更時にアイコンが変更されないジョブがある

## 概要

ジョブを変更した際、一部のジョブではアイコン（キャラクター画像）が正しく変更されるが、他のジョブではデフォルトの画像が表示されてしまう不具合。

## 発生日

2026-01-22

## 不具合の詳細

### 原因

`frontend/src/components/common/CharacterImage.tsx` の `CHARACTER_IMAGE_PATHS` オブジェクトに定義されているジョブと、実際に存在するスプライト画像、および `shared/constants/jobs.ts` で定義されているジョブの間に不一致がある。

### 具体的な問題

#### 1. CHARACTER_IMAGE_PATHSに定義されているが、スプライト画像が存在しないジョブ

以下のジョブは画像パスが定義されているが、実際の画像ファイルが存在しない：

- `knight` - `/sprites/male/knight.png`, `/sprites/female/knight.png`
- `sage` - `/sprites/male/sage.png`, `/sprites/female/sage.png`
- `high_monk` - `/sprites/male/high_monk.png` (male のみ)
- `mage` - `/sprites/male/mage.png`, `/sprites/female/mage.png`

#### 2. JOBSに定義されていて、スプライト画像が存在するが、CHARACTER_IMAGE_PATHSに定義されていないジョブ

以下のジョブはゲーム内に存在し、スプライト画像も用意されているが、パスマッピングが欠落している：

- `ranger` - 画像は存在する (`ranger.png`)
- `paladin` - 画像は存在する (`paladin.png`)
- `ninja` - 画像は存在する (`ninja.png`)
- `spellblade` - 画像は存在する (`spellblade.png`)
- `dancer` - 画像は存在する (`dancer.png`)
- `alchemist` - 画像は存在する (`alchemist.png`)

### 影響範囲

- ジョブ変更時のキャラクター画像表示
- ダッシュボード、プロフィールなど、キャラクター画像を表示するすべての箇所

## 再現手順

1. アプリケーションにログインする
2. ジョブを `ranger`、`paladin`、`ninja`、`spellblade`、`dancer`、`alchemist` のいずれかに変更する
3. キャラクター画像がデフォルト（beginner）のままであることを確認

## 期待される動作

ジョブを変更すると、対応するジョブのキャラクター画像が表示される。

## 修正方針

`CHARACTER_IMAGE_PATHS` に欠落している複合ステータス系ジョブ（Journeyman tier）のパスマッピングを追加する。

## 関連ファイル

- `frontend/src/components/common/CharacterImage.tsx`
- `shared/constants/jobs.ts`
- `frontend/public/sprites/male/`
- `frontend/public/sprites/female/`
