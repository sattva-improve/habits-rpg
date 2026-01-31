# Issue #008: ジョブ一覧画面で解放条件を表示

## 概要

ジョブ（職業）一覧画面で、各ジョブの解放条件を視覚的に分かりやすく表示する機能を実装します。

現在は「Achievements」ページでジョブをHoverすることで条件を確認できますが、ジョブの解放を目指すユーザーにとって、より見やすく、条件達成状況が一目で分かるUIが必要です。

## 背景・理由

### 現在の問題点

1. **条件の視認性が低い**
   - Popoverを開かないと解放条件が見えない
   - 複数ジョブの条件を比較しにくい

2. **進捗が分からない**
   - 自分が現在どの条件を満たしているか不明
   - あとどれくらいで解放できるかが分からない

3. **モチベーション低下**
   - 次の目標が明確でないため、育成の方向性が定まらない

### ユーザーストーリー

> 「現在Lv.8で、STR 3、VIT 2なんだけど、次にどのジョブを目指せばいいかな？
> 
> 戦士になりたいけど、必要条件が見えないから、あとどれくらいSTRを上げればいいのか分からない...」

## 要件

### 機能要件

#### 1. ジョブ一覧の表示形式

**オプションA: 既存ページの改善（推奨）**
- Achievementsページの「職業」セクションをリッチ化
- Popoverを開かなくても条件が見える

**オプションB: 専用ページ作成**
- `/jobs` ページを新規作成
- ジョブツリー形式で前提関係を可視化

**オプションC: ダッシュボードウィジェット**
- ダッシュボードに「次に解放可能なジョブ」を表示

#### 2. 表示する情報

各ジョブカードに以下を表示：

| 項目 | 内容 | 例 |
|------|------|-----|
| **ジョブ名** | 日本語名 | 「戦士」 |
| **アイコン** | スプライト画像 | `/sprites/male/warrior.png` |
| **ティア** | ランク | 「いちにんまえ」 |
| **解放状態** | ロック/解放済み | 🔒 or ✅ |
| **解放条件** | 要件リスト | 下記参照 |
| **達成状況** | 進捗表示 | 下記参照 |

#### 3. 解放条件の表示形式

##### 既存のフォーマット（Achievements.tsx）
```
Lv.10, かしこさ 5, しょくぎょう: 見習い学者
```

##### 提案する新フォーマット

**方式A: チェックリスト形式（推奨）**
```
✅ Lv.10 (現在: Lv.12)
✅ かしこさ 5 (現在: 7)
❌ しょくぎょう: 見習い学者 (未解放)
━━━━━━━━━━━━━━━━
🔒 2/3 条件達成
```

**方式B: プログレスバー形式**
```
レベル: 12 / 10 ✅ [████████████] 120%
かしこさ: 7 / 5 ✅ [████████████] 140%
前提ジョブ: 0 / 1 ❌ [          ] 0%
━━━━━━━━━━━━━━━━
進捗: 66% (2/3)
```

**方式C: バッジ形式（コンパクト）**
```
📊 Lv.10 ✅  📖 かしこさ 5 ✅  🔒 見習い学者 ❌
```

#### 4. 条件の種類と表示

| 条件タイプ | 例 | 表示形式 |
|-----------|-----|---------|
| **レベル** | `level: 10` | `Lv.10 (現在: 12) ✅` |
| **ステータス** | `stats: { INT: 5 }` | `かしこさ 5 (現在: 3) ❌` |
| **前提ジョブ** | `jobs: ['scholar_apprentice']` | `しょくぎょう: 見習い学者 ❌` |
| **アチーブメント** | `achievements: ['level_99']` | `しょうごう: レベル99 ❌` |

#### 5. ソート・フィルタ機能

- **ソート**
  - 解放可能順（デフォルト）
  - ティア順
  - 名前順
  - 達成率順

- **フィルタ**
  - 解放済み
  - 未解放
  - もうすぐ解放可能（1条件以内）
  - ティア別

### 非機能要件

- **パフォーマンス**: 全ジョブ（36個）を即座にレンダリング
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: スクリーンリーダー対応
- **デザイン一貫性**: 既存のRPG風デザインに統一

## 技術仕様

### データフロー

```
shared/constants/jobs.ts (JOBS: JobDefinition[])
  ↓
UserContext.tsx (jobs, userJobs, userData)
  ↓
JobListPage / JobCard Component
  ↓
条件チェックロジック (checkRequirements)
  ↓
UI表示 (チェックリスト / プログレスバー)
```

### 条件チェックロジック（新規実装）

**ファイル**: `frontend/src/utils/jobRequirements.ts`（新規作成）

```typescript
import type { JobRequirements, User, UserJob, UserAchievement } from '@/types';

interface RequirementCheckResult {
  type: 'level' | 'stats' | 'jobs' | 'achievements';
  label: string; // 日本語表示
  required: number | string; // 必要値
  current: number | string;  // 現在値
  isMet: boolean; // 達成しているか
}

/**
 * ジョブ解放条件をチェック
 */
export function checkJobRequirements(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[]
): RequirementCheckResult[] {
  const results: RequirementCheckResult[] = [];

  // レベルチェック
  if (requirements.level) {
    results.push({
      type: 'level',
      label: 'レベル',
      required: requirements.level,
      current: user.level,
      isMet: user.level >= requirements.level,
    });
  }

  // ステータスチェック
  if (requirements.stats) {
    const statNames: Record<string, string> = {
      VIT: 'たいりょく',
      INT: 'かしこさ',
      MND: 'せいしん',
      DEX: 'きようさ',
      CHA: 'みりょく',
      STR: 'ちから',
    };
    
    for (const [stat, requiredValue] of Object.entries(requirements.stats)) {
      const currentValue = user[stat.toLowerCase() as keyof User] as number;
      results.push({
        type: 'stats',
        label: statNames[stat] ?? stat,
        required: requiredValue,
        current: currentValue,
        isMet: currentValue >= requiredValue,
      });
    }
  }

  // 前提ジョブチェック
  if (requirements.jobs) {
    for (const jobId of requirements.jobs) {
      const isUnlocked = userJobs.some(
        (uj) => uj.jobId === jobId && uj.isUnlocked
      );
      results.push({
        type: 'jobs',
        label: 'しょくぎょう',
        required: jobId, // ジョブ名は後で変換
        current: isUnlocked ? 'かいほうずみ' : 'みかいほう',
        isMet: isUnlocked,
      });
    }
  }

  // アチーブメントチェック
  if (requirements.achievements) {
    for (const achId of requirements.achievements) {
      const isUnlocked = userAchievements.some(
        (ua) => ua.achievementId === achId && ua.isUnlocked
      );
      results.push({
        type: 'achievements',
        label: 'しょうごう',
        required: achId, // アチーブメント名は後で変換
        current: isUnlocked ? 'かいほうずみ' : 'みかいほう',
        isMet: isUnlocked,
      });
    }
  }

  return results;
}

/**
 * ジョブが解放可能かどうか
 */
export function isJobUnlockable(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[]
): boolean {
  const results = checkJobRequirements(requirements, user, userJobs, userAchievements);
  return results.every((r) => r.isMet);
}

/**
 * 達成率を計算
 */
export function getJobUnlockProgress(
  requirements: JobRequirements,
  user: User,
  userJobs: UserJob[],
  userAchievements: UserAchievement[]
): { completed: number; total: number; percentage: number } {
  const results = checkJobRequirements(requirements, user, userJobs, userAchievements);
  const completed = results.filter((r) => r.isMet).length;
  const total = results.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}
```

### UIコンポーネント設計

#### オプション1: 既存ページ改善（最小実装）

**ファイル**: `frontend/src/pages/Achievements.tsx`（既存を修正）

**変更点**:
- Popover内の条件表示をチェックリスト形式に変更
- カード上に達成率バッジを追加

```tsx
{/* 達成率バッジ（カード上部） */}
{!job.isUnlocked && (
  <div className="absolute top-1 left-1 bg-slate-900/90 border border-purple-600/50 rounded px-1.5 py-0.5">
    <span className="text-[10px] text-purple-400">
      {progress.percentage}%
    </span>
  </div>
)}

{/* Popover内でチェックリスト表示 */}
<PopoverContent className="w-80 bg-slate-900 border border-purple-600/50 p-4">
  <h4 className="font-bold text-purple-200 mb-3">{job.title}</h4>
  <p className="text-sm text-purple-300/80 mb-3">{job.description}</p>
  
  {/* 解放条件チェックリスト */}
  <div className="space-y-2 mb-3">
    <div className="text-xs text-purple-400 font-semibold">解放条件:</div>
    {requirementResults.map((req, idx) => (
      <div key={idx} className="flex items-center gap-2 text-xs">
        {req.isMet ? (
          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
        ) : (
          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        <span className={req.isMet ? 'text-amber-300' : 'text-slate-400'}>
          {req.label} {req.required}
        </span>
        <span className="text-slate-500 text-[10px]">
          (現在: {req.current})
        </span>
      </div>
    ))}
  </div>
  
  {/* 進捗表示 */}
  <div className="border-t border-purple-800/30 pt-3">
    <div className="text-xs text-purple-400 mb-1">
      達成: {progress.completed} / {progress.total}
    </div>
    <div className="w-full bg-slate-800 rounded-full h-2">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
        style={{ width: `${progress.percentage}%` }}
      />
    </div>
  </div>
</PopoverContent>
```

#### オプション2: 専用ページ作成（拡張実装）

**ファイル**: `frontend/src/pages/Jobs.tsx`（新規作成）

**レイアウト**:
```
┌─────────────────────────────────────────┐
│ 🎯 ジョブ一覧                           │
│ ┌─────────────────────────────────────┐ │
│ │ フィルタ: [全て] [解放済] [未解放]   │ │
│ │ ソート: [解放可能順▼]               │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ▼ もうすぐ解放可能 (1)                  │
│ ┌────────────────┐                      │
│ │ 戦士           │ 達成: 2/3 (66%)     │
│ │ Lv.10 ✅       │                      │
│ │ STR 5 ✅       │                      │
│ │ 見習い戦士 ❌  │                      │
│ └────────────────┘                      │
│                                         │
│ ▼ 見習い (Apprentice)                   │
│ [見習い戦士] [見習い学者] [見習い僧侶]  │
│                                         │
│ ▼ 職人 (Journeyman)                    │
│ [戦士] [学者] [僧侶] ...               │
└─────────────────────────────────────────┘
```

**主要コンポーネント**:
```tsx
// JobCard with detailed requirements
<div className="bg-purple-950/60 border-2 border-purple-600/50 rounded-lg p-4">
  {/* ヘッダー */}
  <div className="flex items-center gap-3 mb-3">
    <div className="w-16 h-16 bg-purple-600 rounded-lg">
      <ImageWithFallback src={jobSpritePath} />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-purple-200">{job.name}</h3>
      <span className="text-sm text-purple-400">{tierLabels[job.tier]}</span>
    </div>
    {job.isUnlocked ? (
      <Check className="w-6 h-6 text-green-400" />
    ) : (
      <Lock className="w-6 h-6 text-slate-500" />
    )}
  </div>
  
  {/* 解放条件 */}
  {!job.isUnlocked && (
    <div className="space-y-2 mt-3 border-t border-purple-800/30 pt-3">
      <div className="text-xs text-purple-400 font-semibold">解放条件:</div>
      {requirementResults.map((req, idx) => (
        <RequirementItem key={idx} requirement={req} />
      ))}
      <ProgressBar progress={progress} />
    </div>
  )}
</div>
```

### 既存コードの影響範囲

| ファイル | 変更内容 | 影響度 |
|---------|---------|--------|
| `frontend/src/pages/Achievements.tsx` | Popover内の条件表示を改善 | 🟡 中 |
| `frontend/src/utils/jobRequirements.ts` | 新規作成（条件チェックロジック） | 🟢 低 |
| `frontend/src/pages/Jobs.tsx` | 新規作成（専用ページ） | 🟢 低 |
| `frontend/src/components/Navigation.tsx` | 「ジョブ」リンク追加（オプション2のみ） | 🟢 低 |

## UI/UXデザイン

### カラーパレット

| 要素 | カラー | 用途 |
|------|--------|------|
| **背景** | `from-purple-900/40 to-purple-800/40` | ジョブカード背景 |
| **ボーダー** | `border-purple-600/50` | カード枠線 |
| **達成済み** | `text-green-400` | ✅ チェックマーク |
| **未達成** | `text-red-400` | ❌ バツマーク |
| **進捗バー** | `from-purple-600 to-purple-400` | プログレスバー |

### アイコン使用

- ✅ `<Check className="w-4 h-4 text-green-400" />` - 達成済み
- ❌ `<X className="w-4 h-4 text-red-400" />` - 未達成
- 🔒 `<Lock className="w-6 h-6 text-slate-500" />` - ロック中
- 📊 `<TrendingUp />` - レベル要件
- 💪 `<Zap />` - ステータス要件

## 実装手順

### Phase 1: 最小実装（Achievements ページ改善）

**目標**: 既存ページで条件の視認性を向上

1. **条件チェックロジックの実装**
   - [ ] `frontend/src/utils/jobRequirements.ts` を作成
   - [ ] `checkJobRequirements` 関数を実装
   - [ ] `getJobUnlockProgress` 関数を実装

2. **Achievementsページの改善**
   - [ ] `Achievements.tsx` で `jobRequirements.ts` をインポート
   - [ ] Popover内の条件表示をチェックリスト形式に変更
   - [ ] カード上に達成率バッジを追加

3. **テスト**
   - [ ] 全ジョブの条件表示を確認
   - [ ] 達成率計算が正しいか検証

### Phase 2: 拡張実装（専用ページ作成）

**目標**: ジョブツリー・フィルタ機能を提供

1. **Jobs ページの作成**
   - [ ] `frontend/src/pages/Jobs.tsx` を新規作成
   - [ ] ティア別グループ化表示
   - [ ] フィルタ・ソート機能

2. **ナビゲーション追加**
   - [ ] `Navigation.tsx` に「ジョブ」リンク追加
   - [ ] ルーティング設定

3. **JobCard コンポーネント**
   - [ ] 詳細な条件表示
   - [ ] プログレスバー表示

### Phase 3: 最適化（オプション）

- [ ] 解放可能ジョブの通知機能
- [ ] ジョブツリーの視覚化（前提関係グラフ）
- [ ] お気に入りジョブ機能

## テストケース

### 条件チェックロジック

| テストケース | 入力 | 期待結果 |
|-------------|------|---------|
| レベル達成 | `level: 10`, `user.level: 12` | `isMet: true` |
| レベル未達成 | `level: 10`, `user.level: 8` | `isMet: false` |
| 複数ステータス | `stats: {STR: 5, VIT: 3}`, `user.strength: 6, vitality: 2` | `STR: true, VIT: false` |
| 前提ジョブ達成 | `jobs: ['warrior_apprentice']`, `userJobs: [{jobId: 'warrior_apprentice', isUnlocked: true}]` | `isMet: true` |

### UI表示

| テストケース | 確認項目 |
|-------------|---------|
| 全ジョブ表示 | 36個のジョブカードが正しく表示される |
| 達成率計算 | 進捗バーが正確に表示される |
| レスポンシブ | モバイル・タブレット・デスクトップで適切に表示 |
| ロード時間 | 初回レンダリングが1秒以内 |

## 参考資料

### 既存コード

- **条件表示の既存実装**: `frontend/src/pages/Achievements.tsx` (lines 113-183)
- **ジョブ定義**: `shared/constants/jobs.ts`
- **型定義**: `shared/types/index.ts` (`JobRequirements`, `JobDefinition`)
- **ユーザーデータ取得**: `frontend/src/contexts/UserContext.tsx`

### UIコンポーネント

- **Accordion**: `frontend/src/components/ui/accordion.tsx`
- **Badge**: `frontend/src/components/ui/badge.tsx`
- **Card**: `frontend/src/components/ui/card.tsx`
- **Popover**: `frontend/src/components/ui/popover.tsx`
- **Progress**: `frontend/src/components/ui/progress.tsx`

### デザインパターン

- **QuestsSection**: Accordion によるグループ化表示
- **HabitCard**: カード形式のアイテム表示
- **StatusCard**: ステータス表示のレイアウト

## 質問・検討事項

1. **実装スコープ**: Phase 1（最小実装）か Phase 2（拡張実装）か？
2. **条件表示形式**: チェックリスト、プログレスバー、バッジのどれが最適？
3. **配置場所**: Achievementsページ改善 vs 専用ページ新規作成？
4. **フィルタ機能**: 必要か？どのフィルタ条件が有用か？

## 成功指標

- [ ] ユーザーが次の目標ジョブを明確に把握できる
- [ ] 条件達成状況が一目で分かる
- [ ] ジョブ解放のモチベーションが向上する
- [ ] 問い合わせ「次のジョブの条件は？」がゼロになる

---

**作成日**: 2026-01-31  
**ステータス**: 🚧 設計中  
**優先度**: 🔵 中  
**難易度**: ⭐⭐ (中程度)
