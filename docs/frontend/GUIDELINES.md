# フロントエンド開発ガイドライン

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui (Radix UI)
- **状態管理**: React Context
- **ルーティング**: React Router
- **チャート**: Recharts
- **トースト**: Sonner

## ディレクトリ構成

```
frontend/src/
├── components/           # UIコンポーネント
│   ├── ui/               # shadcn/ui ベースコンポーネント
│   └── common/           # 共通コンポーネント
├── contexts/             # React Context (認証、ユーザーデータ)
├── hooks/                # カスタムフック
├── pages/                # ページコンポーネント
├── services/             # APIサービス (GraphQL呼び出し)
├── lib/                  # ユーティリティ
├── constants/            # 定数定義
├── types/                # TypeScript型定義
└── styles/               # グローバルスタイル
```

## コーディング規約

### 命名規則

- **コンポーネント**: PascalCase (`UserProfile.tsx`)
- **フック**: camelCase + use接頭辞 (`useSound.ts`)
- **サービス**: camelCase (`userService.ts`)
- **定数**: SCREAMING_SNAKE_CASE (`MAX_LEVEL`)

### コンポーネント設計

```tsx
// ✅ Good: 機能ごとに分割
export function HabitCard({ habit, onComplete }: HabitCardProps) {
  // ...
}

// ❌ Bad: 一つのコンポーネントに多くの責務
export function Dashboard() {
  // 習慣、統計、カレンダーを全て含む
}
```

### インポート順序

```tsx
// 1. React/外部ライブラリ
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. 内部コンポーネント/コンテキスト
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

// 3. ユーティリティ/定数/型
import { LEVEL_THRESHOLDS } from '@/constants/game';
import type { Habit } from '@/types';
```

## スタイリング

### Tailwindクラス

- ゲームUIには `amber` / `slate` カラーを使用
- グラデーション: `bg-gradient-to-br from-slate-800/80 to-slate-700/80`
- ボーダー: `border-2 border-amber-600/50`

### カスタムクラス（globals.css）

```css
/* ゲームUI用 */
.game-panel {
  @apply bg-gradient-to-br from-slate-800/80 to-slate-700/80 
         border-2 border-amber-600/50 rounded-lg shadow-2xl 
         p-6 backdrop-blur-sm;
}
```

## サウンド

`useSound` フックを使用:

```tsx
import { useSound, playSoundGlobal } from '@/hooks';

// コンポーネント内
const { playSound } = useSound();
playSound('complete');

// コンポーネント外
playSoundGlobal('levelUp');
```

対応サウンド: `complete`, `levelUp`, `achievement`, `click`, `jobUnlock`, `menuOpen`, `error`, `success`

## API呼び出し

サービス層を経由:

```tsx
import { habitService } from '@/services';

// 習慣完了
await habitService.completeHabit(habitId);

// ユーザー更新
await userService.updateUser(userId, { displayName: 'New Name' });
```

## テスト

```bash
# 型チェック
npm run typecheck

# ビルド
npm run build
```
