# 画像生成プロンプト集

このドキュメントでは、Habits RPGのキャラクタースプライト画像生成に使用するプロンプトを一元管理します。

---

## 共通設定

### 生成パラメータ

| パラメータ | 値 |
|-----------|-----|
| Width | 768 |
| Height | 768 |
| CFG Scale | 7 |
| Steps | 20 |
| Sampler | Euler a |
| Clip Skip | 2 |

### LoRA設定

```
<lora:Dungeon_Squad_IllustriousV5:1>
```

### 基本構造

```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, [等身設定], [背景], full body, standing, front view, [性別], [ジョブ説明], no mouth, brown hair
```

### 性別の指定

| 性別 | プロンプト | ネガティブに追加 |
|------|-----------|-----------------|
| 男性 | `1 boy` | `1 girl` |
| 女性 | `1 girl` | `1 boy` |

### ネガティブプロンプト（共通）

```
worst quality, bad quality, low quality, displeasing, very displeasing, bad anatomy, bad hands, scan artifacts, monochrome, [除外する性別]
```

---

## 等身設定

| カテゴリ | 等身 | プロンプト |
|---------|------|-----------|
| novice, apprentice | 3等身 | `chibi, 3head tall, super deformed, cute proportions` |
| journeyman以上 | 4等身 | `4head tall, standard proportions` |

---

## ジョブ別プロンプト

### Novice（初期）

#### beginner - ビギナー

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 草原、村の入り口 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, grassland background, village entrance, full body, standing, front view, 1 boy, simple clothes, adventurer, traveler, young beginner, backpack, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, grassland background, village entrance, full body, standing, front view, 1 girl, simple clothes, adventurer, traveler, young beginner, backpack, no mouth, brown hair
```

---

### Apprentice（見習い）

#### warrior_apprentice - 見習い戦士

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 訓練場、城壁 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, training ground background, castle wall, full body, standing, front view, 1 boy, light armor, training sword, apprentice warrior, young trainee, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, training ground background, castle wall, full body, standing, front view, 1 girl, light armor, training sword, apprentice warrior, young trainee, no mouth, brown hair
```

---

#### scholar_apprentice - 見習い学者

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 図書館、書斎 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, library background, bookshelf, full body, standing, front view, 1 boy, apprentice robe, book, studying, young student, glasses, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, library background, bookshelf, full body, standing, front view, 1 girl, apprentice robe, book, studying, young student, glasses, no mouth, brown hair
```

---

#### monk_apprentice - 見習い僧侶

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 寺院、瞑想の庭 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, temple background, zen garden, full body, standing, front view, 1 boy, simple monk robe, prayer beads, young disciple, peaceful, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, temple background, zen garden, full body, standing, front view, 1 girl, simple monk robe, prayer beads, young disciple, peaceful, no mouth, brown hair
```

---

#### artisan_apprentice - 見習い職人

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 工房、作業場 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, workshop background, workbench, full body, standing, front view, 1 boy, apron, small hammer, crafting tools, young craftsman, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, workshop background, workbench, full body, standing, front view, 1 girl, apron, small hammer, crafting tools, young craftsman, no mouth, brown hair
```

---

#### performer_apprentice - 見習い芸人

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 広場、ステージ |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, town square background, small stage, full body, standing, front view, 1 boy, colorful clothes, tambourine, young entertainer, cheerful, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, town square background, small stage, full body, standing, front view, 1 girl, colorful clothes, tambourine, young entertainer, cheerful, no mouth, brown hair
```

---

#### athlete_apprentice - 見習いアスリート

| 項目 | 内容 |
|------|------|
| 等身 | 3等身 |
| 背景 | 運動場、アリーナ |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, arena background, training field, full body, standing, front view, 1 boy, sports clothes, athletic, training, young athlete, energetic, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, chibi, 3head tall, super deformed, cute proportions, arena background, training field, full body, standing, front view, 1 girl, sports clothes, athletic, training, young athlete, energetic, no mouth, brown hair
```

---

### Journeyman（職人）- 単一ステータス系

#### warrior - 戦士

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 戦場、城門 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, battlefield background, castle gate, full body, standing, front view, 1 boy, full armor, knight, sword, shield, veteran warrior, battle-hardened, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, battlefield background, castle gate, full body, standing, front view, 1 girl, full armor, knight, sword, shield, veteran warrior, battle-hardened, no mouth, brown hair
```

---

#### scholar - 学者

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 魔法の塔、古代図書館 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magic tower background, ancient library, full body, standing, front view, 1 boy, wizard robe, magic staff, spellbook, wise mage, scholarly, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magic tower background, ancient library, full body, standing, front view, 1 girl, wizard robe, magic staff, spellbook, wise mage, scholarly, no mouth, brown hair
```

---

#### monk - 僧侶

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 山寺、霧の山 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mountain temple background, misty mountains, full body, standing, front view, 1 boy, monk robe, martial arts pose, zen, master monk, serene, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mountain temple background, misty mountains, full body, standing, front view, 1 girl, monk robe, martial arts pose, zen, master monk, serene, no mouth, brown hair
```

---

#### artisan - 職人

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 鍛冶場、炎 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, forge background, flames, anvil, full body, standing, front view, 1 boy, blacksmith, forge hammer, leather apron, master craftsman, muscular, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, forge background, flames, anvil, full body, standing, front view, 1 girl, blacksmith, forge hammer, leather apron, master craftsman, skilled, no mouth, brown hair
```

---

#### bard - 吟遊詩人

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 酒場、星空の下 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, tavern background, starry night, full body, standing, front view, 1 boy, bard outfit, lute, musical instrument, skilled performer, charismatic, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, tavern background, starry night, full body, standing, front view, 1 girl, bard outfit, lute, musical instrument, skilled performer, charismatic, no mouth, brown hair
```

---

#### athlete - アスリート

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | コロシアム、競技場 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, colosseum background, stadium, full body, standing, front view, 1 boy, athletic clothes, gold medal, champion, elite athlete, muscular, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, colosseum background, stadium, full body, standing, front view, 1 girl, athletic clothes, gold medal, champion, elite athlete, fit, no mouth, brown hair
```

---

### Journeyman（職人）- 複合ステータス系

#### ranger - レンジャー

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 深い森、木漏れ日 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, deep forest background, sunlight through trees, full body, standing, front view, 1 boy, ranger outfit, bow, quiver, forest hunter, nature explorer, hooded cloak, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, deep forest background, sunlight through trees, full body, standing, front view, 1 girl, ranger outfit, bow, quiver, forest hunter, nature explorer, hooded cloak, no mouth, brown hair
```

---

#### paladin - パラディン

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 大聖堂、神聖な光 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, cathedral background, holy light, stained glass, full body, standing, front view, 1 boy, holy knight armor, sword, shield, golden aura, sacred warrior, divine, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, cathedral background, holy light, stained glass, full body, standing, front view, 1 girl, holy knight armor, sword, shield, golden aura, sacred warrior, divine, no mouth, brown hair
```

---

#### ninja - 忍者

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 夜の城、月明かり |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, night castle background, moonlight, japanese architecture, full body, standing, front view, 1 boy, ninja outfit, dark clothes, kunai, mask, stealthy assassin, shadow, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, night castle background, moonlight, japanese architecture, full body, standing, front view, 1 girl, ninja outfit, dark clothes, kunai, mask, stealthy assassin, shadow, no mouth, brown hair
```

---

#### spellblade - 魔法剣士

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 魔法陣、エネルギーの渦 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magic circle background, energy vortex, arcane symbols, full body, standing, front view, 1 boy, knight, glowing sword, magic aura, enchanted blade, spellcaster warrior, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magic circle background, energy vortex, arcane symbols, full body, standing, front view, 1 girl, knight, glowing sword, magic aura, enchanted blade, spellcaster warrior, no mouth, brown hair
```

---

#### dancer - 踊り子

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 宮殿、シャンデリア |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, palace background, chandelier, elegant ballroom, full body, standing, front view, 1 boy, dancer, elegant pose, flowing clothes, ribbon, graceful performer, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, palace background, chandelier, elegant ballroom, full body, standing, front view, 1 girl, dancer, elegant pose, flowing clothes, ribbon, graceful performer, no mouth, brown hair
```

---

#### alchemist - 錬金術師

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 錬金工房、実験器具 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, alchemy lab background, bubbling potions, glowing flasks, full body, standing, front view, 1 boy, alchemist, robe, potions, flask, mysterious bubbling liquid, wizard, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, alchemy lab background, bubbling potions, glowing flasks, full body, standing, front view, 1 girl, alchemist, robe, potions, flask, mysterious bubbling liquid, wizard, no mouth, brown hair
```

---

### Expert（熟練者）

#### knight - 騎士

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 王城、旗がはためく |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, royal castle background, banners flying, majestic, full body, standing, front view, 1 boy, heavy plate armor, longsword, tower shield, royal knight, noble, cape, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, royal castle background, banners flying, majestic, full body, standing, front view, 1 girl, heavy plate armor, longsword, tower shield, royal knight, noble, cape, no mouth, brown hair
```

---

#### sage - 賢者

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 魔法の書庫、浮遊する本 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magical archive background, floating books, glowing runes, full body, standing, front view, 1 boy, grand wizard robe, crystal staff, ancient tome, sage, wise elder, magical aura, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, magical archive background, floating books, glowing runes, full body, standing, front view, 1 girl, grand wizard robe, crystal staff, ancient tome, sage, wise elder, magical aura, no mouth, brown hair
```

---

#### high_monk - 高僧

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 天空の寺院、雲海 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, sky temple background, sea of clouds, divine light, full body, standing, front view, 1 boy, ornate monk robe, prayer beads, enlightened master, high priest, spiritual aura, peaceful, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, sky temple background, sea of clouds, divine light, full body, standing, front view, 1 girl, ornate monk robe, prayer beads, enlightened master, high priestess, spiritual aura, peaceful, no mouth, brown hair
```

---

#### master_artisan - 匠

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 伝説の工房、宝石 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, legendary workshop background, gems, masterwork tools, full body, standing, front view, 1 boy, master smith, ornate apron, legendary hammer, jeweled creation, master artisan, perfectionist, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, legendary workshop background, gems, masterwork tools, full body, standing, front view, 1 girl, master smith, ornate apron, legendary hammer, jeweled creation, master artisan, perfectionist, no mouth, brown hair
```

---

#### virtuoso - 名人

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 豪華なコンサートホール、スポットライト |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, concert hall background, spotlight, grand stage, full body, standing, front view, 1 boy, virtuoso outfit, elegant violin, musical genius, master performer, charismatic, stage presence, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, concert hall background, spotlight, grand stage, full body, standing, front view, 1 girl, virtuoso outfit, elegant violin, musical genius, master performer, charismatic, stage presence, no mouth, brown hair
```

---

#### champion - チャンピオン

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | オリンピック競技場、歓声 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, olympic stadium background, cheering crowd, victory podium, full body, standing, front view, 1 boy, champion athlete, gold laurel wreath, trophy, ultimate champion, powerful, triumphant, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, olympic stadium background, cheering crowd, victory podium, full body, standing, front view, 1 girl, champion athlete, gold laurel wreath, trophy, ultimate champion, powerful, triumphant, no mouth, brown hair
```

---

### Master（達人）

#### hero - 英雄

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 伝説の戦場、朝焼け |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, legendary battlefield background, dawn sky, epic scenery, full body, standing, front view, 1 boy, legendary armor, holy sword, hero cape, legendary hero, commanding presence, glowing aura, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, legendary battlefield background, dawn sky, epic scenery, full body, standing, front view, 1 girl, legendary armor, holy sword, hero cape, legendary hero, commanding presence, glowing aura, no mouth, brown hair
```

---

#### arch_sage - 大賢者

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 宇宙、星々 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, cosmic background, stars, nebula, full body, standing, front view, 1 boy, cosmic robe, staff of ages, floating grimoire, arch sage, supreme wisdom, reality-bending power, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, cosmic background, stars, nebula, full body, standing, front view, 1 girl, cosmic robe, staff of ages, floating grimoire, arch sage, supreme wisdom, reality-bending power, no mouth, brown hair
```

---

#### enlightened - 覚者

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 涅槃、蓮の花 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, nirvana background, lotus flowers, divine radiance, full body, standing, front view, 1 boy, enlightened robes, golden halo, transcendent being, awakened one, inner peace, serene power, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, nirvana background, lotus flowers, divine radiance, full body, standing, front view, 1 girl, enlightened robes, golden halo, transcendent being, awakened one, inner peace, serene power, no mouth, brown hair
```

---

#### legend_artisan - 伝説の職人

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 神話の鍛冶場、虹色の炎 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mythical forge background, rainbow flames, divine anvil, full body, standing, front view, 1 boy, legendary smith, divine hammer, artifact creator, legend artisan, god-tier craftsmanship, magical creations, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mythical forge background, rainbow flames, divine anvil, full body, standing, front view, 1 girl, legendary smith, divine hammer, artifact creator, legend artisan, god-tier craftsmanship, magical creations, no mouth, brown hair
```

---

#### superstar - スーパースター

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 世界最大のステージ、花火 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, world stage background, fireworks, millions of fans, full body, standing, front view, 1 boy, superstar outfit, microphone, legendary performer, world-famous artist, dazzling presence, iconic, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, world stage background, fireworks, millions of fans, full body, standing, front view, 1 girl, superstar outfit, microphone, legendary performer, world-famous artist, dazzling presence, iconic, no mouth, brown hair
```

---

#### olympian - オリンピアン

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 神々の山、雷雲 |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mount olympus background, thunder clouds, divine realm, full body, standing, front view, 1 boy, divine athlete, god-like physique, lightning aura, olympian, legendary strength, immortal champion, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, mount olympus background, thunder clouds, divine realm, full body, standing, front view, 1 girl, divine athlete, god-like physique, lightning aura, olympian, legendary strength, immortal champion, no mouth, brown hair
```

---

### Grandmaster（極致）

#### habit_master - 習慣の極致

| 項目 | 内容 |
|------|------|
| 等身 | 4等身 |
| 背景 | 世界の頂点、オーロラ |

**男性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, world summit background, aurora borealis, cosmic energy, full body, standing, front view, 1 boy, grandmaster robes, crown of mastery, all-seeing eyes, habit master, transcended all limits, ultimate being, omnipotent aura, no mouth, brown hair
```

**女性プロンプト:**
```
<lora:Dungeon_Squad_IllustriousV5:1> pixel art, 4head tall, standard proportions, world summit background, aurora borealis, cosmic energy, full body, standing, front view, 1 girl, grandmaster robes, crown of mastery, all-seeing eyes, habit master, transcended all limits, ultimate being, omnipotent aura, no mouth, brown hair
```

---

## API呼び出しサンプル（PowerShell）

```powershell
# 男性画像生成
$body = @{
    prompt = "[上記プロンプトをコピー]"
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

# 女性画像生成（promptの性別部分とnegative_promptを入れ替え）
```

---

## 関連ドキュメント

- [IMAGE_GENERATION.md](IMAGE_GENERATION.md) - 画像生成の概要と設定
- [JOB_CREATION_GUIDE.md](JOB_CREATION_GUIDE.md) - ジョブ追加の完全ガイド
- [JOBS.md](JOBS.md) - ジョブシステムの設計詳細
