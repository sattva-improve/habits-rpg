/**
 * ログユーティリティ
 * 
 * 開発環境でのみログを出力し、本番環境では抑制する
 */

const isDev = import.meta.env.DEV;

export const logger = {
  /**
   * デバッグログ（開発環境のみ）
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * 情報ログ（開発環境のみ）
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * 警告ログ（常に出力）
   */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },

  /**
   * エラーログ（常に出力）
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },
};

export default logger;
