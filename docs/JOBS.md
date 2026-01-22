# ジョブ（職業）一覧

このドキュメントでは、Habits RPGのすべてのジョブ情報を管理します。

## 概要

- **全ジョブ数**: 29種類
- **ティア数**: 6段階（Novice → Apprentice → Journeyman → Expert → Master → Grandmaster）

---

## ジョブ一覧

### Novice（初期）- 1種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `beginner` | ビギナー | 🌱 | なし（初期） | ✅ | ✅ |

---

### Apprentice（見習い）- 6種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `warrior_apprentice` | 見習い戦士 | ⚔️ | STR 2 | ✅ | ✅ |
| `scholar_apprentice` | 見習い学者 | 📖 | INT 2 | ✅ | ✅ |
| `monk_apprentice` | 見習い僧侶 | 🙏 | MND 2 | ✅ | ✅ |
| `artisan_apprentice` | 見習い職人 | 🔧 | DEX 2 | ✅ | ✅ |
| `performer_apprentice` | 見習い芸人 | 🎭 | CHA 2 | ✅ | ✅ |
| `athlete_apprentice` | 見習いアスリート | 🏃 | VIT 2 | ✅ | ✅ |

---

### Journeyman（職人）- 6種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `warrior` | 戦士 | 🗡️ | Lv.10, STR 5, 見習い戦士 | ✅ | ✅ |
| `scholar` | 学者 | 📚 | Lv.10, INT 5, 見習い学者 | ✅ | ✅ |
| `monk` | 僧侶 | 🧘 | Lv.10, MND 5, 見習い僧侶 | ✅ | ✅ |
| `artisan` | 職人 | ⚒️ | Lv.10, DEX 5, 見習い職人 | ✅ | ✅ |
| `bard` | 吟遊詩人 | 🎵 | Lv.10, CHA 5, 見習い芸人 | ✅ | ✅ |
| `athlete` | アスリート | 🏅 | Lv.10, VIT 5, 見習いアスリート | ✅ | ✅ |

---

### Journeyman（複合ステータス系）- 6種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `ranger` | レンジャー | 🏹 | Lv.10, DEX 4, STR 3, 見習い戦士, 見習い職人 | ❌ | ❌ |
| `paladin` | パラディン | ✝️ | Lv.10, STR 4, MND 3, 見習い戦士, 見習い僧侶 | ❌ | ❌ |
| `ninja` | 忍者 | 🥷 | Lv.10, DEX 4, INT 3, 見習い職人, 見習い学者 | ❌ | ❌ |
| `spellblade` | 魔法剣士 | ⚔️✨ | Lv.10, STR 4, INT 3, 見習い戦士, 見習い学者 | ✅ | ✅ |
| `dancer` | 踊り子 | 💃 | Lv.10, CHA 4, VIT 3, 見習い芸人, 見習いアスリート | ✅ | ✅ |
| `alchemist` | 錬金術師 | ⚗️ | Lv.10, INT 4, DEX 3, 見習い学者, 見習い職人 | ✅ | ✅ |

---

### Expert（熟練者）- 6種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `knight` | 騎士 | 🛡️ | Lv.20, STR 10, VIT 5, 戦士 | ✅ | ✅ |
| `sage` | 賢者 | 🔮 | Lv.20, INT 10, MND 5, 学者 | ✅ | ✅ |
| `high_monk` | 高僧 | ☯️ | Lv.20, MND 10, VIT 5, 僧侶 | ✅ | ❌ |
| `master_artisan` | 匠 | 💎 | Lv.20, DEX 10, INT 5, 職人 | ❌ | ❌ |
| `virtuoso` | 名人 | 🎻 | Lv.20, CHA 10, DEX 5, 吟遊詩人 | ❌ | ❌ |
| `champion` | チャンピオン | 🏆 | Lv.20, VIT 10, STR 5, アスリート | ❌ | ❌ |

---

### Master（達人）- 6種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `hero` | 英雄 | ⚔️ | Lv.35, STR 20, VIT 12, CHA 8, 騎士 | ❌ | ❌ |
| `arch_sage` | 大賢者 | ✨ | Lv.35, INT 20, MND 12, DEX 8, 賢者 | ❌ | ❌ |
| `enlightened` | 覚者 | 🌟 | Lv.35, MND 20, VIT 12, INT 8, 高僧 | ❌ | ❌ |
| `legend_artisan` | 伝説の職人 | 🌈 | Lv.35, DEX 20, INT 12, CHA 8, 匠 | ❌ | ❌ |
| `superstar` | スーパースター | 💫 | Lv.35, CHA 20, DEX 12, MND 8, 名人 | ❌ | ❌ |
| `olympian` | オリンピアン | 🥇 | Lv.35, VIT 20, STR 12, MND 8, チャンピオン | ❌ | ❌ |

---

### Grandmaster（極致）- 1種類

| jobId | 名前 | アイコン | 解放条件 | 画像(male) | 画像(female) |
|-------|------|---------|---------|-----------|-------------|
| `habit_master` | 習慣の極致 | 👑 | Lv.50, 全ステ25, level_99実績, streak_100実績 | ❌ | ❌ |

---

## 画像ファイルのステータス

### 存在する画像ファイル

**Male (17ファイル)**:
- `beginner.png` ✅
- `warrior_apprentice.png` ✅
- `scholar_apprentice.png` ✅
- `monk_apprentice.png` ✅
- `artisan_apprentice.png` ✅
- `performer_apprentice.png` ✅
- `athlete_apprentice.png` ✅
- `warrior.png` ✅
- `scholar.png` ✅
- `monk.png` ✅
- `artisan.png` ✅
- `bard.png` ✅
- `athlete.png` ✅
- `knight.png` ✅
- `sage.png` ✅
- `high_monk.png` ✅
- `mage.png` ⚠️ (定義にないレガシーファイル)

**Female (16ファイル)**:
- `beginner.png` ✅
- `warrior_apprentice.png` ✅
- `scholar_apprentice.png` ✅
- `monk_apprentice.png` ✅
- `artisan_apprentice.png` ✅
- `performer_apprentice.png` ✅
- `athlete_apprentice.png` ✅
- `warrior.png` ✅
- `scholar.png` ✅
- `monk.png` ✅
- `artisan.png` ✅
- `bard.png` ✅
- `athlete.png` ✅
- `knight.png` ✅
- `sage.png` ✅
- `mage.png` ⚠️ (定義にないレガシーファイル)

### 不足している画像ファイル（13種類）

| jobId | Male | Female | フォールバック先 |
|-------|------|--------|----------------|
| `ranger` | ❌ | ❌ | warrior |
| `paladin` | ❌ | ❌ | warrior |
| `ninja` | ❌ | ❌ | artisan |
| `high_monk` | ✅ | ❌ | monk |
| `master_artisan` | ❌ | ❌ | artisan |
| `virtuoso` | ❌ | ❌ | bard |
| `champion` | ❌ | ❌ | athlete |
| `hero` | ❌ | ❌ | knight |
| `arch_sage` | ❌ | ❌ | sage |
| `enlightened` | ❌ | ❌ | high_monk/monk |
| `legend_artisan` | ❌ | ❌ | artisan |
| `superstar` | ❌ | ❌ | bard |
| `olympian` | ❌ | ❌ | athlete |
| `habit_master` | ❌ | ❌ | knight |

---

## ジョブツリー（進化パス）

```
                          ┌─ knight ─── hero
           ┌─ warrior ────┤
           │              └─────────────────┐
           │                                │
           │  ┌─ scholar ─── sage ──── arch_sage
           │  │
beginner ──┼──┼─ monk ─── high_monk ─── enlightened
           │  │
           │  ├─ artisan ─ master_artisan ─ legend_artisan
           │  │
           │  ├─ bard ──── virtuoso ─── superstar
           │  │
           └──┴─ athlete ─ champion ─── olympian
                                            │
                                            ↓
                                      habit_master
                                   (全ステ25 + 実績)

===== 複合ステータス系 Journeyman ジョブ =====

    見習い戦士 + 見習い職人 → レンジャー
    見習い戦士 + 見習い僧侶 → パラディン
    見習い戦士 + 見習い学者 → 魔法剣士
    見習い職人 + 見習い学者 → 忍者
    見習い学者 + 見習い職人 → 錬金術師
    見習い芸人 + 見習いアスリート → 踊り子
```

---

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `amplify/functions/check-jobs/handler.ts` | ジョブ定義（JOBS配列）、解放ロジック |
| `amplify/data/seed-data.ts` | シードデータ（スプライト定義含む） |
| `frontend/src/components/common/CharacterImage.tsx` | 画像パス定義（CHARACTER_IMAGE_PATHS） |
| `frontend/src/services/achievement.ts` | ジョブ解放チェック（checkJobs関数） |
| `frontend/public/sprites/male/` | 男性キャラ画像 |
| `frontend/public/sprites/female/` | 女性キャラ画像 |

---

## TODO

- [ ] Expert以上のジョブ画像を作成（11ファイル × 2性別 = 22ファイル）
  - [ ] female/high_monk.png
  - [ ] male/master_artisan.png, female/master_artisan.png
  - [ ] male/virtuoso.png, female/virtuoso.png
  - [ ] male/champion.png, female/champion.png
  - [ ] male/hero.png, female/hero.png
  - [ ] male/arch_sage.png, female/arch_sage.png
  - [ ] male/enlightened.png, female/enlightened.png
  - [ ] male/legend_artisan.png, female/legend_artisan.png
  - [ ] male/superstar.png, female/superstar.png
  - [ ] male/olympian.png, female/olympian.png
  - [ ] male/habit_master.png, female/habit_master.png
- [ ] レガシーファイル `mage.png` の扱いを決定（削除 or ジョブ定義追加）
