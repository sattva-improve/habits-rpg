/**
 * フロントエンド用ヘルパー関数
 * キャラクタースプライト（ドット絵）の取得・表示支援
 */

import { getUrl, list } from 'aws-amplify/storage';

/**
 * スプライト情報の型定義
 */
export interface SpriteInfo {
  spriteId: string;
  name: string;
  description: string;
  category: 'base' | 'outfit' | 'accessory' | 'effect';
  spriteKey: string;
  thumbnailKey?: string;
  frameCount: number;
  width: number;
  height: number;
  isDefault: boolean;
  unlockCondition: SpriteUnlockCondition | null;
}

export interface SpriteUnlockCondition {
  level?: number;
  job?: string;
  achievement?: string;
  stat?: Partial<Record<'VIT' | 'INT' | 'MND' | 'DEX' | 'CHA' | 'STR', number>>;
}

/**
 * 装備中のスプライト構成
 */
export interface EquippedSprites {
  base: string | null;
  outfit: string | null;
  accessory: string | null;
  effect: string | null;
}

/**
 * スプライト画像のURLを取得
 */
export async function getSpriteUrl(spriteKey: string): Promise<string> {
  try {
    const result = await getUrl({
      path: spriteKey,
    });
    return result.url.toString();
  } catch (error) {
    console.error('Failed to get sprite URL:', error);
    throw error;
  }
}

/**
 * サムネイル画像のURLを取得
 */
export async function getThumbnailUrl(thumbnailKey: string): Promise<string> {
  return getSpriteUrl(thumbnailKey);
}

/**
 * 全スプライト一覧を取得
 */
export async function listAllSprites(): Promise<string[]> {
  try {
    const result = await list({
      path: 'sprites/',
    });
    return result.items.map((item) => item.path);
  } catch (error) {
    console.error('Failed to list sprites:', error);
    throw error;
  }
}

/**
 * カテゴリ別スプライト一覧を取得
 */
export async function listSpritesByCategory(category: SpriteInfo['category']): Promise<string[]> {
  try {
    const result = await list({
      path: `sprites/${category}/`,
    });
    return result.items.map((item) => item.path);
  } catch (error) {
    console.error('Failed to list sprites by category:', error);
    throw error;
  }
}

/**
 * スプライトシートからフレームを切り出すための計算
 */
export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateSpriteFrame(
  frameIndex: number,
  frameCount: number,
  spriteWidth: number,
  spriteHeight: number
): SpriteFrame {
  const normalizedIndex = frameIndex % frameCount;
  return {
    x: normalizedIndex * spriteWidth,
    y: 0,
    width: spriteWidth,
    height: spriteHeight,
  };
}

/**
 * アニメーションタイマーのヘルパー
 */
export class SpriteAnimator {
  private frameIndex: number = 0;
  private frameCount: number;
  private frameInterval: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private onFrameChange: (frameIndex: number) => void;

  constructor(
    frameCount: number,
    fps: number = 8,
    onFrameChange: (frameIndex: number) => void
  ) {
    this.frameCount = frameCount;
    this.frameInterval = 1000 / fps;
    this.onFrameChange = onFrameChange;
  }

  start(): void {
    if (this.intervalId) return;
    
    this.intervalId = setInterval(() => {
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
      this.onFrameChange(this.frameIndex);
    }, this.frameInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.frameIndex = 0;
    this.onFrameChange(this.frameIndex);
  }

  getCurrentFrame(): number {
    return this.frameIndex;
  }
}

/**
 * Canvas描画ヘルパー
 */
export async function drawSpriteOnCanvas(
  ctx: CanvasRenderingContext2D,
  spriteUrl: string,
  frame: SpriteFrame,
  destX: number,
  destY: number,
  scale: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      ctx.drawImage(
        img,
        frame.x,
        frame.y,
        frame.width,
        frame.height,
        destX,
        destY,
        frame.width * scale,
        frame.height * scale
      );
      resolve();
    };
    
    img.onerror = reject;
    img.src = spriteUrl;
  });
}

/**
 * 複数レイヤーのスプライトを描画
 */
export async function drawCharacter(
  ctx: CanvasRenderingContext2D,
  sprites: EquippedSprites,
  frameIndex: number,
  spriteSize: number = 32,
  frameCount: number = 4,
  scale: number = 2
): Promise<void> {
  const frame = calculateSpriteFrame(frameIndex, frameCount, spriteSize, spriteSize);
  const destX = 0;
  const destY = 0;

  // クリア
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // レイヤー順に描画（後ろから前へ）
  const layers: (keyof EquippedSprites)[] = ['effect', 'base', 'outfit', 'accessory'];

  for (const layer of layers) {
    const spriteKey = sprites[layer];
    if (spriteKey) {
      try {
        const url = await getSpriteUrl(spriteKey);
        await drawSpriteOnCanvas(ctx, url, frame, destX, destY, scale);
      } catch (error) {
        console.error(`Failed to draw ${layer} sprite:`, error);
      }
    }
  }
}

/**
 * スプライト解放条件のチェック
 */
export function checkSpriteUnlockCondition(
  condition: SpriteUnlockCondition | null,
  userState: {
    level: number;
    jobs: string[];
    achievements: string[];
    stats: Record<string, number>;
  }
): boolean {
  if (!condition) return true; // 条件なし = 解放済み

  if (condition.level && userState.level < condition.level) {
    return false;
  }

  if (condition.job && !userState.jobs.includes(condition.job)) {
    return false;
  }

  if (condition.achievement && !userState.achievements.includes(condition.achievement)) {
    return false;
  }

  if (condition.stat) {
    for (const [stat, required] of Object.entries(condition.stat)) {
      if ((userState.stats[stat] || 0) < required) {
        return false;
      }
    }
  }

  return true;
}

/**
 * プリロードヘルパー
 */
export async function preloadSprites(spriteKeys: string[]): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();

  await Promise.all(
    spriteKeys.map(async (key) => {
      try {
        const url = await getSpriteUrl(key);
        urlMap.set(key, url);
        
        // 画像をプリロード
        const img = new Image();
        img.src = url;
      } catch (error) {
        console.error(`Failed to preload sprite: ${key}`, error);
      }
    })
  );

  return urlMap;
}

export default {
  getSpriteUrl,
  getThumbnailUrl,
  listAllSprites,
  listSpritesByCategory,
  calculateSpriteFrame,
  SpriteAnimator,
  drawSpriteOnCanvas,
  drawCharacter,
  checkSpriteUnlockCondition,
  preloadSprites,
};
