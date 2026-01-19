import React, { useState, useEffect } from 'react';

export interface CharacterImageProps {
  /** 画像のURL */
  src: string;
  /** 代替テキスト */
  alt?: string;
  /** 表示幅（px） */
  width?: number;
  /** 表示高さ（px） */
  height?: number;
  /** 追加のクラス名 */
  className?: string;
  /** ピクセルアート風のレンダリングを使用するか */
  pixelated?: boolean;
  /** フォールバック画像のURL */
  fallbackSrc?: string;
  /** 背景画像のURL */
  backgroundSrc?: string;
}

/**
 * キャラクター画像表示コンポーネント
 * ドット絵風の静止画像を表示
 */
export function CharacterImage({
  src,
  alt = 'キャラクター',
  width = 96,
  height = 96,
  className = '',
  pixelated = true,
  fallbackSrc,
  backgroundSrc,
}: CharacterImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // 画像プリロード
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      } else {
        setHasError(true);
      }
    };
    img.src = currentSrc;
  }, [currentSrc, fallbackSrc]);

  // src が変更されたらリセット
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`bg-amber-800/50 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-amber-400/50 text-4xl">?</span>
      </div>
    );
  }

  // 背景画像がある場合はラッパーで囲む
  if (backgroundSrc) {
    return (
      <div
        className={`relative ${className}`}
        style={{ width, height }}
      >
        {/* 背景画像 */}
        <img
          src={backgroundSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            imageRendering: pixelated ? 'pixelated' : 'auto',
          }}
        />
        {/* キャラクター画像 */}
        {isLoaded ? (
          <img
            src={currentSrc}
            alt={alt}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              imageRendering: pixelated ? 'pixelated' : 'auto',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-amber-800/30 animate-pulse" />
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`bg-amber-800/50 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        width,
        height,
        objectFit: 'contain',
        imageRendering: pixelated ? 'pixelated' : 'auto',
      }}
    />
  );
}

/**
 * キャラクター画像パスのプリセット（男女別）
 * すべてのジョブIDに対応
 */
export const CHARACTER_IMAGE_PATHS = {
  male: {
    beginner: '/sprites/male/beginner.png',
    warrior: '/sprites/male/warrior.png',
    warrior_apprentice: '/sprites/male/warrior_apprentice.png',
    scholar: '/sprites/male/scholar.png',
    scholar_apprentice: '/sprites/male/scholar_apprentice.png',
    monk: '/sprites/male/monk.png',
    monk_apprentice: '/sprites/male/monk_apprentice.png',
    artisan: '/sprites/male/artisan.png',
    artisan_apprentice: '/sprites/male/artisan_apprentice.png',
    bard: '/sprites/male/bard.png',
    performer_apprentice: '/sprites/male/performer_apprentice.png',
    athlete: '/sprites/male/athlete.png',
    athlete_apprentice: '/sprites/male/athlete_apprentice.png',
    knight: '/sprites/male/knight.png',
    sage: '/sprites/male/sage.png',
    mage: '/sprites/male/mage.png',
    default: '/sprites/male/beginner.png',
  },
  female: {
    beginner: '/sprites/female/beginner.png',
    warrior: '/sprites/female/warrior.png',
    warrior_apprentice: '/sprites/female/warrior_apprentice.png',
    scholar: '/sprites/female/scholar.png',
    scholar_apprentice: '/sprites/female/scholar_apprentice.png',
    monk: '/sprites/female/monk.png',
    monk_apprentice: '/sprites/female/monk_apprentice.png',
    artisan: '/sprites/female/artisan.png',
    artisan_apprentice: '/sprites/female/artisan_apprentice.png',
    bard: '/sprites/female/bard.png',
    performer_apprentice: '/sprites/female/performer_apprentice.png',
    athlete: '/sprites/female/athlete.png',
    athlete_apprentice: '/sprites/female/athlete_apprentice.png',
    knight: '/sprites/female/knight.png',
    sage: '/sprites/female/sage.png',
    mage: '/sprites/female/mage.png',
    default: '/sprites/female/beginner.png',
  },
} as const;

export type Gender = 'male' | 'female';

/**
 * ジョブIDと性別に対応する画像パスを取得
 */
export function getCharacterImagePath(
  jobId?: string | null,
  gender: Gender = 'male'
): string {
  const paths = CHARACTER_IMAGE_PATHS[gender];
  if (!jobId) return paths.default;
  return paths[jobId as keyof typeof paths] ?? paths.default;
}

export default CharacterImage;
