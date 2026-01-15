/**
 * アプリケーション定数
 */

export const APP_NAME = 'Habits RPG';
export const APP_VERSION = '1.0.0';

// ルート定数
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  CREATE_QUEST: '/create-quest',
  ACHIEVEMENTS: '/achievements',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// ナビゲーション項目
export const NAV_ITEMS = [
  { label: 'ダッシュボード', path: ROUTES.DASHBOARD },
  { label: '習慣作成', path: ROUTES.CREATE_QUEST },
  { label: 'アチーブメント', path: ROUTES.ACHIEVEMENTS },
] as const;

// ブレイクポイント
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const;
