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
    // Novice
    beginner: '/sprites/male/beginner.png',
    // Apprentice (見習い)
    warrior_apprentice: '/sprites/male/warrior_apprentice.png',
    scholar_apprentice: '/sprites/male/scholar_apprentice.png',
    monk_apprentice: '/sprites/male/monk_apprentice.png',
    artisan_apprentice: '/sprites/male/artisan_apprentice.png',
    performer_apprentice: '/sprites/male/performer_apprentice.png',
    athlete_apprentice: '/sprites/male/athlete_apprentice.png',
    // Journeyman (職人)
    warrior: '/sprites/male/warrior.png',
    scholar: '/sprites/male/scholar.png',
    monk: '/sprites/male/monk.png',
    artisan: '/sprites/male/artisan.png',
    bard: '/sprites/male/bard.png',
    athlete: '/sprites/male/athlete.png',
    // Expert (熟練者)
    knight: '/sprites/male/knight.png',
    sage: '/sprites/male/sage.png',
    high_monk: '/sprites/male/high_monk.png',
    master_artisan: '/sprites/male/artisan.png', // フォールバック
    virtuoso: '/sprites/male/bard.png', // フォールバック
    champion: '/sprites/male/athlete.png', // フォールバック
    // Master (達人)
    hero: '/sprites/male/knight.png', // フォールバック
    arch_sage: '/sprites/male/sage.png', // フォールバック
    enlightened: '/sprites/male/high_monk.png', // フォールバック
    legend_artisan: '/sprites/male/artisan.png', // フォールバック
    superstar: '/sprites/male/bard.png', // フォールバック
    olympian: '/sprites/male/athlete.png', // フォールバック
    // Grandmaster (極致)
    habit_master: '/sprites/male/knight.png', // フォールバック
    // Legacy
    mage: '/sprites/male/mage.png',
    default: '/sprites/male/beginner.png',
  },
  female: {
    // Novice
    beginner: '/sprites/female/beginner.png',
    // Apprentice (見習い)
    warrior_apprentice: '/sprites/female/warrior_apprentice.png',
    scholar_apprentice: '/sprites/female/scholar_apprentice.png',
    monk_apprentice: '/sprites/female/monk_apprentice.png',
    artisan_apprentice: '/sprites/female/artisan_apprentice.png',
    performer_apprentice: '/sprites/female/performer_apprentice.png',
    athlete_apprentice: '/sprites/female/athlete_apprentice.png',
    // Journeyman (職人)
    warrior: '/sprites/female/warrior.png',
    scholar: '/sprites/female/scholar.png',
    monk: '/sprites/female/monk.png',
    artisan: '/sprites/female/artisan.png',
    bard: '/sprites/female/bard.png',
    athlete: '/sprites/female/athlete.png',
    // Expert (熟練者)
    knight: '/sprites/female/knight.png',
    sage: '/sprites/female/sage.png',
    high_monk: '/sprites/female/monk.png', // フォールバック
    master_artisan: '/sprites/female/artisan.png', // フォールバック
    virtuoso: '/sprites/female/bard.png', // フォールバック
    champion: '/sprites/female/athlete.png', // フォールバック
    // Master (達人)
    hero: '/sprites/female/knight.png', // フォールバック
    arch_sage: '/sprites/female/sage.png', // フォールバック
    enlightened: '/sprites/female/monk.png', // フォールバック
    legend_artisan: '/sprites/female/artisan.png', // フォールバック
    superstar: '/sprites/female/bard.png', // フォールバック
    olympian: '/sprites/female/athlete.png', // フォールバック
    // Grandmaster (極致)
    habit_master: '/sprites/female/knight.png', // フォールバック
    // Legacy
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
