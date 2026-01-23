# 006: 習慣の難易度を固定化

## 概要

習慣の「難易度」選択を削除し、固定値（normal）に統一する。

## 背景・理由

- ユーザーエクスペリエンスのシンプル化
- 難易度による経験値の差異をなくし、全習慣を平等に扱う

## 変更内容

### 削除する機能
- 習慣作成時の難易度選択UI
- 習慣編集時の難易度選択UI
- 難易度に基づく経験値計算の分岐

### 変更するファイル

#### フロントエンド
- `frontend/src/pages/CreateHabit.tsx` - 難易度選択UIを削除
- `frontend/src/pages/EditHabit.tsx` - 難易度選択UIを削除
- `frontend/src/constants/game.ts` - `DIFFICULTY_CONFIG`を削除
- `frontend/src/services/habit.ts` - 難易度による経験値計算を固定値に変更
- `frontend/src/components/QuestsSection.tsx` - `DIFFICULTY_CONFIG`の使用を削除
- `frontend/src/types/index.ts` - `HabitDifficulty`の再エクスポートを削除

#### 共有型
- `shared/types/index.ts` - `HabitDifficulty`型を削除（後方互換性のため`Habit`インターフェースの`difficulty`フィールドは保持）

#### バックエンド
- `amplify/data/resource.ts` - `HabitDifficulty` enumは残すが、UIからは選択不可とする

#### ドキュメント
- `README.md` - 経験値計算の説明から難易度ボーナスを削除

#### テスト
- `tests/integration/api-test.ts` - difficultyフィールドのテストを調整

## 技術的詳細

### 経験値計算の変更

**変更前:**
```
獲得EXP = 基本EXP × 難易度ボーナス × ストリークボーナス × ジョブボーナス
難易度ボーナス = { easy: 0.5, normal: 1.0, hard: 1.5, very_hard: 2.0 }
```

**変更後:**
```
獲得EXP = 基本EXP × ストリークボーナス × ジョブボーナス
（難易度は常に normal = 1.0 固定）
```

### 後方互換性

- 既存の習慣データの`difficulty`フィールドは保持
- 新規作成時は自動的に`normal`が設定される
- バックエンドのスキーマは変更せず、フロントエンドのUIのみ削除

## 完了条件

- [x] 習慣作成画面から難易度選択が削除されている
- [x] 習慣編集画面から難易度選択が削除されている
- [x] 経験値が固定値（normal相当）で計算される
- [x] 既存の習慣データに影響がない
- [x] ドキュメントが更新されている

## 関連Issue

なし
