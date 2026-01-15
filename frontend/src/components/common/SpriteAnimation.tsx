import React, { useEffect, useState, useCallback } from 'react';

export interface SpriteAnimationProps {
  /** スプライトシート画像のURL */
  src: string;
  /** 1フレームの幅（px） */
  frameWidth: number;
  /** 1フレームの高さ（px） */
  frameHeight: number;
  /** 総フレーム数 */
  frameCount: number;
  /** フレームレート（fps）デフォルト: 8 */
  fps?: number;
  /** 行数（横並びの場合は1） */
  rows?: number;
  /** 列数 */
  columns?: number;
  /** 表示サイズの倍率 デフォルト: 2 */
  scale?: number;
  /** アニメーションを再生するか */
  isPlaying?: boolean;
  /** ループするか */
  loop?: boolean;
  /** 追加のクラス名 */
  className?: string;
  /** アニメーション名（idle, walk, attack等） */
  animationName?: string;
  /** 開始フレーム（特定の行から開始する場合） */
  startFrame?: number;
}

/**
 * スプライトシートアニメーションコンポーネント
 * タクティクスオウガ風のドット絵キャラクターをアニメーション表示
 */
export function SpriteAnimation({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  fps = 8,
  rows = 1,
  columns,
  scale = 2,
  isPlaying = true,
  loop = true,
  className = '',
  startFrame = 0,
}: SpriteAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const [isLoaded, setIsLoaded] = useState(false);

  // 列数を計算（指定がなければフレーム数から推測）
  const cols = columns ?? frameCount;

  // フレームの位置を計算
  const getFramePosition = useCallback((frame: number) => {
    const col = frame % cols;
    const row = Math.floor(frame / cols);
    return {
      x: -col * frameWidth,
      y: -row * frameHeight,
    };
  }, [cols, frameWidth, frameHeight]);

  // アニメーションループ
  useEffect(() => {
    if (!isPlaying || !isLoaded) return;

    const intervalMs = 1000 / fps;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const nextFrame = prev + 1;
        if (nextFrame >= startFrame + frameCount) {
          return loop ? startFrame : prev;
        }
        return nextFrame;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [fps, frameCount, isPlaying, loop, isLoaded, startFrame]);

  // 画像プリロード
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => console.error('Failed to load sprite:', src);
    img.src = src;
  }, [src]);

  const position = getFramePosition(currentFrame);
  const displayWidth = frameWidth * scale;
  const displayHeight = frameHeight * scale;

  if (!isLoaded) {
    return (
      <div
        className={`bg-amber-800/50 animate-pulse ${className}`}
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
      />
    );
  }

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        width: displayWidth,
        height: displayHeight,
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `url(${src})`,
          backgroundPosition: `${position.x}px ${position.y}px`,
          backgroundRepeat: 'no-repeat',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}

/**
 * キャラクターアバター用のプリセット設定
 */
export const SPRITE_PRESETS = {
  /** タクティクスオウガ風 32x48 アイドルアニメーション（低解像度） */
  tacticsOgreIdle: {
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    fps: 6,
    columns: 4,
    rows: 1,
  },
  /** タクティクスオウガ風 32x48 歩行アニメーション（低解像度） */
  tacticsOgreWalk: {
    frameWidth: 32,
    frameHeight: 48,
    frameCount: 4,
    fps: 8,
    columns: 4,
    rows: 1,
  },
  /** 高解像度 64x96 アイドルアニメーション（推奨） */
  hdIdle: {
    frameWidth: 64,
    frameHeight: 96,
    frameCount: 4,
    fps: 6,
    columns: 4,
    rows: 1,
  },
  /** 高解像度 64x96 歩行アニメーション */
  hdWalk: {
    frameWidth: 64,
    frameHeight: 96,
    frameCount: 4,
    fps: 8,
    columns: 4,
    rows: 1,
  },
  /** 超高解像度 128x192 アイドルアニメーション */
  ultraHdIdle: {
    frameWidth: 128,
    frameHeight: 192,
    frameCount: 4,
    fps: 6,
    columns: 4,
    rows: 1,
  },
  /** 32x32 小さめスプライト */
  smallIdle: {
    frameWidth: 32,
    frameHeight: 32,
    frameCount: 4,
    fps: 6,
    columns: 4,
    rows: 1,
  },
} as const;

export default SpriteAnimation;
