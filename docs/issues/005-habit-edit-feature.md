# Issue: 習慣の編集機能

## タイトル
習慣の編集機能の実装

## 概要
現在、習慣の作成と削除は可能だが、一度作成した習慣を編集する機能が存在しない。ユーザーが習慣の名前、説明、カテゴリー、難易度などを後から変更できる編集機能を追加する。

## 現状の問題
1. 習慣を作成後に誤字や設定ミスに気づいても修正できない
2. 習慣の難易度や対象ステータスを変更したい場合、削除して再作成する必要がある
3. ユーザー体験の低下につながっている

## 期待される動作
1. ダッシュボードまたは習慣カードから「編集」ボタンをクリックして編集画面に遷移できる
2. 編集画面では習慣の以下の項目を変更可能:
   - 習慣名
   - 説明
   - アイコン
   - 色
   - カテゴリー
   - 上昇するステータス
   - 難易度
3. 編集を保存するとデータベースが更新され、ダッシュボードに反映される
4. キャンセルすると変更を破棄してダッシュボードに戻る

## 技術的な実装

### 1. ルート追加 (`frontend/src/App.tsx`)
- `/edit-habit/:habitId` ルートを追加

### 2. 習慣編集ページ (`frontend/src/pages/EditHabit.tsx`)
- CreateHabit.tsxをベースに作成
- URLパラメータから習慣IDを取得
- 既存の習慣データをフォームに読み込み
- 更新処理を実装

### 3. HabitCardコンポーネント (`frontend/src/components/HabitCard.tsx`)
- 編集ボタンを追加
- 編集ページへのナビゲーションを実装

### 4. ルート定数 (`frontend/src/constants/app.ts`)
- `EDIT_QUEST` ルートを追加

## 関連ファイル
- `frontend/src/App.tsx` - ルーティング
- `frontend/src/pages/CreateHabit.tsx` - 参考にする作成ページ
- `frontend/src/pages/EditHabit.tsx` - 新規作成する編集ページ
- `frontend/src/components/HabitCard.tsx` - 編集ボタン追加
- `frontend/src/constants/app.ts` - ルート定数
- `frontend/src/services/habit.ts` - 習慣更新サービス（既存）
- `frontend/src/contexts/UserContext.tsx` - 更新関数（既存）

## タスク分解
- [x] Issue作成
- [x] ルート定数の追加
- [x] 編集ページ（EditHabit.tsx）の作成
- [x] HabitCardに編集ボタンを追加
- [x] App.tsxにルート追加
- [ ] ユニットテスト
- [ ] E2Eテスト

## 受け入れ条件
1. 習慣カードから編集画面に遷移できる
2. 編集画面で習慣の各項目を変更できる
3. 変更を保存するとデータベースに反映される
4. キャンセルすると変更が破棄される
5. 保存/キャンセル後にダッシュボードに戻る
6. ストリークや完了記録は編集の影響を受けない

## 優先度
中（UX改善のため）

## ラベル
- enhancement
- frontend
- priority: medium
